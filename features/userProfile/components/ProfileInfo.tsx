"use client";

import { GraduationCap, Hash, BadgeCheck, MapPin, Phone } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import GenerateCardModal from "./GenerateCardModal";
import { useIdCard } from "../hooks/useIdCard";
import { StudentProfile } from "../types";
import SecureIdCard from "./SecureCardId";
import SmartActionCard from "./SmartActionCard";
import DetailRow from "./DetailRow";

export default function ProfileInfo({ profile }: { profile: StudentProfile }) {
  const { showModal, setShowModal } = useIdCard(profile.id);

  return (
    <div className='space-y-8'>
      {/* Profile Header Card */}
      <div className='bg-[#12141D] rounded-3xl p-8 border border-slate-800 shadow-xl'>
        <div className='flex flex-col items-center text-center'>
          <ProfilePicture
            userId={profile.id}
            currentUrl={profile.profilePictureUrl}
            name={profile.fullName}
          />

          <div className='mt-4 flex items-center gap-2'>
            <h2 className='text-2xl font-bold text-white tracking-tight'>
              {profile.fullName}
            </h2>
            <BadgeCheck className='w-6 h-6 text-[#E7C9A5]' />
          </div>
          <p className='text-slate-500 font-medium'>{profile.email}</p>

          <div className='mt-3 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20'>
            <span className='text-emerald-400 text-xs font-bold uppercase tracking-wider'>
              {profile.status} Student
            </span>
          </div>
        </div>

        <div className='mt-8 space-y-4'>
          <h3 className='text-slate-500 text-xs font-bold uppercase tracking-widest px-1'>
            Details
          </h3>
          <div className='space-y-1'>
            <DetailRow
              icon={GraduationCap}
              label='University'
              value={profile.universityName}
            />
            <DetailRow
              icon={Hash}
              label='Student ID'
              value={profile.studentIdNumber}
            />
            {profile.department && (
              <DetailRow
                icon={MapPin}
                label='Dept'
                value={profile.department}
              />
            )}
            {profile.contactNo && (
              <DetailRow
                icon={Phone}
                label='Contact'
                value={profile.contactNo}
              />
            )}
          </div>
        </div>
      </div>

      {/* SMART ACTION UI ELEMENT */}
      <SmartActionCard
        hasCard={!!profile.generatedIdCardUrl}
        onAction={() => setShowModal(true)}
      />

      {profile.generatedIdCardUrl && (
        <div className='mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <h3 className='text-slate-500 text-xs font-bold uppercase tracking-widest px-1 mb-4'>
            Your Digital Pass
          </h3>
          <SecureIdCard
            profile={profile}
            onGenerate={() => setShowModal(true)}
          />
        </div>
      )}

      {profile && (
        <GenerateCardModal
          profile={profile}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
