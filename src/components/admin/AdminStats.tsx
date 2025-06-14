
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, UserX, Shield, AlertTriangle, Calendar } from "lucide-react";

export function AdminStats() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching enhanced admin stats...');
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get approved users
      const { count: approvedUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      // Get pending users
      const { count: pendingUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      // Get admin users
      const { count: adminUsers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Get recent signups (last 24 hours) - potential fake user indicator
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: recentSignups } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      // Get users with suspicious patterns (no first/last name)
      const { count: suspiciousUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('first_name.is.null,last_name.is.null,first_name.eq.,last_name.eq.')
        .eq('approved', false);

      return {
        totalUsers: totalUsers || 0,
        approvedUsers: approvedUsers || 0,
        pendingUsers: pendingUsers || 0,
        adminUsers: adminUsers || 0,
        recentSignups: recentSignups || 0,
        suspiciousUsers: suspiciousUsers || 0,
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            All registered users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats?.approvedUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            Active forum members
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats?.pendingUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats?.adminUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            System admins
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
          <Calendar className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats?.recentSignups || 0}</div>
          <p className="text-xs text-muted-foreground">
            Last 24 hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suspicious Profiles</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats?.suspiciousUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            Incomplete profiles
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
