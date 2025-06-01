import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginForm from '../../features/account/LoginForm';
import RegisterForm from '../../features/account/RegisterForm';
import { ProfileSettingsPage } from '../../features/account/ProfileSettingsPage';
import RequireAuth from '../shared/components/RequireAuth';
import SleepRecordsPage from '../../features/records/SleepRecordsPage';
import SleepEditPage from '../../features/records/SleepFormPage';
import AdminDashboard from '../../features/admin/AdminDashboard';
import App from '../layout/App';
import RoleBasedRedirect from './RoleBasedRedirect';
import SleepFormPage from '../../features/records/SleepFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  
    children: [
      { path: '', element: <RoleBasedRedirect /> },  

      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'profile', element: <ProfileSettingsPage /> },
      { path: 'unauthorized', element: <div>Access denied</div> },

      {
        element: <RequireAuth allowedRoles={['User']} />,
        children: [
          { path: 'sleep-records', element: <SleepRecordsPage /> },
          { path: '/sleep-records/new', element: <SleepFormPage/>},
          { path: 'sleep-records/:id/edit', element: <SleepEditPage /> },
        ]
      },

      {
        element: <RequireAuth allowedRoles={['Admin']} />,
        children: [
          { path: 'admin', element: <AdminDashboard /> },
        ]
      },

      { path: '*', element: <Navigate replace to='/not-found' /> },
    ],
  },
]);
