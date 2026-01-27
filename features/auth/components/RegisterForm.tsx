"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import { register } from "../actions/register";
import { PasswordInput } from "./PasswordInput";

const RegistrationForm: React.FC = () => {
  const { universities, isLoadingOptions } = useFetchUniversities();
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
                      <SelectTrigger className='h-10 w-full px-4 text-sm bg-[#232839] border-none rounded-[5px] text-white'>
                        <SelectValue
                          placeholder={
                            isLoadingOptions
                              ? "Loading universities..."
                              : "-- Select --"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.name}>
                          <span className='text-sm'>{uni.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              className={`text-[#E7C9A5] font-semibold hover:underline ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
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
