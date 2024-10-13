import { deleteResponseById, getFormSubmissionResponse } from "@/api/auth";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Trash, X } from "lucide-react";
import  { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

const FormResponse = () => {
  const { id } = useParams();

  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const { data ,refetch} = useQuery(
    ["getFormResponseById", id], // `formId` as a dependency
    async () => await getFormSubmissionResponse(id!),
    {
      enabled: !!id,
      retry: 3,
    }
  );

  const mutationforFormSubmit = useMutation({
    mutationFn: async ({
      formId,
    }: {
      formId: string;
    }) => {
      return await deleteResponseById(formId);
    },
    onSuccess: () => {
      refetch()
      toast({
        variant: "default",
        className:"text-black dark:text-white",
        description: "Response deleted Successfully",
      })

    },
    onError: () => {
      // Handle error, e.g., show an error message
      toast({
        variant: "destructive",
        description: "Error Deleting Response",
      })
  
    },
  });

  const handleViewClick = (response: any) => {
    setSelectedResponse(response); // Set the selected response for detailed view
  };
  const closeDetails = () => {
    setSelectedResponse(null);
  };

  return (
    <div className="overflow-x-auto w-full md:w-[70%] max-w-7xl my-3 relative">
      <div className="relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Response ID
              </th>
              <th scope="col" className="px-6 py-3">
                Submitted At
              </th>
              <th scope="col" className="px-6 py-3">
                View
              </th>
              <th scope="col" className="px-6 py-3">
                Export
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length > 0 ?
              data?.map((response: any) => (
                <tr
                  key={response._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {response._id}
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(new Date(response.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewClick(response)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 text-start py-4">
                    <button
                      onClick={() => mutationforFormSubmit.mutate({formId:id!})}
                      className="font-medium  text-red-600 dark:text-red-500 hover:underline"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td
                    colSpan={5} // Set the colspan to match the number of table columns
                    className="px-6 py-4 text-lg text-center text-gray-500"
                  >
                    No records available
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      {selectedResponse && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <div className="h-[90%] w-[70%] bg-white dark:bg-gray-800 p-6 overflow-hidden shadow-lg sm:rounded-lg flex flex-col">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Response Details</h2>
              <button
                onClick={closeDetails}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedResponse.answers.map((answer: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="border p-4 mb-4 dark:bg-gray-700 rounded-lg shadow-md bg-white"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
                      {index + 1}: {answer?.questionText}
                    </p>
                    <p className="text-sm my-1 text-gray-700 dark:text-gray-200">{answer.answer.join(", ")}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponse;
