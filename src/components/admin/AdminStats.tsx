
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, UserX, Shield, AlertTriangle, Calendar } from "lucide-react";

export function AdminStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching enhanced admin stats...');
      
      try {
        // Get total users
        const { count: totalUsers, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) {
          console.error('Error fetching total users:', totalError);
          throw totalError;
        }

        // Get approved users
        const { count: approvedUsers, error: approvedError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approved', true);

        if (approvedError) {
          console.error('Error fetching approved users:', approvedError);
          throw approvedError;
        }

        // Get pending users
        const { count: pendingUsers, error: pendingError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approved', false);

        if (pendingError) {
          console.error('Error fetching pending users:', pendingError);
          throw pendingError;
        }

        // Get admin users
        const { count: adminUsers, error: adminError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        if (adminError) {
          console.error('Error fetching admin users:', adminError);
          throw adminError;
        }

        // Get recent signups (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { count: recentSignups, error: recentError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        if (recentError) {
          console.error('Error fetching recent signups:', recentError);
          throw recentError;
        }

        // Get users with suspicious patterns (no first/last name)
        const { count: suspiciousUsers, error: suspiciousError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('first_name.is.null,last_name.is.null,first_name.eq.,last_name.eq.')
          .eq('approved', false);

        if (suspiciousError) {
          console.error('Error fetching suspicious users:', suspiciousError);
          throw suspiciousError;
        }

        const statsData = {
          totalUsers: totalUsers || 0,
          approvedUsers: approvedUsers || 0,
          pendingUsers: pendingUsers || 0,
          adminUsers: adminUsers || 0,
          recentSignups: recentSignups || 0,
          suspiciousUsers: suspiciousUsers || 0,
        };

        console.log('Admin stats fetched successfully:', statsData);
        return statsData;
      } catch (error) {
        console.error('Error in admin stats query:', error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Admin stats error:', error);
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading statistics</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Check the console for more details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
