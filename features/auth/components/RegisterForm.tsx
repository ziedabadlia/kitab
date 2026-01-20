"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthCard from "./AuthCard";
import FileDropzone from "./AuthDropZone";
import AuthButton from "./AuthButton";
import useFetchUniversities from "../hooks/useFetchUniversities";
import useSignupForm from "../hooks/useSignupForm";

const RegistrationForm: React.FC = () => {
  const { universities, isLoadingOptions } = useFetchUniversities();
  const { form, isSubmitting, onSubmit } = useSignupForm();

  return (
    <AuthCard
      title='Create Your Library Account'
      description='Please complete all fields and upload a valid university ID'
    >
      <Form {...form}>
        {/* Reduced space-y-6 to space-y-3 to save significant vertical room */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-3 md:space-y-4'
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
                      placeholder='Adrian Hajdin'
                      {...field}
                      className='form-input h-10' // Reduced height
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
                      placeholder='adrian@jsmastery.pro'
                      {...field}
                      className='form-input h-10' // Reduced height
                    />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='universityName'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='form-label text-sm'>
                  Select University
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingOptions || isSubmitting}
                >
                  <FormControl>
                    {/* Adjusted h-12 to h-10 and reduced padding/text size */}
                    <SelectTrigger className='h-10 w-full px-4 text-sm bg-[#232839] border-none rounded-[5px] text-white text-left [&>span]:line-clamp-1 [&>span]:truncate'>
                      <SelectValue
                        placeholder={
                          isLoadingOptions ? "Loading..." : "-- Select --"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.name}>
                        <span
                          className='block truncate leading-tight w-full max-w-60 text-sm'
                          title={uni.name}
                        >
                          {uni.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className='text-[10px]' />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-full'>
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
                      type='text'
                      placeholder='eg: 394365762'
                      {...field}
                      className='form-input h-10' // Reduced height
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
                  <FormLabel className='form-label text-sm'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='At least 8 chars'
                      {...field}
                      className='form-input h-10' // Reduced height
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
                  {/* Ensure this component is also optimized for height */}
                  <FileDropzone field={field} form={form} />
                </FormControl>
                <FormMessage className='text-[10px]' />
              </FormItem>
            )}
          />

          <div className='pt-2'>
            {" "}
            {/* Tiny top padding to separate from fields */}
            <AuthButton
              isSubmitting={isSubmitting}
              isLoadingOptions={isLoadingOptions}
            >
              Sign Up
            </AuthButton>
          </div>

          <p className='text-center text-xs md:text-sm text-slate-400 mt-2'>
            Have an account already?{" "}
            <a href='/login' className='text-[#E7C9A5] hover:underline'>
              Login
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegistrationForm;
