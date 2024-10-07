import { Skeleton } from "../ui/skeleton";

export const ShimmerFormView = () => {
  return (
    <div className="flex flex-col space-y-3 w-full items-center">
      <Skeleton className="h-[125px] relative w-[70%] rounded-xl" />
      <Skeleton className="h-[125px] relative w-[70%] rounded-xl" />
      <Skeleton className="h-[125px] relative w-[70%] rounded-xl" />
      <Skeleton className="h-[125px] relative w-[70%] rounded-xl" />
    </div>
  );
};

export const ShimmerDashboard = () => {
  return (
    <div className="">
      <div className="flex justify-center max-w-7xl gap-3 my-6">
        <Skeleton className="h-32 w-32 relative rounded-xl" />
        <Skeleton className="h-32 w-32 relative  rounded-xl" />
        <Skeleton className="h-32 w-32 relative rounded-xl" />
        <Skeleton className="h-32 w-32 relative  rounded-xl" />
      </div>
      <div className="flex justify-center items-center my-3">
        <Skeleton className="w-[300px] sm:w-[400px] h-10 relative  rounded-xl" />
      </div>
      <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 m-0 gap-7 my-4 px-2">
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
        <Skeleton className="relative cursor-pointer dark:text-white h-60" />
      </div>
    </div>
  );
};
