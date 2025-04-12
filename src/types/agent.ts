export interface Agent {
  id: string;
  name: string;
  role: string;
  status?: 'available' | 'busy' | 'offline';
}
