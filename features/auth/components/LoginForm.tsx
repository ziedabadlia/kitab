"use client";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthCard from "./AuthCard";
import AuthButton from "./AuthButton";
import useLoginForm from "../hooks/useLoginForm";
import { PasswordInput } from "./PasswordInput";

const LoginForm: React.FC = () => {
  const { form, isSubmitting, onSubmit } = useLoginForm();

  return (
    <AuthCard
      title='Welcome Back' // Updated
      description='Access our vast collection of digital resources' // Updated
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='form-label'>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='name@university.edu'
                    {...field}
                    className='form-input'
                    disabled={isSubmitting}
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
              <FormItem className='space-y-1'>
                <FormLabel className='form-label text-sm'>Password</FormLabel>
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

          <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>

          <p className='text-center text-sm text-slate-400'>
            New to BookWise?{" "}
            <Link
              href='/register'
              className='text-[#E7C9A5] font-semibold hover:underline'
            >
              Create an account
            </Link>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
