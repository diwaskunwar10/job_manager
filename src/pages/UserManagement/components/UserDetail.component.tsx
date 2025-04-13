import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

// Ensure User is properly typed
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login?: string;
}

const UserDetailComponent: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock API call - replace with actual API endpoint
        const mockUser = {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setUser(mockUser as User);
        setName(mockUser.name);
        setEmail(mockUser.email);
        setRole(mockUser.role);
        setStatus(mockUser.status);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRole(user?.role || '');
    setStatus(user?.status || '');
  };

  const handleSaveClick = () => {
    // Mock API call - replace with actual API endpoint
    const updatedUser = {
      ...user,
      name,
      email,
      role,
      status,
    };

    setUser(updatedUser as User);
    setEditMode(false);
  };

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <h2 className="text-lg font-semibold">User Details</h2>
        <p className="text-sm text-muted-foreground">
          Information about the selected user.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole} disabled={!editMode}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus} disabled={!editMode}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Last Login</Label>
          <p className="text-sm text-muted-foreground">
            {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Created At</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="terms">Accept terms</Label>
          <Switch id="terms" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!editMode ? (
          <Button onClick={handleEditClick}>Edit</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>Save</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserDetailComponent;
