import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { IdeasListPage } from '@/pages/IdeasListPage';
import { NewIdeaPage } from '@/pages/NewIdeaPage';
import { IdeaDetailPage } from '@/pages/IdeaDetailPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ideas" element={<IdeasListPage />} />
            <Route path="/ideas/new" element={<NewIdeaPage />} />
            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
            <Route path="/analyses/:id" element={<AnalysisPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
