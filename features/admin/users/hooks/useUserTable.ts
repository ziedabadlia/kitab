"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserTableData } from "./useUserTableData";
import { usersKeys, deleteUser } from "../services/userService";
import { DeleteModalState, UsersPage } from "../types/users";

export function useUserTable(initialData: UsersPage) {
  const queryClient = useQueryClient();
  const dataLayer = useUserTableData(initialData);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    userId: null,
    userName: null,
    email: null,
  });

  const handleConfirmDelete = async () => {
    if (!deleteModal.userId) return;
    const { userId, userName, email } = deleteModal;

    setIsDeleting(true);
    try {
      await deleteUser(userId, email!);
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      toast.success(`${userName ?? "User"} deleted successfully.`);
      setDeleteModal((p) => ({ ...p, isOpen: false }));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    ...dataLayer,
    selectedImage,
    setSelectedImage,
    deleteModal,
    setDeleteModal,
    isDeleting,
    handleConfirmDelete,
  };
}
