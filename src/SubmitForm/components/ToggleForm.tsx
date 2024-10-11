import { Button } from "@/components/ui/button";
import { useRoutePath } from "@/hooks/useRoutePath";
import { useNavigate } from "react-router-dom";

interface ToggleFormInterface {
  handleSubmitAnotherResponse: () => void;
}

const ToggleForm = ({ handleSubmitAnotherResponse }: ToggleFormInterface) => {
    const navigate = useNavigate();
    const path = useRoutePath()
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <h2 className="text-2xl font-bold">Your response has been submitted!</h2>
      <p>Would you like to submit another response?</p>
      <Button onClick={handleSubmitAnotherResponse} className="mt-4">
        Submit Another Response
      </Button>
      <p className="mt-4 text-lg">
        Want to create new forms and share them?{" "}
        <span className="font-bold text-blue-600 cursor-pointer" onClick={() => navigate(path.home)}>
          Sign up to Forms!
        </span>
      </p>
      
    </div>
  );
};

export default ToggleForm;
