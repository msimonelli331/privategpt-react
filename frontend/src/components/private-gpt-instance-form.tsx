import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PrivateGPTInstanceFormProps {
  apiUrl?: string;
}

export const PrivateGPTInstanceForm = ({ apiUrl }: PrivateGPTInstanceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ollamaURL: '',
    image: '',
    domain: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = apiUrl || `/api/namespaces/private-gpt-instances`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name || `private-gpt-instance-${Date.now()}` // Generate name if not provided
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        ollamaURL: '',
        image: '',
        domain: ''
      });
      console.log('PrivateGPTInstance created:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating PrivateGPTInstance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create PrivateGPTInstance</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter privategpt instance name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ollama URL
          </label>
          <input
            type="text"
            name="ollamaURL"
            value={formData.ollamaURL}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ollama URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="text"
            name="image"
            value={formData.image ?? "ghcr.io/msimonelli331/privategpt:latest"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain
          </label>
          <input
            type="text"
            name="domain"
            value={formData.domain ?? "devops"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter domain"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Creating...' : 'Create PrivateGPTInstance'}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          PrivateGPTInstance created successfully!
        </div>
      )}
    </div>
  );
};