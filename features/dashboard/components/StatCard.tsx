"use client";

import deltaUpSvg from "@/assets/svg/admin/deltaUp.svg";
import deltaDownSvg from "@/assets/svg/admin/deltaDown.svg";
import Image from "next/image";

interface StatCardProps {
  label: string;
  value: number;
  delta: number; // This will now receive the growth percentage
  positiveIsGood?: boolean;
}

function DeltaBadge({
  delta,
  positiveIsGood = true,
}: {
  delta: number;
  positiveIsGood?: boolean;
}) {
  if (delta === 0) return null;
  const isPositive = delta > 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isGood ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <Image
        src={isGood ? deltaUpSvg : deltaDownSvg}
        className='w-3 h-3'
        alt='delta icon'
      />
      {Math.abs(delta)}%
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  positiveIsGood = true,
}: StatCardProps) {
  return (
    <div className='bg-white rounded-2xl px-7 py-6 flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <span className='text-[16px] font-medium text-[#64748B]'>{label}</span>
        <DeltaBadge delta={delta} positiveIsGood={positiveIsGood} />
      </div>
      <p className='text-3xl font-semibold text-[#1E293B] tracking-tight'>
        {value.toLocaleString()}
      </p>
      {delta !== 0 && (
        <p className='text-xs text-slate-400'>
          {delta > 0 ? `+${delta}%` : `${delta}%`} growth rate
        </p>
      )}
    </div>
  );
}
