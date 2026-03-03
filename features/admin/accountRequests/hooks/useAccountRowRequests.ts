import { useState } from "react";
import { toast } from "sonner";
import {
  approveAccountRequest,
  denyAccountRequest,
} from "../actions/accountRequests";

export function useAccountRowRequest(request: any) {
  const [modals, setModals] = useState({
    approve: false,
    deny: false,
    idCard: false,
  });

  const [loading, setLoading] = useState({
    approving: false,
    denying: false,
  });

  const [isDone, setIsDone] = useState(false);

  const toggleModal = (type: keyof typeof modals, state: boolean) => {
    setModals((prev) => ({ ...prev, [type]: state }));
  };

  const handleApprove = async () => {
    setLoading((prev) => ({ ...prev, approving: true }));
    try {
      await approveAccountRequest(request.id);
      toast.success(`${request.student.fullName}'s account approved.`);
      setIsDone(true);
    } catch {
      toast.error("Failed to approve account.");
    } finally {
      setLoading((prev) => ({ ...prev, approving: false }));
      toggleModal("approve", false);
    }
  };

  const handleDeny = async () => {
    setLoading((prev) => ({ ...prev, denying: true }));
    try {
      await denyAccountRequest(request.id);
      toast.success(`${request.student.fullName}'s account denied.`);
      setIsDone(true);
    } catch {
      toast.error("Failed to deny account.");
    } finally {
      setLoading((prev) => ({ ...prev, denying: false }));
      toggleModal("deny", false);
    }
  };

  return {
    modals,
    loading,
    isDone,
    toggleModal,
    handleApprove,
    handleDeny,
  };
}
