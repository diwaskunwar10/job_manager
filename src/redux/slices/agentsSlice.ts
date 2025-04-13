
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import JobService from '../../services/jobService';
import { Agent } from '../../types/agent';

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

// Async thunks for agents
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await JobService.getAllAgents();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchAssignedAgents = createAsyncThunk(
  'agents/fetchAssignedAgents',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await JobService.getAssignedAgents(jobId);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const assignAgent = createAsyncThunk(
  'agents/assignAgent',
  async ({ jobId, agentId }: { jobId: string, agentId: string }, { rejectWithValue, dispatch }) => {
    try {
      await JobService.assignAgentToJob(jobId, agentId);
      // Refresh assigned agents after assignment
      dispatch(fetchAssignedAgents(jobId));
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const unassignAgent = createAsyncThunk(
  'agents/unassignAgent',
  async ({ jobId, agentId }: { jobId: string, agentId: string }, { rejectWithValue, dispatch }) => {
    try {
      await JobService.removeAgentFromJob(jobId, agentId);
      // Refresh assigned agents after unassignment
      dispatch(fetchAssignedAgents(jobId));
      return { agentId };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

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
      // Fetch all agents
      .addCase(fetchAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          state.agents = action.payload;
          state.meta.totalPages = Math.ceil(action.payload.length / state.meta.pageSize);
        } else if (action.payload.agents && Array.isArray(action.payload.agents)) {
          state.agents = action.payload.agents;
          if (action.payload.total_agents) {
            state.meta.totalPages = Math.ceil(action.payload.total_agents / state.meta.pageSize);
          } else {
            state.meta.totalPages = Math.ceil(action.payload.agents.length / state.meta.pageSize);
          }
        } else if (action.payload.data && Array.isArray(action.payload.data)) {
          state.agents = action.payload.data;
          if (action.payload.meta && action.payload.meta.total_pages) {
            state.meta.totalPages = action.payload.meta.total_pages;
          } else {
            state.meta.totalPages = Math.ceil(action.payload.data.length / state.meta.pageSize);
          }
        } else {
          state.agents = [];
        }
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch assigned agents
      .addCase(fetchAssignedAgents.pending, (state) => {
        state.isAssignedAgentsLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedAgents.fulfilled, (state, action) => {
        state.isAssignedAgentsLoading = false;
        
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          state.assignedAgents = action.payload;
        } else if (action.payload.data && Array.isArray(action.payload.data)) {
          state.assignedAgents = action.payload.data;
        } else {
          state.assignedAgents = [];
        }
      })
      .addCase(fetchAssignedAgents.rejected, (state, action) => {
        state.isAssignedAgentsLoading = false;
        state.error = action.payload as string;
      })
      
      // Handle assign agent - no state changes needed as we're refreshing the list
      .addCase(assignAgent.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Handle unassign agent - no state changes needed as we're refreshing the list
      .addCase(unassignAgent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setAgentsPage, setAgentsPageSize, clearAssignedAgents } = agentsSlice.actions;
export default agentsSlice.reducer;
