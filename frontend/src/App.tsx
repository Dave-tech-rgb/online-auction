import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import CreateAuction from './pages/CreateAuction/CreateAuction';
import EditAuction from './pages/EditAuction/EditAuction';
import AuctionDetail from './pages/AuctionDetail/AuctionDetail'; 
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/edit-auction/:id" element={<EditAuction />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />  
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;