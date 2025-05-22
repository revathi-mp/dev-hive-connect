
import { supabase } from "@/integrations/supabase/client";

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
    return await supabase.from('posts').select('*');
  },
  
  getPostById: async (id: string) => {
    return await supabase.from('posts').select('*').eq('id', id).single();
  },
  
  createPost: async (postData: any) => {
    return await supabase.from('posts').insert(postData);
  },
  
  updatePost: async (id: string, postData: any) => {
    return await supabase.from('posts').update(postData).eq('id', id);
  },
  
  deletePost: async (id: string) => {
    return await supabase.from('posts').delete().eq('id', id);
  },
  
  getPostsByTag: async (tag: string) => {
    return await supabase.from('posts').select('*').contains('tags', [tag]);
  }
};

// Comments Service
export const commentsService = {
  getCommentsByPostId: async (postId: string) => {
    return await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
  },
  
  createComment: async (commentData: any) => {
    return await supabase.from('comments').insert(commentData);
  },
  
  updateComment: async (id: string, commentData: any) => {
    return await supabase.from('comments').update(commentData).eq('id', id);
  },
  
  deleteComment: async (id: string) => {
    return await supabase.from('comments').delete().eq('id', id);
  }
};

// User Profiles Service
export const profilesService = {
  getProfileById: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  getProfileByUsername: async (username: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
  },
  
  updateProfile: async (userId: string, profileData: any) => {
    return await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
  },
  
  uploadProfileImage: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatar/${fileName}`;
    
    const { error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('profiles')
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
    return await supabase.from('tags').select('*');
  },
  
  getPopularTags: async (limit = 10) => {
    return await supabase.from('tags').select('*').order('count', { ascending: false }).limit(limit);
  }
};

// Categories Service
export const categoriesService = {
  getAllCategories: async () => {
    return await supabase.from('categories').select('*');
  },
  
  getCategoryBySlug: async (slug: string) => {
    return await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
  }
};

// Interview Questions Service
export const interviewQuestionsService = {
  getAllQuestions: async () => {
    return await supabase.from('interview_questions').select('*');
  },
  
  getQuestionById: async (id: string) => {
    return await supabase
      .from('interview_questions')
      .select('*')
      .eq('id', id)
      .single();
  },
  
  createQuestion: async (questionData: any) => {
    return await supabase.from('interview_questions').insert(questionData);
  }
};
