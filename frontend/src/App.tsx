import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import CreateAuction from './pages/CreateAuction/CreateAuction';
import EditAuction from './pages/EditAuction/EditAuction';
import AuctionDetail from './pages/AuctionDetail/AuctionDetail';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/create-auction" element={<PrivateRoute><CreateAuction /></PrivateRoute>} />
            <Route path="/edit-auction/:id" element={<PrivateRoute><EditAuction /></PrivateRoute>} />
            <Route path="/auction/:id" element={<PrivateRoute><AuctionDetail /></PrivateRoute>} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;