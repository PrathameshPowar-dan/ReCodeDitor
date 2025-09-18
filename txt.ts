"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Footer from "@/components/providers/Footer";

export default function Home() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-lg md:text-2xl font-bold">ReCodeDitor</h1>
        <nav className="flex items-center gap-4 text-sm md:text-base">
          {isSignedIn ? (
            <>
              <Link
                href="/editor"
                className="hover:text-indigo-400 transition"
              >
                Editor
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-2 py-1.5 text-sm md:text-base rounded-lg bg-indigo-600 hover:bg-indigo-500 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-2 py-1.5 text-sm md:text-base rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </nav>


      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Build, Run & Share Code <br /> in the Cloud
        </motion.h2>
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          A powerful online code editor with real-time collaboration. Sign up and start coding in seconds.
        </motion.p>
        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isSignedIn ? (
            <Link
              href="/editor"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium"
            >
              Go to Editor
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium">
                  Get Started
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-medium">
                  Sign In
                </button>
              </SignInButton>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
