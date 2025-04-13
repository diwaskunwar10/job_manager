
export interface Agent {
  _id: string; // Added missing property
  id?: string;
  name?: string;
  username: string; // Added missing property
  status?: 'active' | 'inactive' | 'busy';
  type?: string;
  performance?: {
    completedJobs?: number;
    averageTime?: number;
  };
  assignedJobs?: number;
}
