import { deleteFormById } from '@/api/auth';
import { toast } from '@/hooks/use-toast';
import { useRoutePath } from '@/hooks/useRoutePath';
import React, { useState } from 'react'
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

const FormSettings = () => {
  const {id} = useParams();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const path = useRoutePath()
 const navigate = useNavigate();
  const isDeleteEnabled = confirmationText.toLowerCase() === 'delete';

  const mutationforFormDelete = useMutation({
    mutationFn: async ({
      formId,
    }: {
      formId: string;
    }) => {
      return await deleteFormById(formId);
    },
    onSuccess: (data: any) => {
      navigate(path.dashboard)
      toast({
        variant: "default",
        className:"text-black dark:text-white",
        description: "Form deleted Successfully",
      })

    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      toast({
        variant: "destructive",
        description: "Error Deleting form",
      })
  
    },
  });


  const handleDelete = async () => {
    if (!isDeleteEnabled) return;

    setIsDeleting(true); // Show a loading state when deleting
    try {
      mutationforFormDelete.mutate({formId: id!})
     
    } catch (error) {
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };
  return (
    <div className='w-xs max-w-sm my-4'>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        To confirm deletion, please type <strong>"delete"</strong> below.
      </p>
      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        className="border dark:bg-gray-600 dark:text-white border-gray-300 rounded-md w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Type delete to confirm"
      />
      <button
        onClick={handleDelete}
        disabled={!isDeleteEnabled || isDeleting}
        className={`w-full px-4 py-2 rounded-md text-white ${isDeleteEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'} ${
          isDeleting ? 'opacity-50' : ''
        }`}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}

export default FormSettings
