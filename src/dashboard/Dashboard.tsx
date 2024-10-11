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

const Dashboard = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: handleCreateForm,
    onSuccess: (data: any) => {
      navigate(`/form/${data.data?.response?.formId}`);
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });

  const { data, error, isLoading, isError } = useQuery(
    ["getAllforms"], // `formId` as a dependency
    async () => await getAllForms(),{
      retry: 2,
    }
  );
  if (isError) return <div>Error loading data</div>;
 
  return (
    <div className="min-h-screen w-full dark:text-gray-200 text-gray-700 overflow-x-hidden">
     {isLoading ? (<ShimmerDashboard />) : (<><div className="flex flex-col justify-center py-4 items-center w-full gap-1 bg-gray-200 dark:bg-black">

        <div className="px-4 flex justify-center snap-mandatory snap-x items-center w-full gap-9 overflow-x-auto scroll-pl-4 scroll-pr-4">
          <div className="flex flex-col items-center">
            <div
              className="bg-white dark:bg-gray-200 flex justify-center items-center h-32 w-32 snap-center sm:w-36 sm:h-36 hover:border hover:border-primary"
              onClick={() => mutation.mutate('blank_form')}
            >
              <img src={Plus} alt="add" className="w-12 h-12" />
            </div>
            <p>Blank Form</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
              onClick={() => mutation.mutate('party_invite')}>
              <img src={Party} alt="add" className="w-16 h-16" />
            </div>
            <p>Party Invite</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
             onClick={() => mutation.mutate('contact_form')}>
               <img src={Contact} alt="add" className="w-16 h-16" />
            </div>
            <p>Contact Form</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 snap-center w-36 h-36 hover:border hover:border-primary flex items-center justify-center"
              onClick={() => mutation.mutate('feedback_form')}>
               <img src={Feedback} alt="add" className="w-14 h-14" />
            </div>
            <p>Feedback Form</p>
          </div>
        </div>
      </div>
      {data.data && data.data.length > 0 && <SearchBar />}
      <div className=" w-full flex flex-col items-center justify-center">
        <div className="w-[90%] sm:w-[80%] flex justify-center flex-col">
          <div className="flex justify-start items-center w-full">
            <h3 className="dark:text-white text-gray-600 text-xl ml-8">
              My Forms
            </h3>
          </div>
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 m-0 gap-7 my-4 px-2">
            {data.data && data.data.length > 0 ? (
              data.data.map((d: IForm, i: number) => {
                return <Card key={i} formData={d} />;
              })
            ) : (
              <p>{""}</p>
            )}
          </div>
        </div>
      </div>
      </>
  )}
  </div>
);
};

export default Dashboard;
