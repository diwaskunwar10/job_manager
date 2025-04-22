
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PROJECTS } from '../../constants/apiEndpoints';
import { Project, ProjectDetail } from '../../services/projectService';
import {
  createGetApiAction,
  createPostApiAction,
  createDeleteApiAction,
  createPutApiAction
} from '../apiActionCreator';

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

// API action creators
export const getProjectsApi = createGetApiAction<any>(
  'projects/getProjects',
  PROJECTS.GET_PROJECTS
);

export const getProjectByIdApi = createGetApiAction<ProjectDetail, string>(
  'projects/getProjectById',
  (projectId) => PROJECTS.PROJECT_BY_ID(projectId)
);

export const createProjectApi = createPostApiAction<Project>(
  'projects/createProject',
  PROJECTS.CREATE_PROJECT
);

export const updateProjectApi = createPutApiAction<ProjectDetail, string>(
  'projects/updateProject',
  (projectId) => PROJECTS.UPDATE_PROJECT(projectId)
);

export const deleteProjectApi = createDeleteApiAction<any, string>(
  'projects/deleteProject',
  (projectId) => PROJECTS.DELETE_PROJECT(projectId)
);

// Thunk action creators that use the API action creators
export const fetchProjects = ({ page, pageSize }: { page: number, pageSize: number }) => (dispatch: any) => {
  dispatch(getProjectsApi({
    params: {
      page: page.toString(),
      pageSize: pageSize.toString()
    },
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching projects:', error);
    }
  }));
};

export const fetchProjectById = (projectId: string) => (dispatch: any) => {
  dispatch(getProjectByIdApi({
    additionalParams: projectId,
    successCallback: (response) => {
      // No additional actions needed as the slice handles the state updates
    },
    failureCallback: (error) => {
      console.error('Error fetching project details:', error);
    }
  }));
};

export const selectProject = (projectId: string) => (dispatch: any, getState: any) => {
  const state = getState() as { projects: ProjectsState };
  const project = state.projects.projects.find(p => p._id === projectId);

  if (project) {
    // If project is already in state, just select it
    dispatch({
      type: 'projects/selectProject/fulfilled',
      payload: {
        _id: project._id,
        name: project.name,
        description: project.description,
      }
    });
  } else {
    // Otherwise fetch it from the API
    dispatch(fetchProjectById(projectId));
  }
};

export const createProject = (projectData: Partial<Project>) => (dispatch: any) => {
  dispatch(createProjectApi({
    data: projectData,
    successCallback: (response) => {
      // Refresh projects list after creation
      dispatch(fetchProjects({ page: 1, pageSize: 10 }));
    },
    failureCallback: (error) => {
      console.error('Error creating project:', error);
    }
  }));
};

export const updateProject = (projectId: string, projectData: Partial<ProjectDetail>) => (dispatch: any) => {
  dispatch(updateProjectApi({
    additionalParams: projectId,
    data: projectData,
    successCallback: (response) => {
      // Refresh project details after update
      dispatch(fetchProjectById(projectId));
    },
    failureCallback: (error) => {
      console.error('Error updating project:', error);
    }
  }));
};

export const deleteProject = (projectId: string) => (dispatch: any) => {
  dispatch(deleteProjectApi({
    additionalParams: projectId,
    successCallback: () => {
      // Refresh projects list after deletion
      dispatch(fetchProjects({ page: 1, pageSize: 10 }));
      // Clear selected project if it was deleted
      dispatch(clearSelectedProject());
    },
    failureCallback: (error) => {
      console.error('Error deleting project:', error);
    }
  }));
};

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
      // Get projects
      .addCase(getProjectsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectsApi.fulfilled, (state, action) => {
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
      .addCase(getProjectsApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get project by ID
      .addCase(getProjectByIdApi.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(getProjectByIdApi.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(getProjectByIdApi.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload as string;
        state.selectedProject = null;
      })

      // Create project
      .addCase(createProjectApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createProjectApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProjectApi.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(updateProjectApi.fulfilled, (state) => {
        state.isDetailLoading = false;
      })
      .addCase(updateProjectApi.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProjectApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProjectApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setPageSize, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;
