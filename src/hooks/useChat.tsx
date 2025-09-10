import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  read_at?: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  customer_id: string;
  vendor_id: string;
  product_id: number;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`customer_id.eq.${user.id},vendor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create or find conversation
  const createOrFindConversation = useCallback(async (productId: number, vendorId: string) => {
    if (!user) return null;

    try {
      // First, try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_id', user.id)
        .eq('vendor_id', vendorId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        return existing.id;
      }

      // If no existing conversation, create new one
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          customer_id: user.id,
          vendor_id: vendorId,
          product_id: productId,
        })
        .select('id')
        .single();

      if (error) throw error;
      
      // Refresh conversations list
      await fetchConversations();
      
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
      return null;
    }
  }, [user, fetchConversations, toast]);

  // Send message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: 'text',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const conversationChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `vendor_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    const messageChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.conversation_id === currentConversation) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, currentConversation, fetchConversations]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    } else {
      setMessages([]);
    }
  }, [currentConversation, fetchMessages]);

  return {
    conversations,
    messages,
    currentConversation,
    setCurrentConversation,
    loading,
    createOrFindConversation,
    sendMessage,
    fetchConversations,
  };
};