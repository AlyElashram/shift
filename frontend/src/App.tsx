import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './hooks/AuthProvider';
import { AdminLayout } from './components/admin/AdminLayout';
import Home from './pages/Home';
import Track from './pages/Track';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Shipments from './pages/admin/Shipments';
import ShipmentDetail from './pages/admin/ShipmentDetail';
import ShipmentEdit from './pages/admin/ShipmentEdit';
import ShipmentNew from './pages/admin/ShipmentNew';
import Leads from './pages/admin/Leads';
import Statuses from './pages/admin/Statuses';
import Templates from './pages/admin/Templates';
import Showcase from './pages/admin/Showcase';
import Users from './pages/admin/Users';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/track/:trackingId" element={<Track />} />

          {/* Admin login (no layout) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin routes (with layout + auth guard) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="shipments/new" element={<ShipmentNew />} />
            <Route path="shipments/:id" element={<ShipmentDetail />} />
            <Route path="shipments/:id/edit" element={<ShipmentEdit />} />
            <Route path="leads" element={<Leads />} />
            <Route path="statuses" element={<Statuses />} />
            <Route path="templates" element={<Templates />} />
            <Route path="showcase" element={<Showcase />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
