import React from 'react';

export type SuggestedMatchCardProps = {
  suggestion: any;
  onInvite: () => void;
};

export const SuggestedMatchCard = ({ suggestion, onInvite }: SuggestedMatchCardProps) => {
  const avatar = suggestion?.image || '';
  const compatibility = Number(suggestion?.compatibility ?? 0);

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white">
      <div className="flex items-start gap-3">
        <img
          src={avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
          alt={suggestion?.name || 'User'}
          className="w-12 h-12 rounded-full object-cover bg-slate-100"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {suggestion?.name || 'User'}, {suggestion?.age ?? ''}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">{compatibility}% Compatible</p>
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
              Suggested
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3">{suggestion?.bio || 'No bio provided yet.'}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onInvite}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Invite to Connect
        </button>
      </div>
    </div>
  );
};

