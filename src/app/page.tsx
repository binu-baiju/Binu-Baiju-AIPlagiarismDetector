import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI-Powered Plagiarism Detection
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Ensure academic integrity with our advanced AI technology.
                  Upload your document and get precise results in seconds.
                </p>
              </div>
              <div className="space-x-4">
                <Link href={`/user-screen`}>
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700">
                    Check For Plaigarism
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section
          id="key-features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-emerald-500/10 p-3 mb-4">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-gray-400 mt-2">
                  Get results in seconds, not minutes
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-emerald-500/10 p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Highly Accurate</h3>
                <p className="text-gray-400 mt-2">
                  Powered by advanced AI for precise detection
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-emerald-500/10 p-3 mb-4">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Detailed Reports</h3>
                <p className="text-gray-400 mt-2">
                  Comprehensive analysis of your document
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2023 PlagiarismAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
