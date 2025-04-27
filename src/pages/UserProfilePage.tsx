
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockPosts } from "@/data/mockData";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [userInfo, setUserInfo] = useState<{ name: string; avatar: string }>({
    name: username || "User",
    avatar: "https://i.pravatar.cc/100"
  });
  
  // Filter posts by the user (case-insensitive)
  const userPosts = mockPosts.filter(
    post => post.author.name.toLowerCase() === (username?.toLowerCase() || '')
  );

  useEffect(() => {
    // Find the author info if posts exist
    if (userPosts.length > 0) {
      setUserInfo(userPosts[0].author);
    } else {
      // If no posts found, create a default profile with the username
      setUserInfo({
        name: username || "User",
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 10) + 1}`
      });
    }
  }, [username, userPosts]);

  return (
    <MainLayout>
      <div className="container py-6">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback>{userInfo.name ? userInfo.name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userInfo.name}</CardTitle>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary">
                  {userPosts.length} Posts
                </Badge>
                <Badge variant="outline">
                  Member since {new Date().getFullYear()}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Posts by {userInfo.name}</h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No posts found for this user
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
