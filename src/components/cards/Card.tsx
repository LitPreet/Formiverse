import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ClipboardCheck, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IForm } from '@/lib/types/Form'
import { formatDistanceToNow } from 'date-fns';
import { getFirst25Words } from '@/lib/utils'

const Card = ({formData}:{formData:IForm}) => {
    const [copy,setCopy] = useState(false)
    const navigate = useNavigate();
    const timeAgo = formatDistanceToNow(new Date(formData.createdAt), { addSuffix: true });
    const handleCopy = () => {
        const formLink = `${window.location.origin}/submit-form/${formData._id}`;
        navigator.clipboard.writeText(formLink).then(() => {
          setCopy(true);
          setTimeout(() => setCopy(false), 2000); // Reset after 2 seconds
        });
      };
  return (
    <div className="relative cursor-pointer dark:text-white h-60">
        <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-primary rounded-lg dark:bg-gray-200"></span>
        <div
            className="relative p-6 bg-white dark:bg-gray-800 border-2 border-primary h-full dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
            <div className="flex items-center">
                {/* <span className="text-xl">😎</span> */}
                <h3 className="my-1 text-lg font-bold text-gray-800 dark:text-white"> {getFirst25Words(formData?.heading)}</h3>
            </div>
            <p className="text-gray-600 mb-2 dark:text-gray-300">
                {formData.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                {formData.questionsCount} Questions
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                0 Submissions
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                Created {timeAgo}
            </p>
            <div className="flex justify-between items-center my-3">
                <Button onClick={() => navigate(`/form/${formData._id}`)}>Edit Form</Button>
                <Button className='p-0 my-2 w-10 h-9' onClick={handleCopy} variant={"outline"}>
            {copy ? <ClipboardCheck className='text-sm' /> : <Copy className='text-sm' />}
          </Button>
            </div>
        </div>
    </div>
  )
}

export default Card
