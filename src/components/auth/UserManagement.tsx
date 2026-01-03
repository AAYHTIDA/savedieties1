import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Users, UserPlus, Trash2 } from 'lucide-react';
import { firebaseApi } from '@/lib/firebase';
import { AppUser } from '@/types/courtCase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AddUserForm } from './AddUserForm';

interface UserManagementProps {
  onClose?: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [showAddUser, setShowAddUser] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => firebaseApi.getUsers(),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ userId, isEnabled }: { userId: string; isEnabled: boolean }) => 
      firebaseApi.toggleUserEnabled(userId, isEnabled),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(variables.isEnabled ? 'User enabled' : 'User disabled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => firebaseApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const handleToggle = (user: AppUser) => {
    toggleMutation.mutate({ userId: user.id, isEnabled: !user.isEnabled });
  };

  const handleDelete = (user: AppUser) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const handleAddUserSuccess = () => {
    setShowAddUser(false);
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  if (showAddUser) {
    return (
      <AddUserForm 
        onSuccess={handleAddUserSuccess} 
        onCancel={() => setShowAddUser(false)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold">User Management</h3>
        </div>
        <Button 
          onClick={() => setShowAddUser(true)}
          className="bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : users && users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  {user.isAdmin && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${user.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Switch
                    checked={user.isEnabled}
                    onCheckedChange={() => handleToggle(user)}
                    disabled={toggleMutation.isPending || user.isAdmin}
                  />
                </div>
                
                {!user.isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No users found</p>
          <Button 
            onClick={() => setShowAddUser(true)}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add First User
          </Button>
        </div>
      )}
    </div>
  );
};
