
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
import { ThumbsUp, MessageSquare, ArrowLeft, Briefcase, User, Star, Code } from "lucide-react";

// Interface for answer type
interface Answer {
  id: string;
  content: string;
  author: string;
  postedDate: string;
  upvotes: number;
  hasCode?: boolean;
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
    
    // Sample answers based on the questionId
    let questionAnswers: Answer[] = [];
    
    // Specific answers for each question
    switch(questionId) {
      case "1": // Binary Search Tree
        questionAnswers = [
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
            hasCode: true,
            content: "Here's a quick Python implementation of a BST:\n```python\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n        \n    def insert(self, value):\n        if not self.root:\n            self.root = Node(value)\n        else:\n            self._insert_recursive(self.root, value)\n            \n    def _insert_recursive(self, node, value):\n        if value < node.value:\n            if node.left is None:\n                node.left = Node(value)\n            else:\n                self._insert_recursive(node.left, value)\n        else:\n            if node.right is None:\n                node.right = Node(value)\n            else:\n                self._insert_recursive(node.right, value)\n```",
            author: "pythondev",
            postedDate: "2025-04-18",
            upvotes: 15
          }
        ];
        break;
        
      case "2": // URL Shortener
        questionAnswers = [
          {
            id: "a4",
            content: "For a URL shortener, I'd use a hash function to create a short code from the original URL. To avoid collisions, we can use a combination of techniques: adding a counter to the input, rehashing, or just incrementing until we find an available slot. For storage, I'd use a distributed database with the short code as the key and the original URL as the value.",
            author: "systemdesigner",
            postedDate: "2025-05-01",
            upvotes: 24
          },
          {
            id: "a5",
            content: "Don't forget about scalability concerns. For high-traffic URL shorteners, you'd want to distribute the load across multiple servers. You could use consistent hashing to determine which server handles which URLs. Also, implement caching for popular URLs to reduce database load.",
            author: "scalabilityexpert",
            postedDate: "2025-05-02",
            upvotes: 17
          },
          {
            id: "a6",
            hasCode: true,
            content: "Here's a basic REST API design for the URL shortener:\n```javascript\n// Create a new short URL\nPOST /api/urls\nBody: { \"originalUrl\": \"https://example.com/very/long/url\" }\nResponse: { \"shortCode\": \"abc123\", \"shortUrl\": \"https://short.url/abc123\" }\n\n// Redirect from short URL to original URL\nGET /:shortCode\n// This would redirect to the original URL\n```",
            author: "apidesigner",
            postedDate: "2025-05-03",
            upvotes: 29
          }
        ];
        break;
        
      case "3": // React component lifecycle
        questionAnswers = [
          {
            id: "a7",
            content: "React class component lifecycle methods can be grouped into three phases: Mounting (constructor, render, componentDidMount), Updating (render, componentDidUpdate), and Unmounting (componentWillUnmount). With hooks, useEffect replaces most lifecycle methods. useEffect without dependencies is like componentDidMount, useEffect with dependencies works like componentDidUpdate, and the return function in useEffect is similar to componentWillUnmount.",
            author: "reactmaster",
            postedDate: "2025-05-10",
            upvotes: 42
          },
          {
            id: "a8",
            content: "A common interview follow-up is to explain the differences between useEffect and useLayoutEffect. useEffect runs asynchronously after render and doesn't block painting, while useLayoutEffect runs synchronously before the browser paints and can cause performance issues if not used carefully.",
            author: "hookexpert",
            postedDate: "2025-05-11",
            upvotes: 31
          },
          {
            id: "a9",
            hasCode: true,
            content: "Here's a comparison of class lifecycle methods vs hooks:\n```jsx\n// Class component with lifecycle methods\nclass ExampleComponent extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n  }\n  \n  componentDidMount() {\n    document.title = `Count: ${this.state.count}`;\n  }\n  \n  componentDidUpdate() {\n    document.title = `Count: ${this.state.count}`;\n  }\n  \n  render() {\n    return (\n      <button onClick={() => this.setState({ count: this.state.count + 1 })}>\n        Click me\n      </button>\n    );\n  }\n}\n\n// Function component with hooks\nfunction ExampleComponent() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]); // Only re-run when count changes\n  \n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Click me\n    </button>\n  );\n}\n```",
            author: "reacthooker",
            postedDate: "2025-05-12",
            upvotes: 38
          }
        ];
        break;
        
      case "4": // LRU Cache
        questionAnswers = [
          {
            id: "a10",
            content: "The key to an LRU cache with O(1) operations is using a combination of a doubly linked list and a hash map. The doubly linked list maintains the order of access (most recently used at head, least at tail), while the hash map gives O(1) access to any item by key. When we access an item, we move it to the head of the list. When adding a new item to a full cache, we remove the tail (least recently used) and add the new item to the head.",
            author: "cachingexpert",
            postedDate: "2025-04-23",
            upvotes: 27
          },
          {
            id: "a11",
            hasCode: true,
            content: "Here's the JavaScript implementation of LRU cache:\n```javascript\nclass LRUCache {\n  constructor(capacity) {\n    this.cache = new Map();\n    this.capacity = capacity;\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    \n    const value = this.cache.get(key);\n    // Delete and re-add to put the entry at the end of the insertion order\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    // If already exists, delete first\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    }\n    // If at capacity, delete the oldest item (first inserted)\n    else if (this.cache.size === this.capacity) {\n      // Map.keys() returns a new Iterator object that contains the keys in insertion order\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n    // Add new item (it will be the most recently used now)\n    this.cache.set(key, value);\n  }\n}\n```",
            author: "javascriptdev",
            postedDate: "2025-04-24",
            upvotes: 35
          }
        ];
        break;
        
      case "5": // Database indexing
        questionAnswers = [
          {
            id: "a12",
            content: "There are several types of database indexes, each with their own use cases. B-tree indexes are the most common, working well for equality and range queries. Hash indexes are great for exact equality matching but not ranges. Bitmap indexes work well for low-cardinality data (few unique values). Spatial indexes help with geographic data, and text indexes are optimized for full-text search.",
            author: "dbindexmaster",
            postedDate: "2025-05-13",
            upvotes: 22
          },
          {
            id: "a13",
            content: "When deciding which columns to index, consider these factors: columns used in WHERE clauses, JOIN conditions, and ORDER BY clauses are good candidates. However, don't over-index as each index increases write time and storage requirements. For read-heavy applications, more indexes make sense; for write-heavy applications, be more selective.",
            author: "performancetuner",
            postedDate: "2025-05-14",
            upvotes: 18
          },
          {
            id: "a14",
            hasCode: true,
            content: "Index creation examples in SQL:\n```sql\n-- Basic index\nCREATE INDEX idx_user_email ON users(email);\n\n-- Composite index (multiple columns)\nCREATE INDEX idx_user_name ON users(last_name, first_name);\n\n-- Unique index (enforces uniqueness)\nCREATE UNIQUE INDEX idx_unique_email ON users(email);\n\n-- Partial index\nCREATE INDEX idx_active_users ON users(created_at) WHERE status = 'active';\n```",
            author: "sqlwizard",
            postedDate: "2025-05-15",
            upvotes: 26
          }
        ];
        break;
        
      default:
        questionAnswers = [
          {
            id: "a15",
            content: "This is a great interview question! In my experience, it's important to first clarify the requirements before jumping into a solution. Ask the interviewer follow-up questions about constraints, expected inputs and outputs, and edge cases.",
            author: "interviewpro",
            postedDate: "2025-05-14",
            upvotes: 15
          },
          {
            id: "a16",
            content: "When answering questions like this, remember to talk through your thought process. Interviewers often care more about how you approach the problem than the final answer. Break down complex problems into smaller parts and explain your reasoning for each decision.",
            author: "techinterviewer",
            postedDate: "2025-05-15",
            upvotes: 12
          }
        ];
    }

    // Find matching question or use a default one
    const foundQuestion = sampleQuestions.find(q => q.id === questionId) || sampleQuestions[0];
    
    // Simulate API delay
    setTimeout(() => {
      setQuestion(foundQuestion);
      setAnswers(questionAnswers);
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

  // Handle answer upvote
  const handleAnswerUpvote = (answerId: string) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.id === answerId
          ? { ...answer, upvotes: answer.upvotes + 1 }
          : answer
      )
    );
    toast({
      description: "Answer upvoted!",
    });
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
      upvotes: 0,
      hasCode: answerContent.includes('```')
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
            placeholder="Share your experience or solution to this interview question... Use ``` for code blocks"
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
                {answer.hasCode ? (
                  <div className="flex items-start gap-2 mb-2">
                    <Code className="h-5 w-5 text-blue-500 mt-1" />
                    <span className="text-blue-500 font-medium">Contains code example</span>
                  </div>
                ) : null}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{answer.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${answer.author}`} />
                    <AvatarFallback>{answer.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    Answered by <span className="font-medium">{answer.author}</span> on {answer.postedDate}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex items-center gap-1"
                  onClick={() => handleAnswerUpvote(answer.id)}
                >
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
