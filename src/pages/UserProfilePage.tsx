
import { useParams, Navigate } from "react-router-dom";
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
  
  // Filter posts by the user name (case-insensitive)
  // Make sure username exists and convert to lowercase for comparison
  const normalizedUsername = username?.toLowerCase() || '';
  const userPosts = mockPosts.filter(
    post => post.author.name.toLowerCase() === normalizedUsername
  );

  // Handle user information retrieval
  useEffect(() => {
    console.log("Username param:", username);
    console.log("Found posts:", userPosts.length);
    
    if (userPosts.length > 0) {
      // Use author info from first post
      setUserInfo(userPosts[0].author);
    } else if (username) {
      // Create a placeholder profile with consistent avatar
      const userSeed = username.charCodeAt(0) % 70; // Generate consistent avatar
      setUserInfo({
        name: username,
        avatar: `https://i.pravatar.cc/150?img=${userSeed}`
      });
    }
  }, [username, userPosts]);

  // If username is not provided, redirect to homepage
  if (!username) {
    return <Navigate to="/" />;
  }

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
                  {userPosts.length} {userPosts.length === 1 ? "Post" : "Posts"}
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
