
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService, Project, ProjectDetail } from '../../services/projectService';

interface ProjectsState {
  projects: Project[];
  selectedProject: ProjectDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

// Async thunks for projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ page, pageSize }: { page: number, pageSize: number }, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects(page, pageSize);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const selectProject = createAsyncThunk(
  'projects/selectProject',
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { projects: ProjectsState };
      const project = state.projects.projects.find(p => p._id === projectId);
      
      if (project) {
        return {
          _id: project._id,
          name: project.name,
          description: project.description,
        };
      }
      
      return rejectWithValue('Project not found');
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.meta.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.meta.pageSize = action.payload;
      state.meta.page = 1; // Reset to first page when changing page size
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data || [];
        const apiMeta = action.payload.meta || {};
        state.meta = {
          total: apiMeta.total || 0,
          page: apiMeta.page || 1,
          pageSize: apiMeta.page_size || 10,
          totalPages: apiMeta.total_pages || 1,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(selectProject.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(selectProject.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(selectProject.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload as string;
        state.selectedProject = null;
      });
  },
});

export const { setPage, setPageSize, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;
