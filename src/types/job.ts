
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

export interface OutputItem {
  type: 'text' | 'image' | 'file' | 'video' | 'audio' | 'json' | 'html';
  content: string;
  mime_type?: string;
  name?: string;
  metadata?: Record<string, any>;
}

export interface JobOutput {
  job_id: string;
  output: OutputItem[];
  metadata?: Record<string, any>;
  created_at?: string;
}
