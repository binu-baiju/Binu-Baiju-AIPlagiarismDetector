"use client";
import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
      <Link className="flex items-center justify-center" href="/">
        <FileText className="h-6 w-6 text-emerald-400" />
        <span className="ml-2 text-lg font-bold">PlagiarismAI</span>
      </Link>
      {pathname === "/" && (
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            href="#"
            onClick={(e) => handleSmoothScroll(e, "key-features")}
          >
            Features
          </Link>

          <Link
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            href="#"
            onClick={(e) => handleSmoothScroll(e, "key-features")}
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            href="#"
            onClick={(e) => handleSmoothScroll(e, "key-features")}
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
