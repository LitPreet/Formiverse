import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useRoutePath } from '@/routes/routePath';

const MainPage = () => {
  const navigate = useNavigate()
  const path = useRoutePath()
  return (
    <div>
      <h1>Welcome to Our Application</h1>
      <p>This is the main page. Please log in or sign up to continue.</p>
      {/* Add links or buttons for Login and Register */}
      <Button onClick={() => navigate(path.dashboard)}>Dashboard</Button>
    </div>
  );
};

export default MainPage;
