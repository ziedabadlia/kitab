"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import AuthCard from "./AuthCard";
import FileDropzone from "./AuthDropZone";
import AuthButton from "./AuthButton";
import useFetchUniversities from "../hooks/useFetchUniversities";
import useSignupForm from "../hooks/useSignupForm";
import { PasswordInput } from "./PasswordInput";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

const RegistrationForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [universitySearch, setUniversitySearch] = useState("");
  const [debouncedSearch] = useDebounce(universitySearch, 400);

  const { universities, isLoadingOptions } =
    useFetchUniversities(debouncedSearch);
  const { form, isSubmitting, onSubmit } = useSignupForm();

  return (
    <AuthCard
      title='Create Your Library Account'
      description='Please complete all fields and upload a valid university ID'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-3 md:space-y-4'
        >
          <fieldset
            disabled={isSubmitting}
            className='space-y-3 md:space-y-4 border-none p-0'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='form-label text-sm'>
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        id='fullName'
                        {...field}
                        className='form-input h-10'
                      />
                    </FormControl>
                    <FormMessage className='text-[10px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='form-label text-sm'>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='email@university.edu'
                        id='email'
                        {...field}
                        className='form-input h-10'
                      />
                    </FormControl>
                    <FormMessage className='text-[10px]' />
                  </FormItem>
                )}
              />
            </div>

            {/* University Searchable Select */}
            <FormField
              control={form.control}
              name='universityName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='form-label text-sm'>
                    Select University
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type='button'
                          role='combobox'
                          aria-expanded={open}
                          disabled={isSubmitting}
                          className={cn(
                            "h-10 w-full justify-between px-4 text-sm bg-[#232839] border-none rounded-[5px] font-normal hover:bg-[#2a3048]",
                            field.value ? "text-white" : "text-slate-400",
                          )}
                        >
                          <span className='truncate'>
                            {field.value || "-- Select University --"}
                          </span>
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-slate-400' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent
                      className='p-0 bg-[#1a1f2e] border border-white/10 rounded-[8px] shadow-2xl'
                      style={{ width: "var(--radix-popover-trigger-width)" }}
                      align='start'
                    >
                      {/* Search input */}
                      <div className='px-2 pt-2 pb-1 border-b border-white/10'>
                        <Input
                          placeholder='Search university...'
                          value={universitySearch}
                          onChange={(e) => setUniversitySearch(e.target.value)}
                          className='h-8 text-sm bg-[#232839] border-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[5px]'
                          autoFocus
                        />
                      </div>

                      {/* Results list */}
                      <div
                        className='max-h-52 overflow-y-auto py-1'
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#e7c9a5 transparent",
                        }}
                      >
                        {isLoadingOptions ? (
                          <div className='flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-400'>
                            <Loader2 className='h-3 w-3 animate-spin' />
                            Searching...
                          </div>
                        ) : universities.length === 0 ? (
                          <div className='px-4 py-3 text-sm text-slate-400 text-center'>
                            {debouncedSearch
                              ? "No universities found"
                              : "Type to search universities"}
                          </div>
                        ) : (
                          universities.map((uni) => (
                            <button
                              key={uni.id}
                              type='button'
                              onClick={() => {
                                field.onChange(uni.name);
                                setOpen(false);
                                setUniversitySearch("");
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm text-white hover:bg-[#e7c9a5]/10 flex items-center justify-between gap-2 transition-colors",
                                field.value === uni.name &&
                                  "text-[#e7c9a5] bg-[#e7c9a5]/10",
                              )}
                            >
                              <span className='truncate'>{uni.name}</span>
                              {field.value === uni.name && (
                                <Check className='h-3.5 w-3.5 shrink-0 text-[#e7c9a5]' />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='universityID'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='form-label text-sm'>
                      University ID Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='eg: 12345678'
                        {...field}
                        className='form-input h-10'
                      />
                    </FormControl>
                    <FormMessage className='text-[10px]' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='form-label text-sm'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Atleast 8 characters long'
                        {...field}
                        className='form-input h-10'
                      />
                    </FormControl>
                    <FormMessage className='text-[10px]' />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='idCardUpload'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='form-label text-sm'>
                    Upload University ID Card
                  </FormLabel>
                  <FormControl>
                    <FileDropzone field={field} form={form} />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />

            <div className='pt-2'>
              <AuthButton
                isSubmitting={isSubmitting}
                isLoadingOptions={isLoadingOptions}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </AuthButton>
            </div>
          </fieldset>

          <p className='text-center text-xs md:text-sm text-slate-400 mt-2'>
            Have an account already?{" "}
            <Link
              href='/login'
              className={cn(
                "text-[#E7C9A5] font-semibold hover:underline",
                isSubmitting && "opacity-50 pointer-events-none",
              )}
            >
              Login
            </Link>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegistrationForm;
