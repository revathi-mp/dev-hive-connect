
import { MainLayout } from "@/components/layout/MainLayout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            Last updated: April 20, 2025
          </p>
          
          <p className="mb-6">
            These Terms of Service ("Terms") govern your use of the DevHive Connect platform. 
            By accessing or using the platform, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. User Accounts</h2>
          <p>
            To use certain features of the platform, you must create an account. You are responsible for:
          </p>
          <ul className="space-y-2 list-disc pl-6">
            <li>Providing accurate and complete information</li>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. User Content</h2>
          <p>
            You retain ownership of the content you post on DevHive Connect, but you grant us a license to use, 
            store, and share your content in connection with providing the platform.
          </p>
          <p>
            You are solely responsible for the content you post. Content must not violate any applicable laws or 
            our Community Guidelines.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Code of Conduct</h2>
          <p>
            When using DevHive Connect, you agree to:
          </p>
          <ul className="space-y-2 list-disc pl-6">
            <li>Be respectful and considerate of others</li>
            <li>Not engage in harassment or bullying</li>
            <li>Not post content that is discriminatory, offensive, or inappropriate</li>
            <li>Not use the platform for illegal activities</li>
            <li>Not attempt to manipulate or abuse platform features</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Termination</h2>
          <p>
            We may suspend or terminate your access to the platform if you violate these Terms or 
            our Community Guidelines.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@devhiveconnect.com.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
