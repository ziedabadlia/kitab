import { useState, useEffect } from "react";
import { BorrowRequest } from "../types";

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
  const [latestRequest, setLatestRequest] = useState<BorrowRequest>(request);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch fresh data every time receipt opens
  useEffect(() => {
    setIsFetching(true);
    fetch(`/api/admin/borrow-requests/${request.id}`)
      .then((res) => res.json())
      .then((data) => setLatestRequest(data))
      .catch(() => setLatestRequest(request))
      .finally(() => setIsFetching(false));
  }, [request.id]);

  const duration = (() => {
    const borrowedRaw = latestRequest.rawBorrowedAt;
    const dueRaw = latestRequest.rawDueDate;
    if (!borrowedRaw || !dueRaw) return "N/A";
    const borrowed = new Date(borrowedRaw);
    const due = new Date(dueRaw);
    if (isNaN(borrowed.getTime()) || isNaN(due.getTime())) return "N/A";
    const days = Math.ceil(
      (due.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${days} day${days !== 1 ? "s" : ""}`;
  })();

  const handlePrint = () => window.print();
  const handleClose = () => setIsOpen(false);

  const handleSavePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch("/api/generate-receipt-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: latestRequest, isLateReturn }),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${latestRequest.id.slice(-8)}.pdf`;
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
    isFetching,
    duration,
    latestRequest,
    handlePrint,
    handleClose,
    handleSavePdf,
  };
}
