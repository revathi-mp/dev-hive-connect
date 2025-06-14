
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import TrendingPage from "./pages/TrendingPage";
import TagPage from "./pages/TagPage";
import CategoryPage from "./pages/CategoryPage";
import PostPage from "./pages/PostPage";
import TagsPage from "./pages/TagsPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import UserProfilePage from "./pages/UserProfilePage";
import InterviewQuestionsPage from "./pages/InterviewQuestionsPage";
import InterviewQuestionDetailPage from "./pages/InterviewQuestionDetailPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
            <Route path="/interview-questions/:questionId" element={<InterviewQuestionDetailPage />} />
            <Route path="/tag/:tagName" element={<TagPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/user/:username" element={<UserProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
