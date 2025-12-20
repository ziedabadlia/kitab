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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='form-label'>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Adrian Hajdin'
                      {...field}
                      className='form-input'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='form-label'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='adrian@jsmastery.pro'
                      {...field}
                      className='form-input'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='universityName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='form-label'>Select University</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingOptions || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className='h-12 w-full px-5 text-base bg-[#232839] border-none rounded-[5px] text-white text-left [&>span]:line-clamp-1 [&>span]:truncate'>
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
                          className='block truncate leading-tight w-full max-w-60'
                          title={uni.name}
                        >
                          {uni.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='universityID'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='form-label'>
                    University ID Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='eg: 394365762'
                      {...field}
                      className='form-input'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='form-label'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='At least 8 characters long'
                      {...field}
                      className='form-input'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='idCardUpload'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='form-label'>
                  Upload University ID Card
                </FormLabel>
                <FormControl>
                  <FileDropzone field={field} form={form} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AuthButton
            isSubmitting={isSubmitting}
            isLoadingOptions={isLoadingOptions}
          >
            Sign Up
          </AuthButton>

          <p className='text-center text-sm text-slate-400'>
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
