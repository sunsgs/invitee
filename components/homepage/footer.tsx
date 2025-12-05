"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PromoFooterProps {
  className?: string;
}

export function PromoFooter({ className }: PromoFooterProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile: Bottom centered banner */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
          "animate-in slide-in-from-bottom duration-500",
          className
        )}
      >
        <div className="mx-4 mb-4">
          <div className="relative bg-gradient-to-r from-foreground to-foreground/90 rounded-2xl shadow-2xl border border-foreground/20 overflow-hidden">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent animate-shimmer" />

            <div className="relative px-4 py-3 flex items-center gap-3">
              {/* Icon */}
              <div className="logo rounded-full  flex items-center justify-center">
                SMOOU
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-background">
                  Create your own invite
                </p>
                <p className="text-xs text-background/70">
                  Beautiful invitations in minutes
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/"
                className="flex-shrink-0 px-4 py-2 bg-background text-foreground text-sm font-semibold rounded-xl hover:bg-background/90 transition-all active:scale-95"
              >
                Try free
              </Link>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-background/70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Right side floating card */}
      <div
        className={cn(
          "hidden lg:block fixed bottom-6 right-6 z-40",
          "animate-in slide-in-from-right duration-500",
          className
        )}
      >
        <div className="relative bg-gradient-to-br from-foreground to-foreground/90 rounded-2xl shadow-2xl border border-foreground/20 overflow-hidden max-w-sm">
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent animate-shimmer" />

          <div className="relative p-5">
            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-background/70" />
            </button>

            {/* Icon */}
            <div className="logo text-3xl flex  mb-2">
              SMOOU
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4 pr-6">
              <h3 className="text-lg font-bold text-background">
                Love this invite?
              </h3>
              <p className="text-sm text-background/70 leading-relaxed">
                Create your own beautiful invitations in minutes. No design
                skills needed.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-background text-foreground text-sm font-semibold rounded-xl hover:bg-background/90 transition-all text-center active:scale-[0.98]"
            >
              Get started for free
            </Link>

            {/* Small trust badge */}
            <p className="text-xs text-background/50 mt-3 text-center">
              Create memorable invites
            </p>
          </div>
        </div>
      </div>

      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
}

