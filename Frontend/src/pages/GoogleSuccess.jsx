import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      navigate('/home');
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default GoogleSuccess;