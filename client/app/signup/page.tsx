"use client"

import React from "react"
import { AuthProvider } from '@/components/providers/auth-provider';
import Link from "next/link"
export const dynamic = 'force-dynamic';

const Signup = () => {
  return (
    <section className="app-background">
      <article className="p-10 bg-white rounded-md shadow-sm">
        <h2 className="text-4xl text-black font-bold">
          Create a Patient Account
        </h2>
        <h4 className="text-black my-5">
          Connect your account to Sign Up to MaishaCare
        </h4>

        <div className="flex flex-col justify-start mb-5">
          <p className="text-[#909090] p-1 text-sm font-semibold">
            <Link href="/signup/doctor" className="hover:text-black">
              Create a Doctor's Account?
            </Link>
          </p>
        </div>

        <AuthProvider />
      </article>
    </section>
  )
}

export default Signup