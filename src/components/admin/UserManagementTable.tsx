
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Shield, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  user_roles: { role: string }[];
}

export function UserManagementTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users for admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          first_name,
          last_name,
          approved,
          approved_at,
          created_at,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', data);
      return data as UserProfile[];
    },
  });

  const approveUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log('Approving user:', userId);
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          approved: true,
          approved_at: new Date().toISOString(),
          approved_by: currentUser.user?.id
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User Approved",
        description: "User has been successfully approved.",
      });
    },
    onError: (error) => {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log('Rejecting user:', userId);
      // Delete the user profile and auth user
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User Rejected",
        description: "User has been rejected and removed from the system.",
      });
    },
    onError: (error) => {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      console.log('Toggling admin role for user:', userId, 'isAdmin:', isAdmin);
      
      if (isAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">User Management</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {users?.length || 0} Total Users
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            const isAdmin = user.user_roles.some(role => role.role === 'admin');
            const isPending = !user.approved;
            
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.approved ? (
                    <Badge variant="default" className="flex items-center gap-1 w-fit">
                      <CheckCircle className="h-3 w-3" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <XCircle className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={isAdmin ? "default" : "secondary"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {isAdmin ? 'Admin' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveUserMutation.mutate({ userId: user.id })}
                          disabled={approveUserMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectUserMutation.mutate({ userId: user.id })}
                          disabled={rejectUserMutation.isPending}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {user.approved && (
                      <Button
                        size="sm"
                        variant={isAdmin ? "destructive" : "default"}
                        onClick={() => toggleAdminMutation.mutate({ userId: user.id, isAdmin })}
                        disabled={toggleAdminMutation.isPending}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {users?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found.
        </div>
      )}
    </div>
  );
}
