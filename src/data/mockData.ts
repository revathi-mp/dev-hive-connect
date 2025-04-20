
// Mock data for development purposes
export const mockPosts = [
  {
    id: "1",
    title: "How to optimize React rendering performance?",
    excerpt: "I've been working on a complex React application and noticed some performance issues. I've tried using memo and useCallback but still seeing slow renders.",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    category: "Frontend",
    tags: ["react", "performance", "optimization"],
    commentCount: 24,
    upvoteCount: 57,
    createdAt: "2023-04-18",
    isHot: true
  },
  {
    id: "2",
    title: "Best practices for designing a RESTful API?",
    excerpt: "I'm designing a new API for our product and want to follow modern RESTful practices. What are the current best practices for versioning, authentication, and error handling?",
    author: {
      name: "Mike Chen",
      avatar: "https://i.pravatar.cc/100?img=2"
    },
    category: "Backend",
    tags: ["api", "rest", "design"],
    commentCount: 18,
    upvoteCount: 42,
    createdAt: "2023-04-17"
  },
  {
    id: "3",
    title: "Docker vs Kubernetes for small projects?",
    excerpt: "I'm starting a new project and considering containerization. Is it overkill to use Kubernetes for a small to medium sized application?",
    author: {
      name: "Alex Taylor",
      avatar: "https://i.pravatar.cc/100?img=3"
    },
    category: "DevOps",
    tags: ["docker", "kubernetes", "containers"],
    commentCount: 32,
    upvoteCount: 69,
    createdAt: "2023-04-16",
    isHot: true
  },
  {
    id: "4",
    title: "Building a React Native app with TypeScript - tips?",
    excerpt: "Starting my first React Native project with TypeScript. Looking for any tips or gotchas before I dive in.",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=4"
    },
    category: "Mobile",
    tags: ["react-native", "typescript", "mobile"],
    commentCount: 15,
    upvoteCount: 31,
    createdAt: "2023-04-15"
  },
  {
    id: "5",
    title: "How to structure a large Next.js application?",
    excerpt: "My Next.js app is growing larger and I need advice on folder structure and code organization. How do you handle API routes, components, and services?",
    author: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/100?img=5"
    },
    category: "Frontend",
    tags: ["nextjs", "architecture", "react"],
    commentCount: 28,
    upvoteCount: 53,
    createdAt: "2023-04-14"
  },
  {
    id: "6",
    title: "Getting started with TensorFlow for image recognition",
    excerpt: "I'm new to machine learning and want to build an image recognition model. What's the best way to start with TensorFlow?",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/100?img=6"
    },
    category: "ML/AI",
    tags: ["tensorflow", "machine-learning", "image-recognition"],
    commentCount: 19,
    upvoteCount: 37,
    createdAt: "2023-04-13"
  }
];

export const mockCategories = [
  {
    name: "Frontend",
    description: "Discussions about React, Vue, Angular, and other frontend technologies",
    icon: "Code" as const,
    slug: "frontend",
    postCount: 1254,
    threadCount: 325
  },
  {
    name: "Backend",
    description: "Node.js, Python, Java, and other backend development topics",
    icon: "FileCode" as const,
    slug: "backend",
    postCount: 982,
    threadCount: 284
  },
  {
    name: "DevOps",
    description: "Docker, Kubernetes, CI/CD, deployment and infrastructure",
    icon: "Settings" as const,
    slug: "devops",
    postCount: 754,
    threadCount: 192
  },
  {
    name: "Mobile",
    description: "React Native, Flutter, Swift, and native app development",
    icon: "BookOpen" as const,
    slug: "mobile",
    postCount: 621,
    threadCount: 157
  },
  {
    name: "ML/AI",
    description: "Machine learning, AI, deep learning frameworks and applications",
    icon: "Bell" as const,
    slug: "ai",
    postCount: 532,
    threadCount: 134
  },
  {
    name: "Career",
    description: "Career advice, interviews, job hunting, and professional growth",
    icon: "Users" as const,
    slug: "career",
    postCount: 418,
    threadCount: 89
  }
];

export const mockTags = [
  { name: "react", count: 423 },
  { name: "javascript", count: 387 },
  { name: "typescript", count: 328 },
  { name: "node", count: 287 },
  { name: "python", count: 264 },
  { name: "devops", count: 231 },
  { name: "docker", count: 214 },
  { name: "aws", count: 198 },
  { name: "api", count: 187 },
  { name: "nextjs", count: 176 },
  { name: "database", count: 165 },
  { name: "testing", count: 142 }
];
