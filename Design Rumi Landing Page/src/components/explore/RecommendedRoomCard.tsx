import React, { useState } from 'react';
import { API_BASE_URL, inviteToConnect } from '../../services/api';

export type RecommendedRoomCardProps = {
  room: any;
  onViewDetails?: (room: any) => void;
};

export const RecommendedRoomCard = ({ room, onViewDetails }: RecommendedRoomCardProps) => {
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const ownerId = room?.owner?._id || room?.ownerUserId || null;
  const ownerPhone = room?.owner?.phone || room?.ownerUserId?.phone || '';
  const rawCover =
    room?.coverUrl ||
    room?.photoUrls?.[0] ||
    'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=200&h=200&fit=crop';

  const cover = (() => {
    const s = String(rawCover || '');
    if (!s) return rawCover;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    if (s.startsWith('/')) return `${API_BASE_URL}${s}`;
    return s;
  })();

  const locationLabel =
    room?.location?.area ||
    room?.location?.city ||
    room?.location?.address ||
    'Location';

  const score =
    Number(room?.compatibility ?? room?.matchScore ?? room?.score ?? 0) || 0;

  const tags: string[] = Array.isArray(room?.tags) ? room.tags : [];

  return (
    <div className="w-[220px] flex-shrink-0 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
      <div className="relative h-28 bg-slate-100">
        <img src={cover} alt={room?.propertyType || 'Room'} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold shadow">
          {score}% Match
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {room?.propertyType || 'Room'}
        </p>
        <p className="text-xs text-gray-500 truncate mt-1">{locationLabel}</p>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">₹{room?.monthlyRent ?? 0}</span>
          <span className="text-xs text-gray-500">/ month</span>
        </div>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onViewDetails?.(room)}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!onViewDetails}
            >
              See room details
            </button>

            {/* Send request to owner */}
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={async () => {
                  if (!ownerId) return;
                  try {
                    setRequestStatus('pending');
                    await inviteToConnect(String(ownerId), String(room._id));
                    // keep pending until owner accepts
                    setRequestStatus('pending');
                  } catch (err) {
                    // revert on error
                    setRequestStatus(null);
                    // eslint-disable-next-line no-console
                    console.error('invite error', err);
                    const msg = (err as any)?.response?.data?.message || (err as any)?.message || 'Could not send request';
                    // eslint-disable-next-line no-alert
                    alert(msg);
                  }
                }}
                className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                {requestStatus === 'pending' ? 'Pending' : 'Send Request'}
              </button>

              {/* Chat / Phone */}
              {room?.enableChat ? (
                <button className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">Chat</button>
              ) : (
                <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium" disabled>
                  Chat (request)
                </button>
              )}
            </div>

            {room?.showPhoneNumber && ownerPhone ? (
              <p className="text-xs text-gray-600 mt-1">Call: {ownerPhone}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

