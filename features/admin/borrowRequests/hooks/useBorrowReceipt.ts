import { useState, useMemo } from "react";

export interface BorrowRequest {
  id: string;
  status: string;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
  book: {
    title: string;
    author: string;
    genre: string | null;
    coverImageUrl: string;
    coverColor: string;
  };
  student: {
    fullName: string;
  };
}

interface UseBorrowReceiptProps {
  request: BorrowRequest;
  isLateReturn: boolean;
  setIsOpen: (val: boolean) => void;
}

export function useBorrowReceipt({
  request,
  isLateReturn,
  setIsOpen,
}: UseBorrowReceiptProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const duration = useMemo(() => {
    if (!request.borrowedAt || !request.dueDate) return "N/A";
    const borrowed = new Date(request.borrowedAt);
    const due = new Date(request.dueDate);
    const days = Math.ceil(
      (due.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${days} day${days !== 1 ? "s" : ""}`;
  }, [request.borrowedAt, request.dueDate]);

  const handlePrint = () => window.print();

  const handleClose = () => setIsOpen(false);

  const handleSavePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch("/api/generate-receipt-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          isLateReturn,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${request.id.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    duration,
    handlePrint,
    handleClose,
    handleSavePdf,
  };
}
