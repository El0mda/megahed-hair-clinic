import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/components/Header';

function StickyActionBar() {
  const { isAr } = useLang();
  const navigate = useNavigate();

  const handleClinicWhatsApp = () => {
    const phoneNumber = "201288979999";
    const message = encodeURIComponent(isAr
      ? "مرحباً دكتور أحمد، أود حجز استشارة في العيادة."
      : "Hello Dr. Ahmed, I would like to book a Clinic Consultation.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    /* top-[64px] matches the standard Header height. 
       z-[50] ensures it stays above the main content but below modal overlays */
    <div
      className="w-full bg-[#1e3a6e] border-b border-white/10 shadow-lg fixed top-[64px] left-0 right-0 z-[50]"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="flex max-w-7xl mx-auto">
        <button
          onClick={handleClinicWhatsApp}
          className="flex-1 py-4 px-3 text-white font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-white/10 transition-all border-r border-white/10 active:bg-white/20 uppercase tracking-wider"
        >
          <span className="opacity-90">{isAr ? 'كشف بالعيادة' : 'In-Clinic Consultation'}</span>
        </button>
        <button
          onClick={() => navigate('/book-appointment')}
          className="flex-1 py-4 px-3 text-white font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-white/10 transition-all active:bg-white/20 uppercase tracking-wider"
        >
          <span className="opacity-90">{isAr ? 'استشارة عن بعد' : 'Online Consultation'}</span>
        </button>
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <StickyActionBar />
      {/* IMPORTANT: Increased pt-[120px] 
          (Header 64px + ActionBar ~56px = 120px)
          This prevents your page content from being hidden behind the bars.
      */}
      <main className="flex-grow pt-[120px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;