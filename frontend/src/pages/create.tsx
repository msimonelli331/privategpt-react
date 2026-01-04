import { PrivateGPTInstanceForm } from '@/components/private-gpt-instance-form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create PrivateGPT Instance</h1>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <PrivateGPTInstanceForm />
        </div>
      </div>
    </div>
  );
};