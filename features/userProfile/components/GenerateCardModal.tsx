"use client";

import { useEffect } from "react";
import { X, Smartphone, MapPin, Building, CalendarIcon } from "lucide-react";
import { StudentProfile } from "../types";
import { useGenerateCardForm } from "../hooks/useGenerateCardForm";

interface Props {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateCardModal({ profile, isOpen, onClose }: Props) {
  const {
    formData,
    isGenerating,
    isUnchanged,
    handleInputChange,
    handleSubmit,
  } = useGenerateCardForm(profile, onClose);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 overflow-hidden'>
      <div className='bg-[#0F1117] rounded-3xl w-full max-w-lg max-h-[90vh] border border-slate-700 shadow-2xl overflow-hidden flex flex-col'>
        <div className='bg-[#E7C9A5] p-6 flex justify-between items-center'>
          <div>
            <h3 className='text-xl font-bold text-[#05070A]'>
              Update ID Details
            </h3>
            <p className='text-[#05070A]/70 text-sm'>
              Changes will reflect on your digital ID card
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-black/5 rounded-full transition-colors'
          >
            <X className='w-6 h-6 text-[#05070A]' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='p-8 space-y-6 overflow-y-auto flex-1'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              label='Date of Birth'
              icon={CalendarIcon}
              type='date'
              value={formData.dateOfBirth}
              onChange={(v) => handleInputChange("dateOfBirth", v)}
            />
            <InputField
              label='Department'
              icon={Building}
              placeholder='e.g. Computer Science'
              value={formData.department}
              onChange={(v) => handleInputChange("department", v)}
            />
          </div>

          <InputField
            label='Contact Number'
            icon={Smartphone}
            placeholder='+123 456 789'
            value={formData.contactNo}
            onChange={(v) => handleInputChange("contactNo", v)}
          />

          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-300 flex items-center gap-2'>
              <MapPin className='w-4 h-4 text-[#E7C9A5]' /> Home Address
            </label>
            <textarea
              required
              className='w-full bg-[#161926] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[#E7C9A5] outline-none transition-all h-24 resize-none'
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <button
            disabled={isGenerating || isUnchanged}
            className='w-full bg-[#E7C9A5] text-[#05070A] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isGenerating
              ? "Saving Changes..."
              : isUnchanged
                ? "No Changes Detected"
                : "Update Card Information"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ElementType;
  value?: string;
  type?: string;
  placeholder?: string;
  // We explicitly tell TS that the callback receives a string
  onChange: (value: string) => void;
}

function InputField({
  label,
  icon: Icon,
  onChange,
  ...props
}: InputFieldProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-semibold text-slate-300 flex items-center gap-2'>
        <Icon className='w-4 h-4 text-[#E7C9A5]' /> {label}
      </label>
      <input
        required
        {...props}
        className='w-full bg-[#161926] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[#E7C9A5] outline-none transition-all'
        // Now TS knows e.target.value is being passed to a (value: string) => void function
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
