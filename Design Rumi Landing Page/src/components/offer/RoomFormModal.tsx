import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

export type RoomFormModalProps = {
  mode: 'create' | 'edit';
  open: boolean;
  initialRoom?: any;
  variant?: 'modal' | 'page';
  onClose: () => void;
  onSave: (form: FormData) => Promise<void>;
};

export const RoomFormModal = ({
  mode,
  open,
  initialRoom,
  onClose,
  onSave,
  variant = 'modal',
}: RoomFormModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  // Property details
  const [propertyType, setPropertyType] = useState('apartment');
  const [roomType, setRoomType] = useState<'private' | 'shared'>('private');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);

  // Amenities & room
  const [furnishingStatus, setFurnishingStatus] = useState('furnished');
  const [attachedBathroom, setAttachedBathroom] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [ac, setAc] = useState(false);
  const [washingMachine, setWashingMachine] = useState(false);
  const [kitchenAccess, setKitchenAccess] = useState(false);
  const [parking, setParking] = useState(false);
  const [powerBackup, setPowerBackup] = useState(false);
  const [bedAvailability, setBedAvailability] = useState<number | ''>('');

  // Flatmate preferences
  const [preferredGender, setPreferredGender] = useState('');
  const [ageMin, setAgeMin] = useState<number | ''>('');
  const [ageMax, setAgeMax] = useState<number | ''>('');
  const [occupation, setOccupation] = useState('');
  const [smokingAllowed, setSmokingAllowed] = useState('');
  const [drinkingAllowed, setDrinkingAllowed] = useState('');
  const [petsAllowed, setPetsAllowed] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  const [sleepSchedule, setSleepSchedule] = useState('');
  const [cleanlinessLevel, setCleanlinessLevel] = useState('');
  const [socialLevel, setSocialLevel] = useState('');

  // Media
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  // Description + contact
  const [roomDescription, setRoomDescription] = useState('');
  const [phoneVisibility, setPhoneVisibility] = useState(false);
  const [chatOption, setChatOption] = useState(true);
  const [preferredContactTime, setPreferredContactTime] = useState('');

  const existingCover = useMemo(() => {
    if (!initialRoom) return '';
    return initialRoom.coverUrl || initialRoom.photoUrls?.[0] || '';
  }, [initialRoom]);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialRoom) {
      setPropertyType(initialRoom.propertyType || 'apartment');
      setRoomType(initialRoom.roomType || 'private');
      setCity(initialRoom.location?.city || '');
      setArea(initialRoom.location?.area || '');
      setAddress(initialRoom.location?.address || '');
      setMonthlyRent(Number(initialRoom.monthlyRent ?? 0));
      setSecurityDeposit(Number(initialRoom.securityDeposit ?? 0));

      setFurnishingStatus(initialRoom.furnishingStatus || 'furnished');
      setAttachedBathroom(Boolean(initialRoom.attachedBathroom));
      setWifi(Boolean(initialRoom.amenities?.wifi));
      setAc(Boolean(initialRoom.amenities?.ac));
      setWashingMachine(Boolean(initialRoom.amenities?.washingMachine));
      setKitchenAccess(Boolean(initialRoom.amenities?.kitchenAccess));
      setParking(Boolean(initialRoom.amenities?.parking));
      setPowerBackup(Boolean(initialRoom.amenities?.powerBackup));
      setBedAvailability(initialRoom.bedAvailability ?? '');

      setPreferredGender(initialRoom.flatmatePreferences?.preferredGender || '');
      setAgeMin(initialRoom.flatmatePreferences?.ageMin ?? '');
      setAgeMax(initialRoom.flatmatePreferences?.ageMax ?? '');
      setOccupation(initialRoom.flatmatePreferences?.occupation || '');
      setSmokingAllowed(initialRoom.flatmatePreferences?.smokingAllowed || '');
      setDrinkingAllowed(initialRoom.flatmatePreferences?.drinkingAllowed || '');
      setPetsAllowed(initialRoom.flatmatePreferences?.petsAllowed || '');
      setFoodPreference(initialRoom.flatmatePreferences?.foodPreference || '');
      setSleepSchedule(initialRoom.flatmatePreferences?.sleepSchedule || '');
      setCleanlinessLevel(initialRoom.flatmatePreferences?.cleanlinessLevel || '');
      setSocialLevel(initialRoom.flatmatePreferences?.socialLevel || '');

      setRoomDescription(initialRoom.roomDescription || '');
      setPhoneVisibility(Boolean(initialRoom.contactPreferences?.phoneVisibility));
      setChatOption(Boolean(initialRoom.contactPreferences?.chatOption ?? true));
      setPreferredContactTime(initialRoom.contactPreferences?.preferredContactTime || '');

      // Media inputs are not prefilled.
      setPhotos([]);
      setVideo(null);
    } else if (mode === 'create') {
      setPropertyType('apartment');
      setRoomType('private');
      setCity('');
      setArea('');
      setAddress('');
      setMonthlyRent(0);
      setSecurityDeposit(0);

      setFurnishingStatus('furnished');
      setAttachedBathroom(false);
      setWifi(false);
      setAc(false);
      setWashingMachine(false);
      setKitchenAccess(false);
      setParking(false);
      setPowerBackup(false);
      setBedAvailability('');

      setPreferredGender('');
      setAgeMin('');
      setAgeMax('');
      setOccupation('');
      setSmokingAllowed('');
      setDrinkingAllowed('');
      setPetsAllowed('');
      setFoodPreference('');
      setSleepSchedule('');
      setCleanlinessLevel('');
      setSocialLevel('');

      setPhotos([]);
      setVideo(null);

      setRoomDescription('');
      setPhoneVisibility(false);
      setChatOption(true);
      setPreferredContactTime('');
    }
  }, [open, mode, initialRoom]);

  const handleSave = async () => {
    if (submitting) return;
    if (!city.trim() || !area.trim()) return;
    if (!Number.isFinite(monthlyRent) || monthlyRent <= 0) return;
    if (!roomDescription.trim()) return;

    const form = new FormData();
    form.append('propertyType', propertyType);
    form.append('roomType', roomType);
    form.append('city', city.trim());
    form.append('area', area.trim());
    form.append('address', address.trim());
    form.append('monthlyRent', String(monthlyRent));
    form.append('securityDeposit', String(securityDeposit));

    form.append('furnishingStatus', furnishingStatus);
    form.append('attachedBathroom', String(attachedBathroom));
    form.append('wifi', String(wifi));
    form.append('ac', String(ac));
    form.append('washingMachine', String(washingMachine));
    form.append('kitchenAccess', String(kitchenAccess));
    form.append('parking', String(parking));
    form.append('powerBackup', String(powerBackup));
    form.append('bedAvailability', bedAvailability === '' ? '' : String(bedAvailability));

    form.append('preferredGender', preferredGender);
    form.append('ageMin', ageMin === '' ? '' : String(ageMin));
    form.append('ageMax', ageMax === '' ? '' : String(ageMax));
    form.append('occupation', occupation);
    form.append('smokingAllowed', smokingAllowed);
    form.append('drinkingAllowed', drinkingAllowed);
    form.append('petsAllowed', petsAllowed);
    form.append('foodPreference', foodPreference);
    form.append('sleepSchedule', sleepSchedule);
    form.append('cleanlinessLevel', cleanlinessLevel);
    form.append('socialLevel', socialLevel);

    if (photos.length > 0) photos.slice(0, 10).forEach((f) => form.append('photos', f));
    if (video) form.append('video', video);

    form.append('roomDescription', roomDescription.trim());
    form.append('phoneVisibility', String(phoneVisibility));
    form.append('chatOption', String(chatOption));
    form.append('preferredContactTime', preferredContactTime.trim());

    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className={
        variant === 'modal'
          ? 'fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4'
          : 'fixed inset-0 z-[200] bg-gray-100 overflow-auto p-4 sm:p-8 flex items-start justify-center'
      }
    >
      <div
        className={
          variant === 'modal'
            ? 'w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden'
            : 'w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100'
        }
      >
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Add New Listing' : 'Edit Listing'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Provide room details and publish.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-auto">
          {existingCover && mode === 'edit' && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Current cover</p>
              <img src={existingCover} alt="Current cover" className="w-40 h-24 object-cover rounded-xl bg-slate-100" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="apartment">Apartment</option>
                <option value="pg">PG</option>
                <option value="independent_house">Independent House</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Andheri West"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address (optional)</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Landmark / building name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹)</label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹)</label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={furnishingStatus}
                onChange={(e) => setFurnishingStatus(e.target.value)}
              >
                <option value="furnished">Furnished</option>
                <option value="semi_furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={attachedBathroom} onChange={(e) => setAttachedBathroom(e.target.checked)} />
                Attached bathroom
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
                WiFi
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} />
                AC
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={washingMachine} onChange={(e) => setWashingMachine(e.target.checked)} />
                Washing machine
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={kitchenAccess} onChange={(e) => setKitchenAccess(e.target.checked)} />
                Kitchen access
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />
                Parking
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={powerBackup} onChange={(e) => setPowerBackup(e.target.checked)} />
                Power backup
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bed Availability</label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={bedAvailability}
                onChange={(e) => setBedAvailability(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={preferredGender}
                onChange={(e) => setPreferredGender(e.target.value)}
              >
                <option value="">No preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Min</label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Max</label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation Preference</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              >
                <option value="">No preference</option>
                <option value="student">Student</option>
                <option value="working">Working</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={smokingAllowed}
                  onChange={(e) => setSmokingAllowed(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="allowed">Allowed</option>
                  <option value="not_allowed">Not allowed</option>
                </select>
              </div>
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Drinking</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={drinkingAllowed}
                  onChange={(e) => setDrinkingAllowed(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="allowed">Allowed</option>
                  <option value="not_allowed">Not allowed</option>
                </select>
              </div>
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pets</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={petsAllowed}
                  onChange={(e) => setPetsAllowed(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="allowed">Allowed</option>
                  <option value="not_allowed">Not allowed</option>
                </select>
              </div>
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Food</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="any">Any</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Schedule</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="early_sleeper">Early sleeper</option>
                  <option value="night_owl">Night owl</option>
                </select>
              </div>
              <div className="w-full md:w-[calc(50%-6px)]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cleanliness</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={cleanlinessLevel}
                  onChange={(e) => setCleanlinessLevel(e.target.value)}
                >
                  <option value="">No preference</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Level (optional)</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                  value={socialLevel}
                  onChange={(e) => setSocialLevel(e.target.value)}
                  placeholder="e.g. Low-key / Social"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload room photos (optional for edit)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []) as File[];
                  setPhotos(files.slice(0, 10));
                }}
                className="block w-full text-sm text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                Selected: {photos.length} photo(s)
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Optional video tour</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setVideo(file);
                }}
                className="block w-full text-sm text-gray-700"
              />
              {video && <p className="text-xs text-gray-500 mt-2">Selected video: {video.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Description</label>
              <textarea
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                placeholder="Describe the space, ideal roommate fit, and house rules."
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={phoneVisibility} onChange={(e) => setPhoneVisibility(e.target.checked)} />
                Show phone number
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={chatOption} onChange={(e) => setChatOption(e.target.checked)} />
                Enable chat
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred contact time</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                value={preferredContactTime}
                onChange={(e) => setPreferredContactTime(e.target.value)}
                placeholder="e.g. Weekdays evenings"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="flex-1 py-3.5 px-4 bg-[#081A35] text-white rounded-xl font-semibold hover:bg-[#081A35]/90 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : mode === 'create' ? 'Publish Listing' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

