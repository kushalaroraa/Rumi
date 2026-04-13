import React from 'react';

export type IncomingRequestCardProps = {
  request: any;
  onAccept: () => void;
  onReject: () => void;
};

export const IncomingRequestCard = ({ request, onAccept, onReject }: IncomingRequestCardProps) => {
  const u = request?.fromUserId || {};
  const compatibility = Number(request?.compatibility ?? request?.matchScore ?? request?.match ?? 0);
  const avatar = u?.photo || u?.profilePicture || '';

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white">
      <div className="flex items-start gap-3">
        <img
          src={avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
          alt={u?.name || 'User'}
          className="w-12 h-12 rounded-full object-cover bg-slate-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {u?.name || 'User'}, {u?.age ?? ''}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">{compatibility}% Match</p>
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
              Incoming
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-3">
            {u?.bio || 'No bio provided yet.'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={onReject}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

