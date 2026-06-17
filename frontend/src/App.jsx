import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import ScrollTopButton from './components/ScrollTopButton';
import Home from './pages/Home';
import Rentals from './pages/Rentals';
import RentalDetail from './pages/RentalDetail';
import Reservations from './pages/Reservations';
import Cleaning from './pages/Cleaning';
import Construction from './pages/Construction';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './admin/DashboardOverview';
import AdminContentEditor from './admin/AdminContentEditor';
import AdminHomepage from './admin/AdminHomepage';
import AdminRentals from './admin/AdminRentals';
import AdminBookings from './admin/AdminBookings';
import AdminCleaning from './admin/AdminCleaning';
import AdminConstruction from './admin/AdminConstruction';
import AdminConsultationRequests from './admin/AdminConsultationRequests';
import AdminServices from './admin/AdminServices';
import AdminUsers from './admin/AdminUsers';
import AdminSettings from './admin/AdminSettings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LOCAL_ASSETS from './assets/images';

function AdminRoute({ children }) {
  const auth = useAuth() || {};
  const user = auth.user ?? null;
  const isAdmin = auth.isAdmin ?? false;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  // Don't show footer on home page or inside admin
  const showFooter = location.pathname !== '/' && !isAdminSection;

  return (
    <div
      className={`app-shell min-h-screen text-navy-900 ${isAdminSection ? 'admin-shell bg-sand-50' : 'public-shell'}`}
      style={!isAdminSection ? { '--page-bg-image': `url(${LOCAL_ASSETS.hero1})` } : undefined}
    >
      {!isAdminSection && <Navbar />}
      <main className={isAdminSection ? '' : 'pt-16 pb-20 md:pb-6'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:id" element={<RentalDetail />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cleaning" element={<Cleaning />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="content" element={<AdminContentEditor />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="rentals" element={<AdminRentals />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="cleaning" element={<AdminCleaning />} />
            <Route path="construction" element={<AdminConstruction />} />
            <Route path="requests" element={<AdminConsultationRequests />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<div className="p-10 text-center">Page not found. <a href="/" className="text-bordeaux-500 hover:text-bordeaux-600">Go home</a></div>} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      {!isAdminSection && <BottomNavigation />}
      {!isAdminSection && <ScrollTopButton />}
    </div>
  );
}
