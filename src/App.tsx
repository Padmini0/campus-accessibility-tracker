import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { PersonDashboard } from './pages/person/PersonDashboard';
import { ReportIssuePage } from './pages/person/ReportIssuePage';
import { MyIssuesPage } from './pages/person/MyIssuesPage';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffAssignedPage } from './pages/staff/StaffAssignedPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAllIssuesPage } from './pages/admin/AdminAllIssuesPage';
import { StaffAssignmentPage } from './pages/admin/StaffAssignmentPage';
import { VerificationPage } from './pages/admin/VerificationPage';
import { LocationsPage } from './pages/admin/LocationsPage';
import { FeaturesPage } from './pages/admin/FeaturesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { IssueHistoryPage } from './pages/shared/IssueHistoryPage';
import { IssueDetailsPage } from './pages/shared/IssueDetailsPage';
import { ProfilePage } from './pages/shared/ProfilePage';

const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (page: string, issueId?: string) => {
    if (page === 'issue-details' && issueId) {
      setPreviousPage(currentPage);
      setSelectedIssueId(issueId);
      setCurrentPage('issue-details');
    } else {
      setSelectedIssueId(null);
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetails = () => {
    setSelectedIssueId(null);
    setCurrentPage(previousPage || 'dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onSuccess={() => setCurrentPage('dashboard')} />
        <ToastContainer />
      </>
    );
  }

  // Render content based on current page and role
  const renderCurrentView = () => {
    // 1. Issue Details Page
    if (currentPage === 'issue-details' && selectedIssueId) {
      return (
        <IssueDetailsPage
          issueId={selectedIssueId}
          onBack={handleBackFromDetails}
          onNavigate={handleNavigate}
        />
      );
    }

    // 2. Shared Pages (available across roles)
    if (currentPage === 'locations') {
      return <LocationsPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'accessibility-features') {
      return <FeaturesPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'issue-history') {
      return <IssueHistoryPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'profile') {
      return <ProfilePage />;
    }
    if (currentPage === 'reports') {
      return <ReportsPage />;
    }

    // 3. Person (Student) Pages
    if (role === 'PERSON') {
      if (currentPage === 'report-issue') {
        return <ReportIssuePage onNavigate={handleNavigate} />;
      }
      if (currentPage === 'my-issues') {
        return <MyIssuesPage onNavigate={handleNavigate} />;
      }
      return <PersonDashboard onNavigate={handleNavigate} />;
    }

    // 4. Staff Pages
    if (role === 'STAFF') {
      if (currentPage === 'assigned-issues') {
        return <StaffAssignedPage onNavigate={handleNavigate} />;
      }
      return <StaffDashboard onNavigate={handleNavigate} />;
    }

    // 5. Admin Pages
    if (role === 'ADMIN') {
      if (currentPage === 'all-issues') {
        return <AdminAllIssuesPage onNavigate={handleNavigate} />;
      }
      if (currentPage === 'staff-assignment') {
        return <StaffAssignmentPage onNavigate={handleNavigate} />;
      }
      if (currentPage === 'verification') {
        return <VerificationPage onNavigate={handleNavigate} />;
      }
      return <AdminDashboard onNavigate={handleNavigate} />;
    }

    // Fallback
    return <PersonDashboard onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Application Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main App Container with Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
