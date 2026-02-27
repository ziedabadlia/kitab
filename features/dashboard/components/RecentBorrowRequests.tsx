"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import calendarSvg from "@/assets/svg/admin/calendar.svg";
import BookCover from "@/components/BookCover";
import { Avatar } from "@/components/Avatar";
import { EmptyBorrowRequests } from "./EmptyBorrowRequests";

interface BorrowRequest {
  id: string;
  bookTitle: string;
  coverImageUrl: string | null;
  coverColor: string;
  studentName: string;
  studentAvatar: string | null;
  requestedAt: string;
  genre: string;
  author: string;
}

interface Props {
  requests: BorrowRequest[];
  pendingCount: number;
}

export function RecentBorrowRequests({ requests, pendingCount }: Props) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h2 className='text-base font-semibold text-[20px] text-[#1E293B]'>
            Borrow Requests
          </h2>
          {pendingCount > 0 && (
            <p className='text-xs text-slate-400 mt-0.5'>
              {pendingCount} pending review
            </p>
          )}
        </div>
        <Link
          href='/admin/borrow-requests'
          className='text-[14px] font-semibold text-[#25388C] bg-[#f8f8ff] px-3 py-2 rounded-[6px]'
        >
          View all
        </Link>
      </div>

      <div className='relative'>
        <ul className='space-y-3 overflow-y-auto h-[300px] scrollbar-hide'>
          {requests.length === 0 ? (
            <EmptyBorrowRequests />
          ) : (
            requests.map((req) => (
              <li
                key={req.id}
                className='flex items-center gap-3 p-3 rounded-xl bg-[#F8F8FF] transition-colors group'
              >
                {/* Book Cover */}
                <div className='w-[55px] h-[78px] shrink-0 relative'>
                  <BookCover
                    coverColor={req.coverColor}
                    coverImage={req.coverImageUrl || ""}
                    className='object-cover'
                  />
                </div>

                {/* Book & Student Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-[16px] font-semibold text-[#1E293B] truncate leading-snug'>
                    {req.bookTitle}
                  </p>
                  <p className='text-sm font-normal text-[#64748B] truncate leading-snug'>
                    By {req.author} • {req.genre}
                  </p>

                  <div className='flex items-center gap-1.5 mt-1.5'>
                    <Avatar
                      imageUrl={req.studentAvatar}
                      className='h-[18px] w-[18px] text-[8px]'
                      name={req.studentName}
                    />
                    <div className='flex items-center gap-3'>
                      <span className='text-xs font-normal text-[#3A354E] truncate'>
                        {req.studentName}
                      </span>
                      <span className='text-xs text-slate-400 shrink-0 flex items-center gap-1'>
                        <Image
                          src={calendarSvg}
                          alt='Calendar'
                          width={14}
                          height={14}
                        />
                        {req.requestedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href='/admin/borrow-requests'
                  className='p-2 rounded-lg bg-white shadow-xs group-hover:bg-slate-50 transition-colors'
                  title='View request'
                >
                  <Eye className='w-4 h-4 text-[#475569]' />
                </Link>
              </li>
            ))
          )}
        </ul>

        {/* Bottom Fade Mask for Scrolling */}
        {requests.length > 2 && (
          <div className='absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent pointer-events-none rounded-b-xl' />
        )}
      </div>
    </div>
  );
}
