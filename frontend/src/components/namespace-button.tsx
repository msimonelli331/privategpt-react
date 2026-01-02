import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NamespaceButtonProps {
  apiUrl?: string;
}

export const NamespaceButton = ({ apiUrl }: NamespaceButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNamespaces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the provided API URL or default to the backend
      const url = apiUrl || '/api/namespaces';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNamespaces(data.namespaces || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching namespaces:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={fetchNamespaces} 
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? 'Loading...' : 'Fetch Namespaces'}
      </Button>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {namespaces.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Namespaces:</h3>
          <ul className="space-y-1">
            {namespaces.map((namespace, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                {namespace.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};