import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user || !user.isVerified || user.isAdmin) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectRoute;
