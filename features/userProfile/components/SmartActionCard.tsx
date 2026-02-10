"use client";

import { Edit3, CreditCard, ChevronRight } from "lucide-react";

interface SmartActionCardProps {
  hasCard: boolean;
  onAction: () => void;
}

export default function SmartActionCard({
  hasCard,
  onAction,
}: SmartActionCardProps) {
  return (
    <button
      onClick={onAction}
      className={`w-full group relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 ${
        hasCard
          ? "bg-[#12141D] border-slate-800 hover:border-[#E7C9A5]/40"
          : "bg-linear-to-br from-[#1a1d2e] to-[#0f1117] border-[#E7C9A5]/20 hover:border-[#E7C9A5]/50 shadow-xl shadow-[#E7C9A5]/5"
      }`}
    >
      <div className='flex items-center justify-between relative z-10'>
        <div className='flex items-center gap-5'>
          {/* Icon Orb */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${
              hasCard
                ? "bg-slate-900 border-slate-700"
                : "bg-[#E7C9A5]/10 border-[#E7C9A5]/20"
            }`}
          >
            {hasCard ? (
              <Edit3 className='w-6 h-6 text-[#E7C9A5]' />
            ) : (
              <CreditCard className='w-6 h-6 text-[#E7C9A5]' />
            )}
          </div>

          <div className='text-left'>
            <h4 className='text-white font-bold text-lg leading-none'>
              {hasCard ? "Edit Card Information" : "Generate Digital ID Card"}
            </h4>
            <p className='text-slate-500 text-sm mt-1.5 font-medium'>
              {hasCard
                ? "Keep your department and contact details up to date."
                : "Add your department, contact, and address to get started."}
            </p>
          </div>
        </div>

        <div
          className={`p-2 rounded-full transition-all ${
            hasCard
              ? "bg-slate-800 text-slate-400"
              : "bg-[#E7C9A5] text-[#05070A]"
          }`}
        >
          <ChevronRight className='w-5 h-5' />
        </div>
      </div>

      {/* Decorative Glow for the 'Generate' state */}
      {!hasCard && (
        <div className='absolute -right-10 -top-10 w-40 h-40 bg-[#E7C9A5]/5 blur-3xl rounded-full' />
      )}
    </button>
  );
}
