export interface Job {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_id: string;
  project_name: string;
  created_at: string;
  executed_at?: string;
  completed_at?: string;
}
