"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { EmptyAccountRequests } from "./EmptyAccountRequests";

interface AccountRequest {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  universityName: string;
  requestedAt: string;
}

interface Props {
  requests: AccountRequest[];
  pendingCount: number;
}

export function RecentAccountRequests({ requests, pendingCount }: Props) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h2 className='text-[20px] font-semibold text-[#1E293B]'>
            Account Requests
          </h2>
          {pendingCount > 0 && (
            <p className='text-xs text-slate-400 mt-0.5'>
              {pendingCount} awaiting approval
            </p>
          )}
        </div>
        <Link
          href='/admin/account-requests'
          className='text-[14px] font-semibold text-[#25388C] bg-[#f8f8ff] px-3 py-2 rounded-[6px]'
        >
          View all
        </Link>
      </div>

      {/* Content Area */}
      {requests.length === 0 ? (
        <EmptyAccountRequests />
      ) : (
        <div className='relative'>
          <div className='overflow-y-auto h-60 pr-1 scrollbar-hide'>
            <div className='grid grid-cols-3 gap-3'>
              {requests.map((req) => (
                <Link
                  key={req.id}
                  href='/admin/account-requests'
                  className='flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors text-center group'
                >
                  <Avatar imageUrl={req.avatar} name={req.fullName} size='lg' />

                  <div className='min-w-0 w-full'>
                    <p className='text-[16px] font-medium text-[#1E293B] truncate'>
                      {req.fullName}
                    </p>
                    <p className='text-[14px] font-normal text-[#64748B] truncate mt-0.5'>
                      {req.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Fade Mask */}
          {requests.length > 6 && (
            <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl' />
          )}
        </div>
      )}
    </div>
  );
}
