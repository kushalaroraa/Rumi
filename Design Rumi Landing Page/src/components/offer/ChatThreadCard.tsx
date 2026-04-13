import React from 'react';
import { MessageCircle } from 'lucide-react';

export type ChatThreadCardProps = {
  thread: any;
  onOpen: () => void;
};

export const ChatThreadCard = ({ thread, onOpen }: ChatThreadCardProps) => {
  const avatar = thread?.image || '';
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen();
      }}
      className="border border-gray-100 rounded-2xl p-4 bg-white cursor-pointer hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
            alt={thread?.name || 'User'}
            className="w-12 h-12 rounded-full object-cover bg-slate-100"
          />
          {Number(thread?.unreadCount ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full px-2 py-1">
              {thread.unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-gray-900 text-sm truncate">{thread?.name || 'User'}</p>
            <MessageCircle size={16} className="text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {thread?.lastMessagePreview ? thread.lastMessagePreview : 'No messages yet.'}
          </p>
        </div>
      </div>
    </div>
  );
};

