import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { checkIsPgptHealthy } from '@/lib/pgpt';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { PrivateGPTInstanceForm } from '@/components/private-gpt-instance-form';

export const RootPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [environment, setEnvironment, deleteEnvironment] = useLocalStorage<
    string | undefined
  >('pgpt-url', undefined);
  const [showForm, setShowForm] = useState(false);

  const checkPrivateGptHealth = async (env: string) => {
    try {
      const isHealthy = await checkIsPgptHealthy(env);
      if (!isHealthy) {
        alert('The Private GPT instance is not healthy');
        return deleteEnvironment();
      }
      if (pathname === '/') {
        navigate('/chat');
      }
    } catch {
      alert('The Private GPT instance is not healthy');
      deleteEnvironment();
    }
  };

  useEffect(() => {
    if (!environment) {
      setShowForm(true);
    } else {
      checkPrivateGptHealth(environment);
    }
  }, [environment]);

  if (showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">PrivateGPT Instance</h2>
          <PrivateGPTInstanceForm />
        </div>
      </div>
    );
  }

  if (environment) return <Outlet />;
  return <div>Loading...</div>;
};