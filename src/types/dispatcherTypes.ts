
export type ActionType = 
  | 'FETCH_START' 
  | 'FETCH_SUCCESS' 
  | 'FETCH_ERROR'
  | 'SET_TENANT'
  | 'CLEAR_TENANT'
  | 'LOGIN_SUCCESS'
  | 'LOGOUT';

export interface Action {
  type: ActionType;
  payload?: any;
}

export interface State {
  isLoading: boolean;
  error: string | null;
  data: any | null;
  tenant: TenantDetails | null;
  isAuthenticated: boolean;
}

export interface TenantDetails {
  tenant_id: string;
  name: string;
  slug: string;
}

export const initialState: State = {
  isLoading: false,
  error: null,
  data: null,
  tenant: null,
  isAuthenticated: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'SET_TENANT':
      return {
        ...state,
        tenant: action.payload,
      };
    case 'CLEAR_TENANT':
      return {
        ...state,
        tenant: null,
        isAuthenticated: false
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
