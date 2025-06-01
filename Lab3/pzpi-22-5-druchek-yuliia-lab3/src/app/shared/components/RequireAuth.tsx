import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAccount } from '../../../lib/hooks/useAccount';

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { currentUser, loadingUserInfo } = useAccount();
  const location = useLocation();
  console.log('Current role:', currentUser?.role);

  if (loadingUserInfo) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
