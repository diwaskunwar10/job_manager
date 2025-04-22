import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AGENTS, JOBS } from '../../constants/apiEndpoints';
import { Agent } from '../../types/agent';
import { 
  createGetApiAction, 
  createPostApiAction,
  createDeleteApiAction
} from '../apiActionCreator';

interface AgentsState {
  agents: Agent[];
  assignedAgents: Agent[];
  isLoading: boolean;
  isAssignedAgentsLoading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const initialState: AgentsState = {
  agents: [],
  assignedAgents: [],
  isLoading: false,
  isAssignedAgentsLoading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

// API action creators
export const getAllAgentsApi = createGetApiAction<Agent[] | { agents: Agent[] }>(
  'agents/getAllAgents',
  AGENTS.GET_ALL_AGENTS
);

export const getAssignedAgentsApi = createGetApiAction<{ data: Agent[] }, string>(
  'agents/getAssignedAgents',
  (jobId) => JOBS.GET_ASSIGNED_AGENTS(jobId)
);

export const assignAgentToJobApi = createPostApiAction<any, { jobId: string, agentId: string }>(
  'agents/assignAgentToJob',
  ({ jobId }) => JOBS.ASSIGN_AGENT(jobId)
);

export const removeAgentFromJobApi = createDeleteApiAction<any, { jobId: string, agentId: string }>(
  'agents/removeAgentFromJob',
  ({ jobId, agentId }) => JOBS.UNASSIGN_AGENT(jobId, agentId)
);

// Thunk action creators that use the API action creators
export const fetchAgents = () => (dispatch: any) => {
  dispatch(getAllAgentsApi({
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching agents:', error);
    }
  }));
};

export const fetchAssignedAgents = (jobId: string) => (dispatch: any) => {
  dispatch(getAssignedAgentsApi({
    additionalParams: jobId,
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching assigned agents:', error);
    }
  }));
};

export const assignAgent = ({ jobId, agentId }: { jobId: string, agentId: string }) => (dispatch: any) => {
  dispatch(assignAgentToJobApi({
    additionalParams: { jobId, agentId },
    params: {
      agent_id: agentId
    },
    successCallback: () => {
      // Refresh assigned agents after assignment
      dispatch(fetchAssignedAgents(jobId));
    },
    failureCallback: (error) => {
      console.error('Error assigning agent:', error);
    }
  }));
};

export const unassignAgent = ({ jobId, agentId }: { jobId: string, agentId: string }) => (dispatch: any) => {
  dispatch(removeAgentFromJobApi({
    additionalParams: { jobId, agentId },
    successCallback: () => {
      // Refresh assigned agents after unassignment
      dispatch(fetchAssignedAgents(jobId));
    },
    failureCallback: (error) => {
      console.error('Error unassigning agent:', error);
    }
  }));
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgentsPage: (state, action: PayloadAction<number>) => {
      state.meta.page = action.payload;
    },
    setAgentsPageSize: (state, action: PayloadAction<number>) => {
      state.meta.pageSize = action.payload;
      state.meta.page = 1; // Reset to first page when changing page size
    },
    clearAssignedAgents: (state) => {
      state.assignedAgents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all agents
      .addCase(getAllAgentsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllAgentsApi.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          state.agents = action.payload;
          state.meta.totalPages = Math.ceil(action.payload.length / state.meta.pageSize);
        } else if (action.payload.agents && Array.isArray(action.payload.agents)) {
          state.agents = action.payload.agents;
          if ('total_agents' in action.payload) {
            state.meta.totalPages = Math.ceil(action.payload.total_agents / state.meta.pageSize);
          } else {
            state.meta.totalPages = Math.ceil(action.payload.agents.length / state.meta.pageSize);
          }
        } else {
          state.agents = [];
        }
      })
      .addCase(getAllAgentsApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get assigned agents
      .addCase(getAssignedAgentsApi.pending, (state) => {
        state.isAssignedAgentsLoading = true;
        state.error = null;
      })
      .addCase(getAssignedAgentsApi.fulfilled, (state, action) => {
        state.isAssignedAgentsLoading = false;
        
        // Handle different response formats
        if (action.payload && action.payload.data) {
          state.assignedAgents = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.assignedAgents = action.payload;
        } else {
          state.assignedAgents = [];
        }
      })
      .addCase(getAssignedAgentsApi.rejected, (state, action) => {
        state.isAssignedAgentsLoading = false;
        state.error = action.payload as string;
      })
      
      // Handle assign agent - no state changes needed as we're refreshing the list
      .addCase(assignAgentToJobApi.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Handle unassign agent - no state changes needed as we're refreshing the list
      .addCase(removeAgentFromJobApi.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setAgentsPage, setAgentsPageSize, clearAssignedAgents } = agentsSlice.actions;
export default agentsSlice.reducer;
