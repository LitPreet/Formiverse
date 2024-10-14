import { sendFormLinkMail } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MailFormUrl } from "@/lib/types/Form";
import { ClipboardCheck, Copy, X } from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "react-query";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  formUrl,
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copy, setCopy] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl);
    setCopy(true);
    setTimeout(() => setCopy(false), 2000);
  };

  const mutationforMailShare = useMutation({
    mutationFn: async (data: MailFormUrl) => {
      return await sendFormLinkMail(data);
    },
    onSuccess: () => {
      setEmail("");
      setError("");
      toast({
        variant: "default",
        className: "text-black dark:text-white",
        description: "Mail Sent Successfully",
      });
    },
    onError: (error: any) => {

      toast({
        variant: "destructive",
        description: `${error?.data?.message || "Something went wrong"}`,
      });
    },
  });

  const handleSendEmail = (url: string, recipientEmail: string) => {
    if (!email) {
      setError("invalid email");
      return false;
    }
    const data: MailFormUrl = { url, recipientEmail };
    mutationforMailShare.mutate(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-gray-200 text-gray-700">
            Share Your Form
          </h2>
          <button onClick={onClose} className=" bg-red-600 text-white">
            <X />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={formUrl}
            readOnly
            className="font-semibold w-[90%] p-2 text-sm  bg-transparent outline-none border  text-gray-600 dark:text-gray-100"
            onFocus={handleCopy}
          />
          <button
            onClick={handleCopy}
            className=" text-sm dark:text-white text-gray-600"
          >
            {copy ? (
              <ClipboardCheck className="text-sm" />
            ) : (
              <Copy className="text-sm" />
            )}
          </button>
        </div>
        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="border border-gray-500 dark:bg-gray-700 text-gray-800 bg-white dark:text-white outline-none p-2 w-full rounded"
            required
          />
          {error && error.length > 0 && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <div className="flex justify-end w-full">
            <Button
              onClick={() => handleSendEmail(formUrl, email)}
              className="mt-2"
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
