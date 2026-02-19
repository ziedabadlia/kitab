// app/api/generate-receipt-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request: requestData, isLateReturn } = body;

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper to draw dashed horizontal lines (TypeScript-safe; avoids jsPDF.setLineDash)
    function drawDashedLine(
      d: jsPDF,
      x1: number,
      y: number,
      x2: number,
      dash = 2,
      gap = 2,
    ) {
      let x = x1;
      while (x < x2) {
        const xEnd = Math.min(x + dash, x2);
        d.line(x, y, xEnd, y);
        x = xEnd + gap;
      }
    }

    // Colors
    const primaryBlue = "#25388C";
    const slate700 = "#334155";
    const slate500 = "#64748b";
    const slate400 = "#94a3b8";
    const red600 = "#dc2626";
    const green600 = "#16a34a";

    // Header background
    doc.setFillColor(primaryBlue);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Header text
    doc.setTextColor("#ffffff");
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Borrowing Receipt", 20, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const transactionId = requestData.id.slice(-8);
    doc.text(`Transaction ID: ${transactionId}`, 20, 32);

    // Status Badge
    let yPos = 55;
    const status = requestData.status.toLowerCase();
    let badgeColor, badgeBorderColor, statusText;

    if (status === "returned") {
      badgeColor = "#dcfce7";
      badgeBorderColor = green600;
      statusText = "Returned";
    } else if (status === "borrowed" || status === "active") {
      badgeColor = "#dbeafe";
      badgeBorderColor = "#1d4ed8";
      statusText = "Active";
    } else if (isLateReturn || status === "overdue") {
      badgeColor = "#fee2e2";
      badgeBorderColor = red600;
      statusText = "Late Return";
    } else {
      badgeColor = "#f1f5f9";
      badgeBorderColor = slate700;
      statusText = requestData.status;
    }

    // Book Information
    yPos += 25;
    doc.setTextColor(slate700);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const bookTitle = requestData.book.title || "Unknown Book";
    doc.text(bookTitle, 20, yPos, { maxWidth: pageWidth - 40 });

    // Book Details
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate500);

    const author = requestData.book.author || "Unknown";
    doc.text(`Author: ${author}`, 20, yPos);

    if (requestData.book.genre) {
      yPos += 6;
      doc.text(`Genre: ${requestData.book.genre}`, 20, yPos);
    }

    // Calculate duration
    if (requestData.borrowedAt && requestData.dueDate) {
      try {
        const borrowed = new Date(requestData.borrowedAt);
        const due = new Date(requestData.dueDate);
        const duration = Math.ceil(
          (due.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24),
        );
        yPos += 6;
        doc.text(
          `Duration: ${duration} day${duration !== 1 ? "s" : ""}`,
          20,
          yPos,
        );
      } catch (e) {
        // Skip duration if dates are invalid
      }
    }

    // Dashed line separator
    yPos += 10;
    doc.setDrawColor(slate400);
    drawDashedLine(doc, 20, yPos, pageWidth - 20, 2, 2);

    // Information Grid
    yPos += 15;
    doc.setTextColor(slate500);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Row 1 Labels
    doc.text("BORROWER", 20, yPos);
    doc.text("REQUESTED DATE", pageWidth - 20, yPos, { align: "right" });

    yPos += 5;
    doc.setTextColor(slate700);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    const borrowerName = requestData.student?.fullName || "Unknown";
    const requestedAt = requestData.requestedAt || "N/A";

    doc.text(borrowerName, 20, yPos);
    doc.text(requestedAt, pageWidth - 20, yPos, { align: "right" });

    // Row 2 Labels
    yPos += 12;
    doc.setTextColor(slate500);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text("BORROWED ON", 20, yPos);
    doc.text("DUE DATE", pageWidth - 20, yPos, { align: "right" });

    yPos += 5;
    doc.setTextColor(slate700);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    const borrowedAtDisplay = requestData.borrowedAt || "N/A";
    const dueDateDisplay = requestData.dueDate || "N/A";

    doc.text(borrowedAtDisplay, 20, yPos);
    doc.text(dueDateDisplay, pageWidth - 20, yPos, { align: "right" });

    // Return Date
    yPos += 12;
    doc.setTextColor(slate500);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("RETURN DATE", 20, yPos);

    yPos += 6;
    const returnedAt = requestData.returnedAt;

    if (isLateReturn) {
      doc.setTextColor(red600);
    } else if (returnedAt) {
      doc.setTextColor(green600);
    } else {
      doc.setTextColor(slate500);
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const returnText = returnedAt || "Not yet returned";
    doc.text(returnText, 20, yPos);

    // Another dashed line
    yPos += 12;
    doc.setDrawColor(slate400);
    drawDashedLine(doc, 20, yPos, pageWidth - 20, 2, 2);

    // Quote at bottom
    yPos += 12;
    doc.setTextColor(slate500);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const quote = '"A book is a gift you can open again and again."';
    doc.text(quote, pageWidth / 2, yPos, { align: "center" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const now = new Date();
    const footerText = `Generated on ${now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} at ${now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 15, { align: "center" });

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${transactionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
