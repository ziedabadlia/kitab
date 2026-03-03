"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value?: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  label?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseValue(
  value?: string,
): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

function toValue(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DatePicker({
  value,
  onChange,
  label = "Date of Birth",
}: DatePickerProps) {
  const parsed = parseValue(value);
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    parsed?.year ?? today.getFullYear() - 20,
  );
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
  const [mode, setMode] = useState<"calendar" | "year">("calendar");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setMode("calendar");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Sync view when value changes externally
  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [value]);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    onChange(toValue(viewYear, viewMonth, day));
    setOpen(false);
    setMode("calendar");
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const displayValue = parsed
    ? `${MONTHS[parsed.month]} ${parsed.day}, ${parsed.year}`
    : "";

  // Year range: 100 years back to today
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className='space-y-2 relative' ref={ref}>
      {label && (
        <label className='text-sm font-semibold text-slate-300 flex items-center gap-2'>
          <CalendarIcon className='w-4 h-4 text-[#E7C9A5]' />
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-[#161926] border rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all outline-none
          ${open ? "border-[#E7C9A5]" : "border-slate-700 hover:border-slate-600"}`}
      >
        <span className={displayValue ? "text-white" : "text-slate-500"}>
          {displayValue || "Select date"}
        </span>
        <CalendarIcon
          className={`w-4 h-4 transition-colors ${open ? "text-[#E7C9A5]" : "text-slate-500"}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute top-full left-0 mt-2 z-50 w-full min-w-[300px] bg-[#0F1117] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150'>
          {/* Header */}
          <div className='bg-[#E7C9A5] px-4 py-3 flex items-center justify-between'>
            <button
              type='button'
              onClick={prevMonth}
              className='p-1.5 rounded-lg hover:bg-black/10 transition-colors'
            >
              <ChevronLeft className='w-4 h-4 text-[#05070A]' />
            </button>

            <button
              type='button'
              onClick={() =>
                setMode((m) => (m === "year" ? "calendar" : "year"))
              }
              className='font-bold text-[#05070A] text-sm hover:bg-black/10 px-3 py-1 rounded-lg transition-colors'
            >
              {MONTHS[viewMonth]} {viewYear}
            </button>

            <button
              type='button'
              onClick={nextMonth}
              className='p-1.5 rounded-lg hover:bg-black/10 transition-colors'
            >
              <ChevronRight className='w-4 h-4 text-[#05070A]' />
            </button>
          </div>

          {mode === "year" ? (
            // ── Year picker ───────────────────────────────────────────────
            <div className='p-3 grid grid-cols-4 gap-1.5 max-h-[220px] overflow-y-auto scrollbar-none'>
              {years.map((year) => (
                <button
                  key={year}
                  type='button'
                  onClick={() => {
                    setViewYear(year);
                    setMode("calendar");
                  }}
                  className={`py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      year === viewYear
                        ? "bg-[#E7C9A5] text-[#05070A]"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            // ── Calendar grid ─────────────────────────────────────────────
            <div className='p-3'>
              {/* Day headers */}
              <div className='grid grid-cols-7 mb-1'>
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className='text-center text-xs font-bold text-slate-500 py-1'
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className='grid grid-cols-7 gap-y-0.5'>
                {/* Empty cells for offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const isSelected =
                      parsed?.day === day &&
                      parsed?.month === viewMonth &&
                      parsed?.year === viewYear;

                    const isToday =
                      today.getDate() === day &&
                      today.getMonth() === viewMonth &&
                      today.getFullYear() === viewYear;

                    const isFuture = new Date(viewYear, viewMonth, day) > today;

                    return (
                      <button
                        key={day}
                        type='button'
                        disabled={isFuture}
                        onClick={() => handleDayClick(day)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all
                        ${
                          isSelected
                            ? "bg-[#E7C9A5] text-[#05070A] font-bold"
                            : isToday
                              ? "border border-[#E7C9A5]/40 text-[#E7C9A5]"
                              : isFuture
                                ? "text-slate-700 cursor-not-allowed"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          {parsed && (
            <div className='px-4 pb-3 pt-1 border-t border-slate-800 flex justify-between items-center'>
              <span className='text-xs text-slate-500'>
                {MONTHS[parsed.month]} {parsed.day}, {parsed.year}
              </span>
              <button
                type='button'
                onClick={() => {
                  onChange("");
                }}
                className='text-xs text-slate-500 hover:text-red-400 transition-colors'
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
