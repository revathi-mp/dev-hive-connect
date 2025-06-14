
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

export function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin stats...');
      
      // Total users
      const { count: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total users:', totalError);
        throw totalError;
      }

      // Approved users
      const { count: approvedUsers, error: approvedError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      if (approvedError) {
        console.error('Error fetching approved users:', approvedError);
        throw approvedError;
      }

      // Pending users
      const { count: pendingUsers, error: pendingError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      if (pendingError) {
        console.error('Error fetching pending users:', pendingError);
        throw pendingError;
      }

      // Recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentUsers, error: recentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      if (recentError) {
        console.error('Error fetching recent users:', recentError);
        throw recentError;
      }

      const result = {
        totalUsers: totalUsers || 0,
        approvedUsers: approvedUsers || 0,
        pendingUsers: pendingUsers || 0,
        recentUsers: recentUsers || 0,
      };

      console.log('Admin stats fetched:', result);
      return result;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading statistics...</div>;
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "All registered users",
      color: "text-blue-600",
    },
    {
      title: "Approved Users",
      value: stats?.approvedUsers || 0,
      icon: UserCheck,
      description: "Users with approved accounts",
      color: "text-green-600",
    },
    {
      title: "Pending Approval",
      value: stats?.pendingUsers || 0,
      icon: Clock,
      description: "Users awaiting approval",
      color: "text-yellow-600",
    },
    {
      title: "New Users (7 days)",
      value: stats?.recentUsers || 0,
      icon: UserX,
      description: "Recently registered users",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
