
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Star, Activity } from "lucide-react";

interface ActivityItem {
  type: 'post' | 'comment' | 'badge';
  title: string;
  date: string;
  icon?: typeof Medal | typeof Star | typeof Activity;
}

export function RecentActivity() {
  // Mock activity data
  const activities: ActivityItem[] = [
    {
      type: 'badge',
      title: 'Earned Pro Badge',
      date: '2 hours ago',
      icon: Star
    },
    {
      type: 'post',
      title: 'Created new post: "React Best Practices"',
      date: '1 day ago',
      icon: Activity
    },
    {
      type: 'comment',
      title: 'Commented on "TypeScript Tips"',
      date: '2 days ago',
      icon: Activity
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground">No recent activity to show.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                {activity.icon && (
                  <activity.icon className={`h-5 w-5 ${
                    activity.type === 'badge' ? 'text-yellow-500' :
                    activity.type === 'post' ? 'text-blue-500' :
                    'text-green-500'
                  }`} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
