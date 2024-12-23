
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingDialog from "@/components/dialog/LoadingDialog";
import ErrorDialog from "@/components/dialog/ErrorDialog";

const SignupContent: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  // Set up an effect to handle redirects when authenticated
  React.useEffect(() => {
    if (authenticated) {
      setIsLoading(true);
      router.push("/patient");
    }
  }, [authenticated, router]);

  const handleLogin = () => {
    try {
      login({
        disableSignup: false, // Allow both login and signup
      });
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
    }
  };

  return (
    <section className="app-background">
      <LoadingDialog
        message="Confirming Credentials..."
        openLoading={isLoading}
        setOpenLoading={setIsLoading}
      />
      <ErrorDialog
        message="Failed to Login"
        openError={error}
        setOpenError={setError}
      />

      <article className="max-w-md mx-auto px-4 pt-20">
        <h2 className="text-4xl text-white font-bold mb-3">
          Sign in to MaishaCare
        </h2>
        <h4 className="text-white my-5">
          Choose your preferred login method
        </h4>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogin}
            disabled={disableLogin}
            className="bg-white p-3 rounded-full font-bold w-full 
                     cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                     hover:bg-gray-100 transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            aria-label="Sign in with Privy"
          >
            Sign In with Privy
          </button>

          <nav className="flex flex-col gap-2 mt-4">
            <Link 
              href="/signup" 
              className="text-[#909090] p-1 text-sm font-semibold hover:text-white transition-colors"
            >
              Create a Patient&apos;s Account?
            </Link>
            <Link 
              href="/signup/doctor" 
              className="text-[#909090] p-1 text-sm font-semibold hover:text-white transition-colors"
            >
              Create a Doctor&apos;s Account?
            </Link>
          </nav>
        </div>
      </article>
    </section>
  );
};

export default SignupContent;
