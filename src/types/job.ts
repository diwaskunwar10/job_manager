
export interface Job {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  project_id: string;
  project_name?: string;
  created_at: string;
  created_by?: string;
  executed_at?: string;
  completed_at?: string;
  type?: string;
  verified?: boolean;
}
