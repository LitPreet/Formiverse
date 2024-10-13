import { getAllForms, handleCreateForm } from "@/api/auth";
import Plus from "@/assets/images/add.png";
import Party from "@/assets/images/party-card.png";
import Contact from "@/assets/images/contact-form.png";
import Feedback from "@/assets/images/feedback.png";
import Card from "@/components/cards/Card";
import { ShimmerDashboard } from "@/components/loader/Shimmer";
import SearchBar from "@/components/saerchBar";
import { IForm } from "@/lib/types/Form";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: handleCreateForm,
    onSuccess: (data: any) => {
      navigate(`/form/${data.data?.response?.formId}`);
    },
    onError: (error: any) => {
      console.error("Registration error", error);
    },
  });

  const { data, error, isLoading, isError } = useQuery(
    ["getAllforms"], 
    async () => await getAllForms(),
    {
      retry: 2,
    }
  );


  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const formsPerPage = 6;

  const filteredForms = data?.data?.filter((form: IForm) =>
    form.heading.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination variables
  const totalForms = filteredForms.length;
  const totalPages = Math.ceil(totalForms / formsPerPage);
  const startIndex = (currentPage - 1) * formsPerPage;
  const endIndex = startIndex + formsPerPage;
  const paginatedForms = filteredForms.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border ${
            currentPage === i
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600"
          } hover:bg-purple-700 hover:text-white`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center items-center space-x-2 my-2">
        {/* Prev Button */}
        {currentPage !== 1 &&  <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border bg-white text-gray-600 hover:bg-purple-700 hover:text-white"
        >
          Prev
        </button>}
        {/* Page Numbers */}
        {pages}

        {/* Next Button */}
        {currentPage !== totalPages && <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border bg-white text-gray-600 hover:bg-purple-700 hover:text-white"
        >
          Next
        </button>}
      
      </div>
    );
  };
    
  if (isError) return <div className="w-full h-screen flex items-center justify-center text-gray-600 dark:text-gray-200 text-xl">Error loading data</div>;

  return (
    <div className="min-h-screen w-full dark:text-gray-200 text-gray-700 overflow-x-hidden">
      {isLoading ? (
        <ShimmerDashboard />
      ) : (
        <>
          <div className="flex flex-col justify-center py-4 items-center w-full gap-1 bg-gray-200 dark:bg-black">
            <div className="px-4 py-4 flex justify-start sm:justify-center snap-mandatory snap-x items-center w-full gap-4 overflow-x-auto scroll-pl-4 scroll-pr-4">
              {/* Card for Blank Form */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-white dark:bg-gray-200 flex justify-center items-center h-36 w-36 snap-center sm:w-36 sm:h-36 hover:border hover:border-primary"
                  onClick={() => mutation.mutate("blank_form")}
                >
                  <img src={Plus} alt="add" className="w-12 h-12" />
                </div>
                <p>Blank Form</p>
              </div>

              {/* Card for Party Invite */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
                  onClick={() => mutation.mutate("party_invite")}
                >
                  <img src={Party} alt="add" className="w-16 h-16" />
                </div>
                <p>Party Invite</p>
              </div>

              {/* Card for Contact Form */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
                  onClick={() => mutation.mutate("contact_form")}
                >
                  <img src={Contact} alt="add" className="w-16 h-16" />
                </div>
                <p>Contact Form</p>
              </div>

              {/* Card for Feedback Form */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
                  onClick={() => mutation.mutate("feedback_form")}
                >
                  <img src={Feedback} alt="add" className="w-14 h-14" />
                </div>
                <p>Feedback Form</p>
              </div>
            </div>
          </div>

          {data.data && data.data.length > 0 && <SearchBar onSearch={handleSearch}/>}
          <div className=" w-full flex flex-col items-center justify-center">
            <div className="w-[90%] sm:w-[80%] flex justify-center flex-col">
              <div className="flex justify-start items-center w-full">
                <h3 className="dark:text-white text-gray-600 text-xl ml-0 md:ml-2 px-2 sm:px-0">
                  My Forms
                </h3>
              </div>
              {/* {data.data && data.data.length > 0 ? ( */}
              {paginatedForms && paginatedForms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full m-0 gap-7 my-4 px-2">
                  {paginatedForms.map((d: IForm, i: number) => (
                    <Card key={i} formData={d} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <div className="flex flex-col items-center justify-center h-full p-8  bg-white dark:bg-black w-full border-none max-w-md rounded-lg shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-700">
                      No Forms Available
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 mt-2 mb-6 text-center">
                      You haven't created any forms yet. Start by creating a new
                      form to gather responses and manage your data efficiently.
                    </p>
                  </div>
                </div>
              )}
               {totalPages > 1 && renderPagination()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
