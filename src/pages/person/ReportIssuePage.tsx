import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { IssueCategory, IssuePriority } from '../../types';
import {
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  FileImage,
  X,
  Building,
  User,
  AlertTriangle,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ReportIssuePageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onNavigate }) => {
  const { currentPerson } = useAuth();
  const { locations, features, reportIssue } = useData();

  // Form State
  const [category, setCategory] = useState<IssueCategory>('Elevator');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('HIGH');
  const [locationId, setLocationId] = useState(locations[0]?.location_id || 'LOC-001');
  const [featureId, setFeatureId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [newlyCreatedIssueId, setNewlyCreatedIssueId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter features matching selected location
  const matchingFeatures = features.filter((f) => f.location_id === locationId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a concise issue title.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must contain at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the accessibility barrier.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must contain at least 10 characters.';
    }

    if (!locationId) {
      newErrors.locationId = 'Please select a campus location.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Create report transaction
    const created = reportIssue({
      title: title.trim(),
      category,
      description: description.trim(),
      location_id: locationId,
      feature_id: featureId || undefined,
      reporter_id: currentPerson.person_id,
      priority,
      image_url: imagePreview || undefined,
    });

    setNewlyCreatedIssueId(created.issue_id);
    setIsSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          New Incident Intake
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Report an Accessibility Issue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Help us make the campus more accessible by reporting a problem. Your report generates a tracked ticket routed to campus facility engineers.
        </p>
      </div>

      {/* Success Confirmation Modal */}
      {isSubmittedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Issue Reported Successfully
            </h3>
            <div className="my-3 py-2 px-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <span className="text-xs text-blue-600 block uppercase tracking-wider font-semibold">Your Issue Tracking ID</span>
              <span className="text-xl font-mono font-extrabold text-blue-800">{newlyCreatedIssueId}</span>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Track your issue lifecycle, status history, and staff assignment progress from the <span className="font-semibold text-slate-900">My Issues</span> page.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-track-issue"
                type="button"
                onClick={() => onNavigate('my-issues')}
                className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Go to My Issues
              </button>
              <button
                type="button"
                onClick={() => onNavigate('issue-details', newlyCreatedIssueId)}
                className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                View Issue Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Reporter Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">1. Reporter Information</h2>
            <span className="text-xs text-slate-400 ml-auto font-mono">PERSON (PER-001)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentPerson.name}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Institutional ID</label>
              <input
                type="text"
                disabled
                value={currentPerson.institutional_id}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Institutional Email</label>
              <input
                type="text"
                disabled
                value={currentPerson.email}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Contact Phone</label>
              <input
                type="text"
                disabled
                value={currentPerson.phone}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Campus Role</label>
              <input
                type="text"
                disabled
                value={`${currentPerson.role} (${currentPerson.department})`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Issue Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">2. Issue Information</h2>
            <span className="text-xs text-slate-400 ml-auto font-mono">ISSUE Entity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="issue-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                <option value="Elevator">Elevator</option>
                <option value="Ramp">Ramp</option>
                <option value="Accessible Washroom">Accessible Washroom</option>
                <option value="Tactile Path">Tactile Path</option>
                <option value="Handrail">Handrail</option>
                <option value="Accessible Parking">Accessible Parking</option>
                <option value="Water Cooler">Water Cooler</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label htmlFor="issue-severity" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Severity / Urgency <span className="text-red-500">*</span>
              </label>
              <select
                id="issue-severity"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                <option value="CRITICAL">CRITICAL (Immediate hazard / Total blockage • 4h SLA)</option>
                <option value="HIGH">HIGH (Severe hindrance to daily mobility • 24h SLA)</option>
                <option value="MEDIUM">MEDIUM (Moderate disruption; alternative available • 72h SLA)</option>
                <option value="LOW">LOW (Cosmetic wear or minor signage • 120h SLA)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="issue-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Issue Title / Headline <span className="text-red-500">*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Elevator #2 stopped between Ground & 1st Floor"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="issue-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="issue-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Describe what is broken or obstructed, the exact location, whether wheelchair or visually impaired persons are impacted, and any displayed error codes..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Location & Feature Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="issue-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <select
                id="issue-location"
                value={locationId}
                onChange={(e) => {
                  setLocationId(e.target.value);
                  setFeatureId('');
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.location_id}>
                    {loc.building} • {loc.floor} ({loc.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="issue-feature" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Accessibility Feature (Optional Relational FK)
              </label>
              <select
                id="issue-feature"
                value={featureId}
                onChange={(e) => setFeatureId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="">-- General Location Issue (No specific feature) --</option>
                {matchingFeatures.map((f) => (
                  <option key={f.feature_id} value={f.feature_id}>
                    [{f.feature_id}] {f.feature_type} ({f.current_status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Supporting Image Upload */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileImage className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">3. Supporting Image (Optional)</h2>
          </div>

          <p className="text-xs text-slate-500">
            Provide on-site photos of the blocked path, damaged ramp, or broken device to help maintenance identify required replacement parts.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {!imagePreview ? (
            <div
              id="image-drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-8 text-center cursor-pointer transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Click to browse or drag and drop supporting photo
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          ) : (
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 max-w-sm">
              <img
                src={imagePreview}
                alt="Issue Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-submit-issue-form"
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <span>Submit Accessibility Issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
