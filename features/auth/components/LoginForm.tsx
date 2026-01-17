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
import AuthCard from "./AuthCard";
import AuthButton from "./AuthButton";
import useSignupForm from "../hooks/useSignupForm";
import useLoginForm from "../hooks/useLoginForm";

const LoginForm: React.FC = () => {
  const { form, isSubmitting, onSubmit } = useLoginForm();

  return (
    <AuthCard
      title='Create Your Library Account'
      description='Please complete all fields and upload a valid university ID'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='form-label'>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='name@mail.com'
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
                    placeholder='********'
                    {...field}
                    className='form-input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>

          <p className='text-center text-sm text-slate-400'>
            Don’t have an account already?{" "}
            <a href='/register' className='text-[#E7C9A5] hover:underline'>
              Register here
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
