import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Medal, Trophy, Star } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { GitHubConnect } from "@/components/profile/GitHubConnect";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";

function getBadges(reputation: number) {
  const badges = [];
  if (reputation >= 1000) {
    badges.push({ label: "Trophy", icon: Trophy, color: "text-yellow-500", desc: "Legend (1000+ Rep!)" });
  }
  if (reputation >= 500) {
    badges.push({ label: "Star", icon: Star, color: "text-blue-500", desc: "Pro (500+ Rep)" });
  }
  if (reputation >= 100) {
    badges.push({ label: "Medal", icon: Medal, color: "text-purple-500", desc: "Rising Star (100+ Rep)" });
  }
  return badges;
}

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Sarah Johnson",
    username: "sarahjohnson",
    avatar: "https://i.pravatar.cc/300?img=1",
    bio: "Frontend developer specialized in React and TypeScript. Love building beautiful, accessible, and performant user interfaces.",
    joinDate: "April 2023",
    posts: 24,
    comments: 132,
    reputation: 754,
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Node.js"]
  });

  const repBadges = getBadges(user.reputation);

  const handleProfileUpdate = (updatedData: any) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-8 flex flex-col gap-8 md:flex-row">
          {/* Profile Sidebar */}
          <div className="md:w-1/3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <ProfilePictureUpload
                    currentAvatar={user.avatar}
                    onUpdate={(newAvatarUrl) => handleProfileUpdate({ avatar: newAvatarUrl })}
                  />
                </div>
                <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>

                {/* Reputation Score & Badges */}
                <div className="mt-4 flex flex-col items-center gap-1 w-full">
                  <span className="inline-block text-lg font-bold text-primary">
                    Reputation: {user.reputation}
                  </span>
                  <div className="flex flex-wrap gap-2 items-center justify-center mt-1">
                    {repBadges.length === 0 ? (
                      <span className="text-xs text-muted-foreground">No badges yet</span>
                    ) : (
                      repBadges.map(badge => (
                        <UIBadge 
                          key={badge.label} 
                          className={`gap-1 px-2 py-1 ${badge.color}`} 
                          variant="secondary" 
                          title={badge.desc}
                        >
                          <badge.icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{badge.label}</span>
                        </UIBadge>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <EditProfileDialog user={user} onUpdate={handleProfileUpdate} />
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
                    <span className="text-muted-foreground">Special Features</span>
                    <span>
                      {user.reputation >= 1000
                        ? "🎉 All Access"
                        : user.reputation >= 500
                        ? "⭐ Post Highlighting"
                        : user.reputation >= 100
                        ? "🌟 Profile Customization"
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-2 font-medium">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <UIBadge key={skill} variant="secondary">
                      {skill}
                    </UIBadge>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-2 font-medium">Connect</h3>
                <GitHubConnect />
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="md:w-2/3">
            <RecentActivity />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
