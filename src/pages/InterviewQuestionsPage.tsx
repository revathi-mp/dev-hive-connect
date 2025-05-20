
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Briefcase, User, Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample interview questions data
const mockInterviewQuestions = [
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

// Unique filter options extracted from the data
const companies = [...new Set(mockInterviewQuestions.map(q => q.company))];
const roles = [...new Set(mockInterviewQuestions.map(q => q.role))];
const difficultyLevels = ["Easy", "Medium", "Hard"];

export default function InterviewQuestionsPage() {
  // Filter states
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Apply filters
  const filteredQuestions = mockInterviewQuestions.filter(question => {
    return (
      (companyFilter === "" || question.company === companyFilter) &&
      (roleFilter === "" || question.role === roleFilter) &&
      (difficultyFilter === "" || question.difficulty === difficultyFilter) &&
      (searchQuery === "" || 
       question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Hard": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
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
            <Button className="md:w-auto" size="lg">
              <Plus className="mr-1 h-4 w-4" />
              Post Question
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulties</SelectItem>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map(question => (
                <Card key={question.id}>
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
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div>
                      Posted by {question.postedBy} on {question.postedDate}
                    </div>
                    <div className="flex gap-4">
                      <span>{question.upvotes} upvotes</span>
                      <span>{question.answers} answers</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">No interview questions found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredQuestions.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
