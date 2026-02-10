"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface SecureIdCardProps {
  profile: any;
  onGenerate: () => void;
}

export default function SecureIdCard({ profile }: SecureIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!profile || !profile.generatedIdCardUrl) return null;

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // html-to-image handles oklch and lab colors much better than html2canvas
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ensures the PNG is high-resolution for printing
      });

      const link = document.createElement("a");
      link.download = `${profile.fullName.replace(/\s+/g, "_")}_ID_Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("PNG Generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='w-full flex justify-start'>
      <div className='w-full md:w-[80%] lg:w-full'>
        {/* THE CARD - Hardcoded hex colors in style to be safe */}
        <div
          ref={cardRef}
          style={{
            background:
              "linear-gradient(135deg, #2A1B3D 0%, #12141D 50%, #0D3B3F 100%)",
          }}
          className='w-full rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 select-none'
        >
          <div className='relative flex flex-col'>
            {/* Header */}
            <div className='px-4 py-3 flex items-center gap-3 border-b border-white/10'>
              <div className='relative w-12 h-12 shrink-0'>
                <Image
                  src='/logo.svg'
                  fill
                  alt='Logo'
                  className='object-contain'
                  priority
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h2 className='text-white font-bold text-sm leading-tight truncate'>
                  {profile.universityName}
                </h2>
                <p className='text-[#E7C9A5] text-[9px] font-medium tracking-wide'>
                  Empowering Dreams, Inspiring Futures
                </p>
              </div>
            </div>

            {/* Photo & Info */}
            <div className='p-4 space-y-4 flex flex-col items-center'>
              <div className='relative w-40 h-40 rounded-xl border-2 border-[#d4b592] overflow-hidden shadow-2xl'>
                <Image
                  src={
                    profile.profilePictureUrl || "/images/default-avatar.png"
                  }
                  fill
                  className='object-cover'
                  alt='Student'
                />
              </div>

              <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 w-full'>
                <div className='space-y-2 flex flex-col items-center text-center'>
                  <InfoRow label='Student ID' value={profile.studentIdNumber} />
                  <InfoRow label='Full Name' value={profile.fullName} />
                  <InfoRow
                    label='Department'
                    value={profile.department || "N/A"}
                  />
                  <InfoRow label='Contact' value={profile.contactNo || "N/A"} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='px-4 py-2.5 border-t border-white/10 bg-black/20'>
              <div className='flex items-center justify-between'>
                <div className='text-[9px] space-y-0.5'>
                  <p className='text-white/70'>
                    University No:{" "}
                    <span className='text-white'>+1 (800) 456-7890</span>
                  </p>
                  <p className='text-[#E7C9A5]'>www.kitab.edu</p>
                </div>
                <div className='relative w-14 h-14 bg-white p-1 rounded-lg'>
                  <Image
                    src={profile.generatedIdCardUrl}
                    fill
                    alt='QR'
                    className='object-contain'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className='w-full mt-4 bg-linear-to-r from-[#1a1d2e] to-[#252941] border border-slate-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:border-[#E7C9A5]/50 hover:shadow-lg transition-all disabled:opacity-50'
        >
          {isDownloading ? (
            <Loader2 className='w-4 h-4 animate-spin text-[#E7C9A5]' />
          ) : (
            <Download className='w-4 h-4 text-[#E7C9A5]' />
          )}
          <span>
            {isDownloading ? "Generating PNG..." : "Download ID Card (PNG)"}
          </span>
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='text-slate-300 text-xs font-medium shrink-0'>
        {label}
      </span>
      <span className='text-[#E7C9A5] font-bold'>:</span>
      <span className='text-white text-xs font-semibold'>{value}</span>
    </div>
  );
}
