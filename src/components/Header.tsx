import React from 'react';

interface HeaderProps {
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOffline = false }) => {
  return (
    <header className="border-b border-[#F4EDE1]/15 bg-[#0B0F0E]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand & System Identity — small header (2026-11-12 first-screen simplification).
            The old 10-button navigation grid, GA Corridor badge, and shield/wipe button
            were removed from the header at Ivy's direction: navigation now lives on the
            first screen's plain-language task cards, and the privacy wipe lives in the
            "Saved on this device" panel, next to the local-storage disclosure. */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#2F4A3E] border border-[#C99A44]/40 flex items-center justify-center shrink-0 shadow-md overflow-hidden p-1.5">
            <img
              src="/icon.svg"
              alt="RealReentryRegister Logo"
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F4EDE1] font-serif leading-tight">
                RealReentryRegister (RRR)
              </h1>
              {isOffline && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2F4A3E]/80 text-[#C99A44] border border-[#C99A44]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99A44] animate-pulse mr-1"></span>
                  Offline Mode
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#F4EDE1]/70 font-sans tracking-wide italic">
              "Make the system visible. Make the path clearer."
            </p>
            <p className="text-[11px] sm:text-xs text-[#F4EDE1]/80 font-sans tracking-wide">
              Georgia reentry tools, all in one place.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
