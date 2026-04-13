import React from 'react';
import { Edit, Pause, Play, Trash2 } from 'lucide-react';

type RoomStatus = 'active' | 'paused' | 'rented';

export type ListingCardProps = {
  room: any;
  selected?: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onTogglePause: () => void;
  onDelete: () => void;
};

export const ListingCard = ({
  room,
  selected,
  onSelect,
  onEdit,
  onTogglePause,
  onDelete,
}: ListingCardProps) => {
  const status: RoomStatus = room?.status || 'active';
  const statusLabel = status === 'active' ? 'Active' : status === 'paused' ? 'Paused' : 'Rented';

  const statusBadgeClass =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : status === 'paused'
        ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
        : 'bg-blue-50 text-blue-700 border-blue-100';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
      }}
      className={`border rounded-2xl p-4 bg-white transition-shadow cursor-pointer hover:shadow-sm ${
        selected ? 'border-blue-600 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
          <img
            src={
              room?.coverUrl ||
              room?.photoUrls?.[0] ||
              'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=200&h=200&fit=crop'
            }
            alt={room?.propertyType || 'Room'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {room?.propertyType || 'Room'} {room?.roomType ? `- ${room?.roomType}` : ''}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {room?.location?.area || room?.location?.city || room?.location?.address || 'Location'}
              </p>
            </div>
            <span className={`border text-xs px-2 py-1 rounded-full font-medium ${statusBadgeClass}`}>
              {statusLabel}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-900">₹{room?.monthlyRent ?? 0}</span>
              <span className="text-gray-500">/ month</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-[10px] text-gray-500">Views</p>
                <p className="text-sm font-semibold text-gray-900">{room?.viewsCount ?? 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-[10px] text-gray-500">Requests</p>
                <p className="text-sm font-semibold text-gray-900">{room?.incomingRequestsCount ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePause();
          }}
          className="px-3 py-2 border rounded-xl text-sm font-medium flex items-center gap-2 ${
            status === 'active'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100'
              : status === 'paused'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
          }"
        >
          {status === 'active' ? <Pause size={16} /> : <Play size={16} />}
          {status === 'active' ? 'Pause' : 'Activate'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

