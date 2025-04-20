
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Github } from "lucide-react";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Sarah Johnson",
    username: "sarahjohnson",
    avatar: "https://i.pravatar.cc/300?img=1",
    bio: "Frontend developer specialized in React and TypeScript. Love building beautiful, accessible, and performant user interfaces.",
    joinDate: "April 2023",
    posts: 24,
    comments: 132,
    reputation: 754,
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Node.js"]
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-8 flex flex-col gap-8 md:flex-row">
          {/* Profile Sidebar */}
          <div className="md:w-1/3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <p className="mt-4">{user.bio}</p>
                <div className="mt-6 w-full">
                  <Button className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-2 font-medium">Account Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span>{user.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts</span>
                    <span>{user.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span>{user.comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reputation</span>
                    <span className="font-medium text-primary">{user.reputation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-2 font-medium">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-2 font-medium">Connect</h3>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="md:w-2/3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">No recent activity to show.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
