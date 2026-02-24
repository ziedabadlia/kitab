"use client";

import Image from "next/image";
import { XCircle, Eye } from "lucide-react";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { ActionModal } from "./ActionModal";
import { IdCardModal } from "./IdCardModal";
import { useAccountRowRequest } from "../hooks/useAccountRowRequests";

export function AccountRequestRow({ request }: { request: any }) {
  const { modals, loading, isDone, toggleModal, handleApprove, handleDeny } =
    useAccountRowRequest(request);

  if (isDone) return null;

  return (
    <>
      <tr className='hover:bg-slate-50/50 transition-colors'>
        <td className='px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 flex items-center justify-center text-white font-medium text-xs border border-white ${
                request.student.profilePictureUrl
                  ? "bg-slate-200"
                  : getAvatarColor(request.student.fullName)
              }`}
            >
              {request.student.profilePictureUrl ? (
                <Image
                  src={request.student.profilePictureUrl}
                  alt={request.student.fullName}
                  fill
                  className='object-cover'
                />
              ) : (
                <span>{getInitials(request.student.fullName)}</span>
              )}
            </div>
            <div className='flex flex-col min-w-0'>
              <span className='font-semibold text-slate-900 truncate'>
                {request.student.fullName}
              </span>
              <span className='text-xs text-slate-400 truncate'>
                {request.student.email}
              </span>
            </div>
          </div>
        </td>

        <td className='px-6 py-4 text-slate-600'>{request.dateJoined}</td>
        <td className='px-6 py-4 text-slate-600 font-mono text-sm'>
          {request.studentIdNumber}
        </td>

        <td className='px-6 py-4'>
          <button
            onClick={() => toggleModal("idCard", true)}
            className='inline-flex items-center gap-1.5 text-sm text-[#25388C] font-medium hover:underline cursor-pointer'
          >
            <Eye className='w-4 h-4' /> View ID Card
          </button>
        </td>

        <td className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => toggleModal("approve", true)}
              className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF3] text-[#027A48] text-sm font-semibold rounded-lg transition-colors cursor-pointer'
            >
              Approve Account
            </button>
            <button
              onClick={() => toggleModal("deny", true)}
              className='p-1.5 text-[#EF3A4B] hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
              aria-label='Deny request'
            >
              <XCircle className='w-5 h-5' />
            </button>
          </div>
        </td>
      </tr>

      <IdCardModal
        isOpen={modals.idCard}
        onOpenChange={(open) => toggleModal("idCard", open)}
        fullName={request.student.fullName}
        idCardUrl={request.universityIdCardUrl}
      />

      <ActionModal
        isOpen={modals.approve}
        onClose={() => toggleModal("approve", false)}
        onConfirm={handleApprove}
        title='Approve Account Request'
        description="Approve the student's account request and grant access. A confirmation email will be sent upon approval."
        actionLabel='Approve & Send Confirmation'
        variant='approve'
        isLoading={loading.approving}
      />

      <ActionModal
        isOpen={modals.deny}
        onClose={() => toggleModal("deny", false)}
        onConfirm={handleDeny}
        title='Deny Account Request'
        description="Denying this request will notify the student they're not eligible due to unsuccessful ID card verification."
        actionLabel='Deny & Notify Student'
        variant='deny'
        isLoading={loading.denying}
      />
    </>
  );
}
