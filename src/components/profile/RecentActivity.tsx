
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Star, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ActivityItem {
  type: 'post' | 'comment' | 'badge';
  title: string;
  date: string;
  icon?: typeof Medal | typeof Star | typeof Activity;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([
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
  ]);
  
  const { toast } = useToast();
  
  const clearActivity = (index: number) => {
    const newActivities = [...activities];
    const removed = newActivities.splice(index, 1)[0];
    setActivities(newActivities);
    
    toast({
      title: "Activity Removed",
      description: `"${removed.title}" has been cleared from your activity.`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        {activities.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setActivities([]);
              toast({
                title: "Activities Cleared",
                description: "All activities have been cleared from your list."
              });
            }}
          >
            Clear All
          </Button>
        )}
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => clearActivity(index)}
                >
                  ×
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
