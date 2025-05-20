
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, MessageSquare, ArrowLeft, Briefcase, User, Star } from "lucide-react";

// Interface for answer type
interface Answer {
  id: string;
  content: string;
  author: string;
  postedDate: string;
  upvotes: number;
}

// Interface for question type
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

export default function InterviewQuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const { toast } = useToast();
  
  // Question state
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  // Simulated data fetch
  useEffect(() => {
    // This would be replaced by an API call in a real application
    const sampleQuestions = [
      {
        id: "1",
        title: "Implement a binary search tree",
        description: "Asked to implement a binary search tree with insert, delete, and search operations. The interviewer wanted me to walk through the algorithm step by step and explain the time complexity of each operation. They also asked follow-up questions about balancing the tree and how that would affect the performance.",
        company: "Google",
        role: "Software Engineer",
        difficulty: "Hard",
        postedBy: "user123",
        postedDate: "2025-04-15",
        upvotes: 45,
        answers: 3,
      },
      {
        id: "2",
        title: "Design a URL shortener",
        description: "System design question about implementing a URL shortening service like bit.ly. Had to discuss database schema, API design, and how to handle redirects efficiently.",
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
    
    // Sample answers
    const sampleAnswers = [
      {
        id: "a1",
        content: "For implementing a binary search tree, I would start with defining the Node class with left and right child pointers. The insert operation should compare the new value with the current node and recursively go left or right. For search, it's similar but you return the node if found. Delete is trickier as you need to handle cases with 0, 1, or 2 children.",
        author: "algopro",
        postedDate: "2025-04-16",
        upvotes: 12
      },
      {
        id: "a2",
        content: "Time complexity for all basic operations (insert, delete, search) in a BST is O(h) where h is the height of the tree. In a balanced BST, this becomes O(log n), but in worst case (skewed tree) it's O(n). That's why balancing algorithms like AVL or Red-Black trees are important.",
        author: "csexpert",
        postedDate: "2025-04-17",
        upvotes: 8
      },
      {
        id: "a3",
        content: "Here's a quick Python implementation of a BST:\n```python\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n        \n    def insert(self, value):\n        if not self.root:\n            self.root = Node(value)\n        else:\n            self._insert_recursive(self.root, value)\n            \n    def _insert_recursive(self, node, value):\n        if value < node.value:\n            if node.left is None:\n                node.left = Node(value)\n            else:\n                self._insert_recursive(node.left, value)\n        else:\n            if node.right is None:\n                node.right = Node(value)\n            else:\n                self._insert_recursive(node.right, value)\n```",
        author: "pythondev",
        postedDate: "2025-04-18",
        upvotes: 15
      }
    ];

    // Find matching question or use a default one
    const foundQuestion = sampleQuestions.find(q => q.id === questionId) || sampleQuestions[0];
    
    // Simulate API delay
    setTimeout(() => {
      setQuestion(foundQuestion);
      setAnswers(sampleAnswers);
      setLoading(false);
    }, 300);
  }, [questionId]);

  // Handle upvote
  const handleUpvote = () => {
    if (question) {
      setQuestion({
        ...question,
        upvotes: question.upvotes + 1
      });
      toast({
        description: "Question upvoted!",
      });
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (answerContent.trim() === "") {
      toast({
        title: "Error",
        description: "Answer cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newAnswer: Answer = {
      id: `answer-${Date.now()}`,
      content: answerContent,
      author: "currentUser", // In a real app, get from auth
      postedDate: "Just now",
      upvotes: 0
    };

    setAnswers([newAnswer, ...answers]);
    setAnswerContent("");
    
    if (question) {
      setQuestion({
        ...question,
        answers: question.answers + 1
      });
    }

    toast({
      description: "Your answer was posted successfully!",
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p>Loading question details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!question) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Question not found</h2>
            <p className="text-muted-foreground mb-6">The interview question you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/interview-questions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Interview Questions
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/interview-questions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Interview Questions
            </Link>
          </Button>
        </div>
        
        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-2xl">{question.title}</CardTitle>
              <Badge className={getDifficultyColor(question.difficulty)}>
                <Star className="mr-1 h-3 w-3" />
                {question.difficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center">
                <Briefcase className="mr-1 h-3 w-3" />
                {question.company}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                {question.role}
              </Badge>
            </div>
            
            <CardDescription className="text-base">
              Posted by <span className="font-medium">{question.postedBy}</span> on {question.postedDate}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{question.description}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="flex items-center gap-1" onClick={handleUpvote}>
                <ThumbsUp className="h-4 w-4" />
                <span>{question.upvotes}</span>
              </Button>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answers} answers</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Answer Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Your Answer</h3>
          <Textarea
            placeholder="Share your experience or solution to this interview question..."
            className="min-h-32 mb-3"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
          <Button onClick={handleSubmitAnswer}>Post Your Answer</Button>
        </div>

        {/* Answers List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">{answers.length} Answers</h3>
          
          {answers.map(answer => (
            <Card key={answer.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{answer.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Answered by {answer.author} on {answer.postedDate}
                </div>
                <Button size="sm" variant="ghost" className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{answer.upvotes}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
