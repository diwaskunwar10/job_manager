
export interface Agent {
  _id: string;
  id?: string;
  name?: string;
  username: string;
  status?: 'active' | 'inactive' | 'busy';
  type?: string;
  role?: string; // Added missing property that's used in AgentList and AssignmentPanel
  performance?: {
    completedJobs?: number;
    averageTime?: number;
  };
  assignedJobs?: number;
}
