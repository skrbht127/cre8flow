import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkflowPage from './pages/WorkflowPage'
import AuthPage from './pages/AuthPage'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading } = useAuth();
  console.log('APP AUTH STATE - loading:', loading, 'user:', user);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <AuthPage />;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workflow/:id" element={<WorkflowPage />} />
    </Routes>
  );
}