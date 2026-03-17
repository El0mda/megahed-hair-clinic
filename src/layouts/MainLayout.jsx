import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/components/Header';

function StickyActionBar() {
  const { isAr } = useLang();
  const navigate = useNavigate();

  // ... handleClinicWhatsApp function ...

  return (
    <div
      /* Changed 'fixed' to 'sticky' and removed top-[64px] */
      className="w-full bg-[#1e3a6e] border-b border-white/10 shadow-md sticky top-[64px] left-0 right-0 z-[40]"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="flex max-w-3xl mx-auto">
        <button
          onClick={handleClinicWhatsApp}
          className="flex-1 py-3 px-3 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center hover:bg-white/10 transition-all border-r border-white/10 active:bg-white/20 uppercase tracking-wide whitespace-nowrap"
        >
          {isAr ? 'كشف بالعيادة' : 'In-Clinic Consultation'}
        </button>
        <button
          onClick={() => navigate('/book-appointment')}
          className="flex-1 py-3 px-3 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center hover:bg-white/10 transition-all active:bg-white/20 uppercase tracking-wide whitespace-nowrap"
        >
          {isAr ? 'استشارة عن بعد' : 'Online Consultation'}
        </button>
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Ensure your Header component has a higher z-index (e.g., z-[50]) */}
      <Header />
      <StickyActionBar />
      {/* Removed the large pt-[44px] since sticky positioning handles the flow */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}