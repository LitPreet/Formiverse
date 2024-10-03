import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ClipboardCheck, Copy } from 'lucide-react'

const Card = () => {
    const [copy,setCopy] = useState(false)
  return (
    <div className="relative cursor-pointer dark:text-white h-60">
        <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-primary rounded-lg dark:bg-gray-200"></span>
        <div
            className="relative p-6 bg-white dark:bg-gray-800 border-2 border-primary h-full dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
            <div className="flex items-center">
                {/* <span className="text-xl">😎</span> */}
                <h3 className="my-1 text-lg font-bold text-gray-800 dark:text-white">Untitled Form</h3>
            </div>
            <p className="text-gray-600 mb-2 dark:text-gray-300">
                Add Description
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                1 Questions
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                0 Submissions
            </p>
            <p className="text-gray-600 dark:text-gray-300">
                Created 1 week ago
            </p>
            <div className="flex justify-between items-center my-3">
                <Button >Manage Form</Button>
                <Button className='p-0 my-2 w-10 h-9' onClick={() => setCopy(!copy)}  variant={"outline"}>{copy ?<Copy className='text-sm'/> : <ClipboardCheck className='text-sm'/>}</Button>
            </div>
        </div>
    </div>
  )
}

export default Card
