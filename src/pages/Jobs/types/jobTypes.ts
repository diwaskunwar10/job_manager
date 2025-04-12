
export interface Job {
  _id: string;
  id: string; // Required for backward compatibility
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_id: string;
  project_name: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
}

export type StatusFilterType = 'assigned' | 'unassigned' | 'all';
