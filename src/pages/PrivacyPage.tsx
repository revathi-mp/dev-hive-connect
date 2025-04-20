
import { MainLayout } from "@/components/layout/MainLayout";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            Last updated: April 20, 2025
          </p>
          
          <p className="mb-6">
            This Privacy Policy describes how DevHive Connect ("we", "us", or "our") collects, uses, 
            and shares your personal information when you use our platform.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p>
            When you use DevHive Connect, we may collect the following types of information:
          </p>
          <ul className="space-y-2 list-disc pl-6">
            <li><strong>Account Information:</strong> Name, email address, username, and password</li>
            <li><strong>Profile Information:</strong> Bio, profile picture, job title, company, and location</li>
            <li><strong>Content:</strong> Posts, comments, upvotes, and other content you create on the platform</li>
            <li><strong>Usage Data:</strong> Information about your interactions with the platform</li>
            <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="space-y-2 list-disc pl-6">
            <li>Provide, maintain, and improve the platform</li>
            <li>Create and manage your account</li>
            <li>Process your requests and transactions</li>
            <li>Communicate with you about the platform</li>
            <li>Customize your experience and provide personalized content</li>
            <li>Detect and prevent fraud and abuse</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy, please contact us at privacy@devhiveconnect.com.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
