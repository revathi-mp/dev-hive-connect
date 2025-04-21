
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to HomePage when the root path is accessed
  return <Navigate to="/home" replace />;
};

export default Index;
