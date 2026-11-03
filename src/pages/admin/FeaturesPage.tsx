import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FeatureStatusBadge } from '../../components/common/Badge';
import {
  Layers,
  Building,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Database,
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const { features, locations, issues } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredFeatures = features.filter((f) => {
    if (statusFilter !== 'ALL' && f.current_status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      return (
        f.feature_id.toLowerCase().includes(t) ||
        f.feature_type.toLowerCase().includes(t) ||
        (f.description || f.notes || '').toLowerCase().includes(t) ||
        f.location_id.toLowerCase().includes(t)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Accessibility Assets
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Accessibility Features Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Catalog of campus accessibility hardware (elevators, ramps, tactile pavers, braille signs, and automatic doors).
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search features by type, ID, or description..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="AVAILABLE">AVAILABLE (Operational)</option>
              <option value="NEEDS_MAINTENANCE">NEEDS MAINTENANCE</option>
              <option value="UNAVAILABLE">UNAVAILABLE (Out of Service)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feat) => {
          const loc = locations.find((l) => l.location_id === feat.location_id);
          const relatedIssues = issues.filter((i) => i.feature_id === feat.feature_id);
          const activeIssues = relatedIssues.filter((i) => i.status !== 'RESOLVED');

          return (
            <div
              key={feat.feature_id}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {feat.feature_id}
                  </span>
                  <FeatureStatusBadge status={feat.current_status} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{feat.feature_type}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{feat.description || feat.notes}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {loc ? `${loc.building} • ${loc.floor}` : feat.location_id}
                    </span>
                  </div>
                  {loc && <p className="text-[11px] text-slate-400 pl-5">{loc.area}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span
                  className={`font-semibold ${
                    activeIssues.length > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {activeIssues.length > 0 ? `${activeIssues.length} active complaint(s)` : 'No active complaints'}
                </span>
                <span className="font-mono text-[10px] text-slate-400">ID: {feat.feature_id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Tracking Note */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600" />
          Campus Accessibility Hardware Monitoring:
        </p>
        <p className="text-[11px] text-slate-600">
          When an issue is linked to a feature (such as elevators, ramps, tactile pavers, or water coolers), maintenance updates automatically sync with the feature's operational availability across campus.
        </p>
      </div>
    </div>
  );
};
