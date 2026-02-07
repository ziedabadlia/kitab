"use client";

import Image from "next/image";
import { Download, Share2 } from "lucide-react";

interface SecureIdCardProps {
  profile: any;
  onGenerate: () => void;
}

export default function SecureIdCard({ profile }: SecureIdCardProps) {
  if (!profile || !profile.generatedIdCardUrl) return null;

  return (
    <div className='w-full flex justify-start'>
      <div className='w-full md:w-[80%] lg:w-full'>
        {/* THE CARD CONTAINER - Adaptive Layout */}
        <div className='w-full rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 select-none bg-linear-to-br from-[#1a1d3a] via-[#0f1729] to-[#1a3a3a]'>
          {/* Card Layout Container */}
          <div className='relative flex flex-col'>
            {/* HEADER SECTION */}
            <div className='px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-white/10'>
              {/* Logo */}
              <div className='relative w-10 h-10 sm:w-12 sm:h-12 shrink-0'>
                <Image
                  src='/logo.svg'
                  fill
                  alt='Logo'
                  className='object-contain drop-shadow-xl'
                  priority
                />
              </div>

              {/* University Info */}
              <div className='flex-1 min-w-0'>
                <h2 className='text-white font-bold text-xs sm:text-sm leading-tight tracking-tight truncate'>
                  {profile.universityName}
                </h2>
                <p className='text-[#E7C9A5] text-[8px] sm:text-[9px] font-medium tracking-wide mt-0.5 truncate'>
                  Empowering Dreams, Inspiring Futures
                </p>
              </div>
            </div>

            {/* CONTENT SECTION - Changes layout based on screen width */}
            <div className='p-3 sm:p-4'>
              <div className='flex flex-col gap-4 items-center'>
                {/* Photo */}
                <div className='relative w-40 h-40 rounded-xl border-2 border-[#d4b592] overflow-hidden shadow-2xl'>
                  <Image
                    src={
                      profile.profilePictureUrl || "/images/default-avatar.png"
                    }
                    fill
                    className='object-cover'
                    alt='Student Photo'
                  />
                </div>

                {/* Info */}
                <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 min-w-0 w-full flex justify-center'>
                  <div className='space-y-2 flex flex-col w-fit'>
                    <InfoRowHorizontal
                      label='Student ID'
                      value={profile.studentIdNumber}
                    />
                    <InfoRowHorizontal
                      label='Full Name'
                      value={profile.fullName}
                    />
                    <InfoRowHorizontal
                      label='Department'
                      value={profile.department || "N/A"}
                    />
                    <InfoRowHorizontal
                      label='Date of Birth'
                      value={
                        profile.dateOfBirth
                          ? new Date(profile.dateOfBirth).toLocaleDateString(
                              "en-US",
                              {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "N/A"
                      }
                    />
                    <InfoRowHorizontal
                      label='Contact'
                      value={profile.contactNo || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER SECTION */}
            <div className='px-3 sm:px-4 py-2 sm:py-2.5 border-t border-white/10 bg-black/20 backdrop-blur-sm'>
              <div className='flex items-center justify-between gap-2'>
                {/* Contact Info */}
                <div className='flex-1 min-w-0 space-y-0.5'>
                  <p className='text-white/70 text-[8px] sm:text-[9px] font-medium truncate'>
                    University No:{" "}
                    <span className='text-white font-semibold'>
                      +1 (800) 456-7890
                    </span>
                  </p>
                  <p className='text-white/70 text-[8px] sm:text-[9px] font-medium truncate'>
                    Website:{" "}
                    <span className='text-[#E7C9A5] font-semibold'>
                      www.kitab.edu
                    </span>
                  </p>
                </div>

                {/* QR Code - Always in footer */}
                <div className='relative w-12 h-12 sm:w-14 sm:h-14 bg-white p-1 sm:p-1.5 rounded-lg shadow-2xl flex-shrink-0'>
                  <Image
                    src={profile.generatedIdCardUrl}
                    fill
                    alt='Verification QR'
                    className='object-contain'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 mt-4'>
          <button className='flex-1 bg-linear-to-r from-[#1a1d2e] to-[#252941] border border-slate-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-[#E7C9A5]/50 hover:shadow-lg hover:shadow-[#E7C9A5]/10 transition-all duration-300 group'>
            <Download className='w-4 h-4 text-[#E7C9A5] group-hover:scale-110 transition-transform' />
            <span>Download PDF</span>
          </button>
          <button className='flex-1 bg-linear-to-r from-[#E7C9A5] to-[#d4b592] text-[#1a1d2e] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#E7C9A5]/30 transition-all duration-300 group'>
            <Share2 className='w-4 h-4 group-hover:scale-110 transition-transform' />
            <span>Share Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRowHorizontal({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='text-slate-300 text-md font-medium whitespace-nowrap  shrink-0'>
        {label}
      </span>
      <span className='text-[#E7C9A5] font-bold text-md shrink-0'>:</span>
      <span className='text-white text-md font-semibold flex-1'>{value}</span>
    </div>
  );
}
