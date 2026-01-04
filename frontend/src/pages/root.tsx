import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { checkIsPgptHealthy } from '@/lib/pgpt';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export const RootPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [environment, setEnvironment, deleteEnvironment] = useLocalStorage<
    string | undefined
  >('pgpt-url', undefined);
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPrivateGptHealth = async (env: string) => {
    try {
      const isHealthy = await checkIsPgptHealthy(env);
      if (!isHealthy) {
        alert('The Private GPT instance is not healthy');
        return deleteEnvironment();
      }
      // Remove auto-redirect to /chat
      // if (pathname === '/') {
      //   navigate('/chat');
      // }
    } catch {
      alert('The Private GPT instance is not healthy');
      deleteEnvironment();
    }
  };

  const fetchPrivateGptInstances = async () => {

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/namespaces/private-gpt-instances", {
        headers: {
          "accepts": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInstances(data.instances || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching private gpt instances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!environment) {
      const url = prompt(
        'Please enter the URL of your Private GPT instance',
        'http://localhost:8001',
      );
      if (!url) return;
      setEnvironment(url);
      checkPrivateGptHealth(url);
    } else {
      checkPrivateGptHealth(environment);
    }
  }, [environment]);

  // Fetch private gpt instances when navigating to root path
  useEffect(() => {
    if (pathname === '/') {
      fetchPrivateGptInstances();
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PrivateGPT Dashboard</h1>
          <button
            onClick={fetchPrivateGptInstances}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Instances'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Instance Box */}
          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-300 flex items-center justify-center"
            onClick={() => navigate('/create')}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">+</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Instance</h2>
              <p className="text-gray-600">Click to create a new PrivateGPT instance</p>
            </div>
          </div>
          
          {instances.length > 0 ? (
            instances.map((instance, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/chat?namespace=${instance.metadata?.name}`)}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Instance: {instance.metadata?.name}</h2>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Domain: {instance.spec?.domain || 'N/A'}</span>
                  <span>Created: {instance.metadata?.creationTimestamp ? new Date(instance.metadata.creationTimestamp).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No private gpt instances found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Refresh Instances" to load data</p>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};