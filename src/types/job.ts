
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

// Aroma Backend v2 JobItem interface
export interface JobItem {
  input_id: string;
  output_id: string;
  status: string;
}

// Media content interface for input/output content
export interface MediaContent {
  filename: string;
  content_type: string;
  description: string | null;
  bucket_name: string;
  object_name: string;
  _id: string;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  job_id: string;
  uploaded_at: string;
  uploaded_by: string;
  metadata?: {
    source_uri?: string;
    [key: string]: any;
  };
  // For backward compatibility
  content?: string;
}

export interface JobOutput {
  // For Aroma Backend v2
  data?: JobItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };

  // For backward compatibility
  job_id?: string;
  input?: string;
  output?: string;
  items?: any[];
  metadata?: Record<string, any>;
  created_at?: string;
}
