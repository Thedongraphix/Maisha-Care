// Login.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import Link from "next/link";
import { LoginFormFields } from "@/types/form-types";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";
import { Form, Formik } from "formik";
import TextInput from "@/components/inputs/TextInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import { AuthProvider } from '@/components/providers/auth-provider';

export const dynamic = 'force-dynamic';

const Login: React.FC = () => {
  const [openLoading, setOpenLoading] = useState(false);
  const [openLoggin, setOpenLoggin] = useState(false);
  const [openAccErr, setOpenAccErr] = useState(false);
  const api = useAxios();
  const router = useRouter();

  const initiateLoginUser = useMutation({
    mutationFn: (initiateLoginUserPost: LoginFormFields) => {
      return api.post(
        "auth/login",
        {
          email: initiateLoginUserPost.email,
          password: initiateLoginUserPost.password,
        },
        {
          method: "POST",
        }
      );
    },
    onSuccess: () => {
      setOpenLoading(false);
      setOpenLoggin(true);
      router.replace("/home");
    },
    onError: (error) => {
      console.error(error);
      setOpenLoading(false);
      setOpenAccErr(true);
    },
  });

  return (
    <section className="app-background">
      <LoadingDialog
        message="Confirming Credentials..."
        openLoading={openLoading}
        setOpenLoading={setOpenLoading}
      />
      <LoadingDialog
        message="Logging you in..."
        openLoading={openLoggin}
        setOpenLoading={setOpenLoggin}
      />
      <ErrorDialog
        message="Failed to Login"
        openError={openAccErr}
        setOpenError={setOpenAccErr}
      />
      <article>
        <h2 className="text-4xl text-white font-bold">Sign in to MaishaCare</h2>
        <h4 className="text-white my-5">Enter your Email to Login</h4>
        <AuthProvider />
      </article>
    </section>
  );
};

export default Login;

