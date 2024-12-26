"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import DateInput from "@/components/inputs/DateInput";
import Link from "next/link";
import { format } from "date-fns";
import { useAccount } from "wagmi";
import SignUpWrapper from "@/components/wrapper/signup-wrapper";
import { usePrivy } from '@privy-io/react-auth';
export const dynamic = 'force-dynamic';
const Signup = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const { login, ready, authenticated } = usePrivy();

  const SignupSchema = Yup.object({
    formData: Yup.object({
      name: Yup.string()
        .min(6, "Min of 6 Characters required")
        .required("Full Name is Required"),
      dateOfBirth: Yup.string().required("Date of Birth is Required"),
      nationalID: Yup.string()
        .max(20, "Must be 20 characters or less")
        .min(5, "Min of 5 Characters required")
        .required("National ID is Required"),
    }),
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  return (
    <section className="app-background">
      <article className="p-10 bg-white rounded-md shadow-sm">
        <h2 className="text-4xl text-black font-bold">
          Create a Doctor's Account
        </h2>
        <h4 className="text-black my-5">
          Enter your Details to Sign Up to MaishaCare
        </h4>

        <Formik
          initialValues={{
            formData: {
              name: "",
              dateOfBirth: "",
              nationalID: "",
            },
          }}
          validationSchema={SignupSchema}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <TextInput
                label="Doctor's Name"
                name="formData.name"
                type="text"
                placeholder="Enter your Name"
              />
              <TextInput
                label="National ID"
                name="formData.nationalID"
                type="text"
                placeholder="Enter your National ID"
              />
              <DateInput
                name="formData.dateOfBirth"
                label="Date of Birth"
                onChange={(date: Date | undefined) => {
                  setFieldValue("formData.dateOfBirth", formatDate(date));
                }}
              />

              <div className="flex flex-col justify-start mb-5">
                <p className="text-[#909090] p-1 text-sm font-semibold">
                  <Link href="/signup" className="hover:text-black">
                    Create a Patient's Account?
                  </Link>
                </p>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              {isConnected && address ? (
                <SignUpWrapper
                  address={address}
                  role="doctor"
                  formData={values.formData}
                />
              ) : (
                <p className="text-red-500 mt-2">Please connect your wallet to continue</p>
              )}

              <button
                onClick={() => login()}
                disabled={!ready || authenticated}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  ready && !authenticated
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                Sign Up with Google
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default Signup;