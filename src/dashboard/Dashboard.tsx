
import Plus from '@/assets/images/add.png'
import Card from '@/components/cards/Card';
import SearchBar from '@/components/saerchBar';


const Dashboard = () => {
  return (
    <div className="min-h-screen dark:text-gray-200 text-gray-700 overflow-x-hidden">
      <div className="flex flex-col justify-center py-4 items-center w-full gap-1 bg-gray-300 dark:bg-black">
        {/* <p className="text-center  md:text-start w-full  md:w-1/2 md:mr-9">start a new form</p> */}
        <div className="px-4 flex justify-center snap-mandatory snap-x items-center w-full gap-9 overflow-x-auto scroll-pl-4 scroll-pr-4">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-200 flex justify-center items-center h-32 w-32 snap-center sm:w-36 sm:h-36 hover:border hover:border-primary">
            <img src={Plus} alt='add' className='w-12 h-12'/>
            </div>
            <p>Blank Form</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-300 snap-center w-36 h-36 hover:border hover:border-primary">1</div>
            <p>Party Invite</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-300 snap-center w-36 h-36 hover:border hover:border-primary">1</div>
            <p>Contact Form</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-300 snap-center w-36 h-36 hover:border hover:border-primary">1</div>
            <p>Work Request</p>
          </div>
        </div>
      </div>
      <SearchBar />
      
      <div className=" w-full flex flex-col items-center justify-center">
        <div className="w-[90%] sm:w-[80%] flex justify-center flex-col">
      <div className="flex justify-start items-center w-full">
        <h3 className='dark:text-white text-gray-600 text-xl ml-8'>My Forms</h3>
      </div>
      <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 m-0 gap-7 my-4 px-2">
      {new Array(6).fill('').map((_,i) => {
        return (<Card key={i}/>)
      })}
      </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
