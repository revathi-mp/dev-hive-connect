
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Info, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewQuestionModal } from "@/components/interview/NewQuestionModal";

// Mock data - in a real app, this would come from an API or database
const mockQuestions = [
  {
    id: "question-1",
    title: "Implement a binary search tree",
    company: "Google",
    role: "Software Engineer",
    difficulty: "Hard",
    postedBy: "admin",
    postedDate: "2023-05-10",
    upvotes: 24,
    answers: 7
  },
  {
    id: "question-2",
    title: "Design a URL shortener",
    company: "Amazon",
    role: "System Design Engineer",
    difficulty: "Medium",
    postedBy: "user123",
    postedDate: "2023-05-15",
    upvotes: 18,
    answers: 5
  },
  {
    id: "question-3",
    title: "React component lifecycle explanation",
    company: "Facebook",
    role: "Frontend Engineer",
    difficulty: "Medium",
    postedBy: "tech_interviewer",
    postedDate: "2023-06-01",
    upvotes: 32,
    answers: 12
  },
  {
    id: "question-4",
    title: "Distributed systems consistency models",
    company: "Microsoft",
    role: "Senior Developer",
    difficulty: "Hard",
    postedBy: "admin",
    postedDate: "2023-06-10",
    upvotes: 15,
    answers: 3
  },
  {
    id: "question-5",
    title: "Implement a rate limiter",
    company: "Netflix",
    role: "Backend Engineer",
    difficulty: "Medium",
    postedBy: "interviewer42",
    postedDate: "2023-06-15",
    upvotes: 27,
    answers: 8
  }
];

const companies = ["Google", "Amazon", "Facebook", "Microsoft", "Netflix", "Apple", "Twitter", "Uber", "Airbnb", "LinkedIn"];
const roles = ["Software Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack Developer", "System Design Engineer", "DevOps Engineer", "Data Engineer", "ML Engineer"];

export function InterviewQuestionsTable() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleAddQuestion = (newQuestion: any) => {
    setQuestions([newQuestion, ...questions]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableCaption>
            Interview Questions Database - Total: {filteredQuestions.length}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No questions found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.title}</TableCell>
                  <TableCell>{question.company}</TableCell>
                  <TableCell>{question.role}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.postedBy}</TableCell>
                  <TableCell>{question.postedDate}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="outline">👍 {question.upvotes}</Badge>
                      <Badge variant="outline">💬 {question.answers}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(`/interview-questions/${question.id}`)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <NewQuestionModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddQuestion}
        companies={companies}
        roles={roles}
      />
    </div>
  );
}
