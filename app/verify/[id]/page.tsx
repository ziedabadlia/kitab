import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BadgeCheck, XCircle, GraduationCap, Calendar } from "lucide-react";
import Image from "next/image";
import { UserStatus } from "@prisma/client";

// 1. Update interface to be a Promise
interface VerifyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  // 2. Await the params
  const { id } = await params;

  // 3. Use the awaited ID
  const student = await db.student.findUnique({
    where: { studentIdNumber: id },
    include: { user: true },
  });

  if (!student) return notFound();

  const isAccepted = student.status === UserStatus.ACCEPTED;

  return (
    <div className='min-h-screen bg-[#05070A] flex items-center justify-center p-6'>
      <div className='w-full max-w-md bg-[#12141D] rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden'>
        {/* Decorative Background Glow */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] ${isAccepted ? "bg-emerald-500/20" : "bg-red-500/20"}`}
        />

        <div className='flex flex-col items-center text-center'>
          <div className='relative w-32 h-32 mb-6'>
            <div
              className={`absolute inset-0 rounded-full animate-pulse border-2 ${isAccepted ? "border-emerald-500/50" : "border-red-500/50"}`}
            />
            <div className='relative w-full h-full rounded-full overflow-hidden border-4 border-[#12141D]'>
              {/* Added a fallback image just in case */}
              <Image
                src={student.user.profilePictureUrl || "/icons/user.svg"}
                alt='Student'
                fill
                className='object-cover'
              />
            </div>
          </div>

          {isAccepted ? (
            <div className='flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20 mb-4'>
              <BadgeCheck className='w-5 h-5' />
              <span className='font-bold text-sm tracking-wide uppercase'>
                Verified Member
              </span>
            </div>
          ) : (
            <div className='flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full border border-red-500/20 mb-4'>
              <XCircle className='w-5 h-5' />
              <span className='font-bold text-sm tracking-wide uppercase'>
                Inactive Status
              </span>
            </div>
          )}

          <h1 className='text-2xl font-bold text-white mb-1'>
            {student.user.fullName}
          </h1>
          <p className='text-slate-400 text-sm mb-8'>{student.user.email}</p>

          <div className='w-full space-y-3 bg-[#05070A]/50 rounded-2xl p-5 border border-slate-800/50'>
            <VerifyRow
              icon={GraduationCap}
              label='University'
              value={student.universityName}
            />
            <VerifyRow
              icon={Calendar}
              label='Member Since'
              value={new Date(student.createdAt).getFullYear().toString()}
            />
            <VerifyRow
              icon={BadgeCheck}
              label='Student ID'
              value={student.studentIdNumber}
            />
          </div>

          <p className='mt-8 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]'>
            Official BookWise Verification System
          </p>
        </div>
      </div>
    </div>
  );
}

function VerifyRow({ icon: Icon, label, value }: any) {
  return (
    <div className='flex justify-between items-center text-sm'>
      <div className='flex items-center gap-2 text-slate-500'>
        <Icon className='w-4 h-4' />
        <span>{label}</span>
      </div>
      <span className='text-slate-200 font-semibold'>{value}</span>
    </div>
  );
}
