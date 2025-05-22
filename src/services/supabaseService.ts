
import { supabase } from "@/integrations/supabase/client";
import { Post, Comment, UserProfile, Tag, Category, InterviewQuestion } from "@/types/database";

// Auth Services
export const authService = {
  // User authentication
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signup: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  logout: async () => {
    return await supabase.auth.signOut();
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  },
  
  updatePassword: async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  },
  
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  
  getCurrentSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  signInWithGithub: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/home'
      }
    });
  },
  
  onAuthStateChange: (callback: any) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Posts Service (for forum posts)
export const postsService = {
  getPosts: async () => {
    return await (supabase.from('posts') as any).select('*');
  },
  
  getPostById: async (id: string) => {
    return await (supabase.from('posts') as any).select('*').eq('id', id).single();
  },
  
  createPost: async (postData: Partial<Post>) => {
    return await (supabase.from('posts') as any).insert(postData);
  },
  
  updatePost: async (id: string, postData: Partial<Post>) => {
    return await (supabase.from('posts') as any).update(postData).eq('id', id);
  },
  
  deletePost: async (id: string) => {
    return await (supabase.from('posts') as any).delete().eq('id', id);
  },
  
  getPostsByTag: async (tag: string) => {
    return await (supabase.from('posts') as any).select('*').contains('tags', [tag]);
  }
};

// Comments Service
export const commentsService = {
  getCommentsByPostId: async (postId: string) => {
    return await (supabase
      .from('comments') as any)
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
  },
  
  createComment: async (commentData: Partial<Comment>) => {
    return await (supabase.from('comments') as any).insert(commentData);
  },
  
  updateComment: async (id: string, commentData: Partial<Comment>) => {
    return await (supabase.from('comments') as any).update(commentData).eq('id', id);
  },
  
  deleteComment: async (id: string) => {
    return await (supabase.from('comments') as any).delete().eq('id', id);
  }
};

// User Profiles Service
export const profilesService = {
  getProfileById: async (userId: string) => {
    return await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  getProfileByUsername: async (username: string) => {
    return await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('username', username)
      .single();
  },
  
  updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    return await (supabase
      .from('profiles') as any)
      .update(profileData)
      .eq('id', userId);
  },
  
  uploadProfileImage: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatar/${fileName}`;
    
    const { error } = await (supabase.storage
      .from('profiles') as any)
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data } = (supabase.storage
      .from('profiles') as any)
      .getPublicUrl(filePath);
      
    // Update the profile with the new avatar URL
    await profilesService.updateProfile(userId, { 
      avatar_url: data.publicUrl 
    });
    
    return data.publicUrl;
  }
};

// Tags Service
export const tagsService = {
  getAllTags: async () => {
    return await (supabase.from('tags') as any).select('*');
  },
  
  getPopularTags: async (limit = 10) => {
    return await (supabase.from('tags') as any).select('*').order('count', { ascending: false }).limit(limit);
  }
};

// Categories Service
export const categoriesService = {
  getAllCategories: async () => {
    return await (supabase.from('categories') as any).select('*');
  },
  
  getCategoryBySlug: async (slug: string) => {
    return await (supabase
      .from('categories') as any)
      .select('*')
      .eq('slug', slug)
      .single();
  }
};

// Interview Questions Service
export const interviewQuestionsService = {
  getAllQuestions: async () => {
    return await (supabase.from('interview_questions') as any).select('*');
  },
  
  getQuestionById: async (id: string) => {
    return await (supabase
      .from('interview_questions') as any)
      .select('*')
      .eq('id', id)
      .single();
  },
  
  createQuestion: async (questionData: Partial<InterviewQuestion>) => {
    return await (supabase.from('interview_questions') as any).insert(questionData);
  }
};
