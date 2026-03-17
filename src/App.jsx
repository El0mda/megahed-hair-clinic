import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import BeforeAfterPage from '@/pages/BeforeAfterPage';
import AboutPage from '@/pages/AboutPage';
import AppointmentBookingPage from '@/pages/AppointmentBookingPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import BlogsPage from '@/pages/BlogsPage';
import ArticlesPage from '@/pages/ArticlesPage';
import VideosPage from '@/pages/VideosPage';
import BlogPostPage from '@/pages/BlogPostPage';
import { Toaster } from '@/components/ui/toaster';
import { LangSplash, useLang } from '@/components/Header';
import { motion } from 'framer-motion';


  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full bg-[#1e3a6e] border-b border-white/10 shadow-lg sticky top-16 z-[9000]"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="flex max-w-3xl mx-auto">
        {/* In-Clinic */}
        <button
          onClick={handleClinicWhatsApp}
          className="flex-1 py-3 px-3 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center hover:bg-white/10 transition-all border-r border-white/10 active:bg-white/20"
        >
          <span className="uppercase tracking-wide whitespace-nowrap">
            {isAr ? 'كشف بالعيادة' : 'In-Clinic Consultation'}
          </span>
        </button>

        {/* Online */}
        <button
          onClick={() => navigate('/book-appointment')}
          className="flex-1 py-3 px-3 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center hover:bg-white/10 transition-all active:bg-white/20"
        >
          <span className="uppercase tracking-wide whitespace-nowrap">
            {isAr ? 'استشارة عن بعد' : 'Online Consultation'}
          </span>
        </button>
      </div>
    </motion.div>
  );


// ─── WhatsApp Float ───────────────────────────────────────────────────────────
function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/201288979999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      style={{ backgroundColor: '#25D366' }}
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#25D366' }} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 relative z-10" fill="white">
        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.04 7.8L.5 31.5l7.93-2.07A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.3a13.22 13.22 0 0 1-6.74-1.84l-.48-.29-4.71 1.23 1.26-4.58-.31-.5A13.26 13.26 0 1 1 16 28.8zm7.27-9.93c-.4-.2-2.35-1.16-2.72-1.29-.36-.13-.63-.2-.89.2s-1.02 1.29-1.25 1.56c-.23.26-.46.3-.86.1a10.84 10.84 0 0 1-3.19-1.97 11.96 11.96 0 0 1-2.21-2.75c-.23-.4-.02-.61.17-.81.18-.18.4-.46.6-.69.2-.23.26-.4.4-.66.13-.26.07-.5-.03-.69-.1-.2-.89-2.15-1.22-2.94-.32-.77-.65-.67-.89-.68h-.76c-.26 0-.69.1-1.05.5s-1.38 1.35-1.38 3.3 1.41 3.83 1.61 4.09c.2.27 2.78 4.24 6.73 5.95.94.4 1.67.65 2.24.83.94.3 1.8.26 2.47.16.75-.11 2.35-.96 2.68-1.89.33-.92.33-1.71.23-1.88-.1-.17-.36-.27-.76-.47z" />
      </svg>
    </motion.a>
  );
}

// ─── App Content ──────────────────────────────────────────────────────────────
function AppContent() {
  const { hasChosen } = useLang();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');
  const showOverlays = hasChosen && !isAdminPath;

  return (
    <>
      {!hasChosen && <LangSplash />}
      <ScrollToTop />


      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="before-after" element={<BeforeAfterPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="book-appointment" element={<AppointmentBookingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/articles" element={<ArticlesPage />} />
          <Route path="blogs/videos" element={<VideosPage />} />
          <Route path="blogs/:id" element={<BlogPostPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <Toaster />

      {showOverlays && <WhatsAppFloat />}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;