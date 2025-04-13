
export interface Agent {
  _id: string;
  id?: string;
  name?: string;
  username: string;
  status?: 'active' | 'inactive' | 'busy' | 'available' | 'offline';
  type?: string;
  role?: string;
  performance?: {
    completedJobs?: number;
    averageTime?: number;
  };
  assignedJobs?: number;
}
