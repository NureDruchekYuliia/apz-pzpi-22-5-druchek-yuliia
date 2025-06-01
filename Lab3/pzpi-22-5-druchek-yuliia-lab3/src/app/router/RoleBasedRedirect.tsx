import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../lib/hooks/useAccount';

export default function RoleBasedRedirect() {
  const { currentUser } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'Admin') {
      navigate('/admin');
    } else if (currentUser.role === 'User') {
      navigate('/sleep-records');
    } else {
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  return null; 
}
