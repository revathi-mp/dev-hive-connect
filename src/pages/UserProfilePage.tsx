
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/forum/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockPosts } from "@/data/mockData";

export default function UserProfilePage() {
  const { username } = useParams();
  
  // Filter posts by the user
  const userPosts = mockPosts.filter(
    post => post.author.name.toLowerCase() === username
  );

  // For demo purposes, using the first post's author info
  const userInfo = userPosts[0]?.author || {
    name: username,
    avatar: "https://i.pravatar.cc/100"
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
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
                No posts yet
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
