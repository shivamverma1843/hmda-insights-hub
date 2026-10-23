import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Upload from "@/pages/Upload";
import Reports from "@/pages/Reports";
import Q1MarketSize from "@/pages/Q1MarketSize";
import Q2Geography from "@/pages/Q2Geography";
import Q3SiteBuiltPremium from "@/pages/Q3SiteBuiltPremium";
import Q4CreditAccess from "@/pages/Q4CreditAccess";
import Q5Forecast from "@/pages/Q5Forecast";
import UnifiedDashboardPage from "@/pages/UnifiedDashboardPage";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<UnifiedDashboardPage />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/q1" element={<Q1MarketSize />} />
      <Route path="/reports/q2" element={<Q2Geography />} />
      <Route path="/reports/q3" element={<Q3SiteBuiltPremium />} />
      <Route path="/reports/q4" element={<Q4CreditAccess />} />
      <Route path="/reports/q5" element={<Q5Forecast />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App