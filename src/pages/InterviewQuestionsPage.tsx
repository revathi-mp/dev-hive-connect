
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Briefcase, User, Star, Plus, Search, Filter, ThumbsUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewQuestionModal } from "@/components/interview/NewQuestionModal";
import { useToast } from "@/hooks/use-toast";

// Types
interface InterviewQuestion {
  id: string;
  title: string;
  description: string;
  company: string;
  role: string;
  difficulty: string;
  postedBy: string;
  postedDate: string;
  upvotes: number;
  answers: number;
}

// Sample interview questions data
const initialInterviewQuestions = [
  {
    id: "1",
    title: "Implement a binary search tree",
    description: "Asked to implement a binary search tree with insert, delete, and search operations.",
    company: "Google",
    role: "Software Engineer",
    difficulty: "Hard",
    postedBy: "user123",
    postedDate: "2025-04-15",
    upvotes: 45,
    answers: 12,
  },
  {
    id: "2",
    title: "Design a URL shortener",
    description: "System design question about implementing a URL shortening service like bit.ly.",
    company: "Amazon",
    role: "Senior Developer",
    difficulty: "Medium",
    postedBy: "techguru",
    postedDate: "2025-05-01",
    upvotes: 32,
    answers: 8,
  },
  {
    id: "3",
    title: "React component lifecycle explanation",
    description: "Asked to explain React component lifecycle methods and how they relate to hooks.",
    company: "Facebook",
    role: "Frontend Developer",
    difficulty: "Medium",
    postedBy: "reactfan",
    postedDate: "2025-05-10",
    upvotes: 27,
    answers: 15,
  },
  {
    id: "4",
    title: "Implement a LRU cache",
    description: "Coding challenge to implement a Least Recently Used cache with O(1) operations.",
    company: "Microsoft",
    role: "Software Engineer",
    difficulty: "Hard",
    postedBy: "coder42",
    postedDate: "2025-04-22",
    upvotes: 38,
    answers: 6,
  },
  {
    id: "5",
    title: "Database indexing strategies",
    description: "Discussion about different database indexing strategies and when to use each.",
    company: "Oracle",
    role: "Database Administrator",
    difficulty: "Easy",
    postedBy: "dbmaster",
    postedDate: "2025-05-12",
    upvotes: 19,
    answers: 4,
  }
];

// Constants
const ITEMS_PER_PAGE = 5;
const difficultyLevels = ["Easy", "Medium", "Hard"];

export default function InterviewQuestionsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Questions state
  const [questions, setQuestions] = useState<InterviewQuestion[]>(initialInterviewQuestions);
  
  // Filter states
  const [companyFilter, setCompanyFilter] = useState<string>("all-companies");
  const [roleFilter, setRoleFilter] = useState<string>("all-roles");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all-difficulties");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Unique filter options extracted from the data
  const companies = [...new Set(questions.map(q => q.company))];
  const roles = [...new Set(questions.map(q => q.role))];

  // Apply filters
  const filteredQuestions = questions.filter(question => {
    return (
      (companyFilter === "all-companies" || question.company === companyFilter) &&
      (roleFilter === "all-roles" || question.role === roleFilter) &&
      (difficultyFilter === "all-difficulties" || question.difficulty === difficultyFilter) &&
      (searchQuery === "" || 
       question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Paginate results
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Navigate to question detail page
  const handleQuestionClick = (questionId: string) => {
    navigate(`/interview-questions/${questionId}`);
  };

  // Handle new question submission
  const handleQuestionSubmit = (newQuestion: InterviewQuestion) => {
    setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
  };

  // Handle upvote
  const handleUpvote = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation(); // Prevent card click navigation
    
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === questionId
          ? { ...question, upvotes: question.upvotes + 1 }
          : question
      )
    );
    
    toast({
      description: "Question upvoted!",
      duration: 2000,
    });
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Hard": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setCompanyFilter("all-companies");
    setRoleFilter("all-roles");
    setDifficultyFilter("all-difficulties");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Interview Questions Exchange</h1>
              <p className="text-muted-foreground mt-1">
                Share and discuss real-world interview questions
              </p>
            </div>
            <Button className="md:w-auto" size="lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Post Question
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={companyFilter} onValueChange={(value) => {
                setCompanyFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-companies">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={difficultyFilter} onValueChange={(value) => {
                setDifficultyFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display and reset */}
          {(companyFilter !== "all-companies" || roleFilter !== "all-roles" || difficultyFilter !== "all-difficulties" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              
              {companyFilter !== "all-companies" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Company: {companyFilter}
                </Badge>
              )}
              
              {roleFilter !== "all-roles" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Role: {roleFilter}
                </Badge>
              )}
              
              {difficultyFilter !== "all-difficulties" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Difficulty: {difficultyFilter}
                </Badge>
              )}
              
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
                Clear all
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4">
            {paginatedQuestions.length > 0 ? (
              paginatedQuestions.map(question => (
                <Card 
                  key={question.id} 
                  className="transition-all hover:shadow-md cursor-pointer" 
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{question.title}</CardTitle>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        <Star className="mr-1 h-3 w-3" />
                        {question.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">{question.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {question.company}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {question.role}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Posted by {question.postedBy} on {question.postedDate}
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={(e) => handleUpvote(e, question.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{question.upvotes}</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{question.answers}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">No interview questions found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredQuestions.length > ITEMS_PER_PAGE && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      
      {/* Question posting modal */}
      <NewQuestionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleQuestionSubmit}
        companies={companies}
        roles={roles}
      />
    </MainLayout>
  );
}
