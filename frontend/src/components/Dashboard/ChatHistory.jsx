import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Trash2, MessageSquare, Plus } from 'lucide-react';

const ChatHistory = ({ userId, onLoadChat, onNewChat, currentChatId, colorTheme }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId]);

  useEffect(() => {
    // Listen for chat save events
    const handleChatSaved = () => {
      if (userId) {
        loadChats();
      }
    };

    window.addEventListener('chatSaved', handleChatSaved);
    return () => window.removeEventListener('chatSaved', handleChatSaved);
  }, [userId]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const { data: files, error } = await supabase.storage
        .from('files')
        .list(`chats/${userId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      const chatList = files.map(file => ({
        name: file.name,
        path: `chats/${userId}/${file.name}`,
        createdAt: file.created_at,
        id: file.id,
      }));

      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadChat = async (path, chatId) => {
    try {
      const { data: fileData, error } = await supabase.storage
        .from('files')
        .download(path);

      if (error) throw error;

      const text = await fileData.text();
      const chat = JSON.parse(text);

      onLoadChat(chat, chatId);
    } catch (error) {
      console.error('Error loading chat:', error);
      alert('Failed to load chat');
    }
  };

  const handleDeleteChat = async (path, name) => {
    if (!window.confirm(`Delete this chat?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('files')
        .remove([path]);

      if (error) throw error;

      setChats(chats.filter(c => c.path !== path));
      
      // If the deleted chat was the current one, start a new chat
      if (currentChatId === path) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getChatTitle = (chat, index) => {
    // Try to get first user message as title
    return `Chat ${chats.length - index}`;
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colorTheme.cardBackground }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: colorTheme.border }}>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Loading chats...
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No chat history yet
          </div>
        ) : (
          <div className="py-2">
            {chats.map((chat, index) => (
              <div
                key={chat.id || index}
                className={`group flex items-center gap-2 px-3 py-2 mx-2 mb-1 rounded-lg transition-colors cursor-pointer ${
                  currentChatId === chat.path
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <button
                  onClick={() => handleLoadChat(chat.path, chat.path)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {getChatTitle(chat, index)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(chat.createdAt)}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteChat(chat.path, getChatTitle(chat, index))}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
