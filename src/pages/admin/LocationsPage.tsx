import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FeatureStatusBadge } from '../../components/common/Badge';
import {
  Building,
  MapPin,
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onNavigate }) => {
  const { locations, features, issues } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<string>('ALL');

  const buildings = Array.from(new Set(locations.map((l) => l.building)));

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (buildingFilter !== 'ALL' && loc.building !== buildingFilter) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        return (
          loc.location_id.toLowerCase().includes(t) ||
          loc.building.toLowerCase().includes(t) ||
          loc.floor.toLowerCase().includes(t) ||
          loc.area.toLowerCase().includes(t) ||
          loc.description.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [locations, buildingFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Campus Spatial Infrastructure
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Campus Locations Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Relational master table of campus academic blocks, floors, and physical accessibility points.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by building, floor, area, description..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Campus Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLocations.map((loc) => {
          const locFeatures = features.filter((f) => f.location_id === loc.location_id);
          const locIssues = issues.filter((i) => i.location_id === loc.location_id);
          const openIssues = locIssues.filter((i) => i.status !== 'RESOLVED');

          return (
            <div
              key={loc.location_id}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {loc.location_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">
                      {loc.building}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {loc.floor} • <span className="font-semibold text-slate-700">{loc.area}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                        openIssues.length > 0
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {openIssues.length > 0 ? `${openIssues.length} Active Issue(s)` : 'Clear of Barriers'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {loc.description}
                </p>

                {/* Features installed at this location */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Registered Features ({locFeatures.length})
                  </span>
                  {locFeatures.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No dedicated accessibility feature entity registered.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {locFeatures.map((f) => (
                        <div
                          key={f.feature_id}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-medium text-slate-700">{f.feature_type}</span>
                          <FeatureStatusBadge status={f.current_status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Relational Key Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total Historical Tickets: <strong>{locIssues.length}</strong></span>
                <span className="font-mono text-[11px] text-slate-400">PK: location_id</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Coverage Note */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-600" />
          JKLU Campus Coverage:
        </p>
        <p className="text-[11px] text-slate-600">
          All 29 campus locations across academic blocks, LRC, hostels, grounds, and parking zones are mapped to ensure swift incident reporting and resolution tracking.
        </p>
      </div>
    </div>
  );
};
