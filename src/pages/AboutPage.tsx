
import { MainLayout } from "@/components/layout/MainLayout";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">About DevHive Connect</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            DevHive Connect is a developer community platform designed to facilitate knowledge sharing, 
            problem-solving, and networking among software developers from all backgrounds and skill levels.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create an inclusive, supportive environment where developers can learn from each other,
            share ideas, and grow together. We believe in the power of community-driven knowledge and the collective
            intelligence that emerges when passionate developers collaborate.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Community Values</h2>
          <ul className="space-y-2 list-disc pl-6">
            <li><strong>Inclusivity:</strong> We welcome developers of all skill levels, backgrounds, and specialties.</li>
            <li><strong>Knowledge Sharing:</strong> We encourage sharing solutions, best practices, and lessons learned.</li>
            <li><strong>Respect:</strong> We maintain a respectful environment where all members feel valued.</li>
            <li><strong>Growth Mindset:</strong> We believe in continuous learning and improvement.</li>
            <li><strong>Collaboration:</strong> We foster collaboration over competition.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Join Our Community</h2>
          <p>
            Whether you're a seasoned developer or just starting your coding journey, there's a place for you at DevHive Connect.
            Join discussions, ask questions, share your knowledge, and connect with fellow developers who share your interests.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
