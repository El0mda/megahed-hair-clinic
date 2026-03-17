import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Menu, X, Phone, ChevronDown, Stethoscope, Video, Building2 } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'; // Added for modal animation

// ─── Shared lang store ────────────────────────────────────────────────────────
let _lang = (() => { try { return localStorage.getItem('lang') || 'en'; } catch { return 'en'; } })();
let _hasChosen = false;
const _listeners = new Set();

function _setLang(lang) {
  _lang = lang;
  _hasChosen = true;
  try { localStorage.setItem('lang', lang); } catch {}
  window.dispatchEvent(new Event('langchange'));
  _listeners.forEach(fn => fn({ lang, hasChosen: true }));
}

export function useLang() {
  const [state, setState] = useState({ lang: _lang, hasChosen: _hasChosen });
  useEffect(() => {
    _listeners.add(setState);
    return () => _listeners.delete(setState);
  }, []);
  return {
    lang: state.lang,
    isAr: state.lang === 'ar',
    hasChosen: state.hasChosen,
    setLang: _setLang,
    toggleLang: () => _setLang(state.lang === 'ar' ? 'en' : 'ar'),
  };
}

// ─── Language Selection Popup ─────────────────────────────────────────────────
export function LangSplash() {
  const { setLang } = useLang();
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e3a6e] rounded-2xl px-6 py-3">
            <img src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png" alt="Dr. Megahed Hair Clinic" className="h-[120px] object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dr. Megahed Hair Clinic</h1>
        <p className="text-xl text-gray-700 mt-1">د. أحمد مجاهد</p>
        <div className="h-px bg-gray-100 mb-8 mt-4" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
          Choose your language / اختر لغتك
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setLang('en')}
            className="w-full py-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-150 font-bold text-gray-800 text-lg flex items-center justify-center gap-4 shadow-sm hover:shadow-md"
          >
            <span className="text-3xl">🇬🇧</span>
            <span>English</span>
          </button>
          <button
            onClick={() => setLang('ar')}
            className="w-full py-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-150 font-bold text-gray-800 text-lg flex items-center justify-center gap-4 shadow-sm hover:shadow-md"
          >
            <span className="text-3xl">🇸🇦</span>
            <span>العربية</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const translations = {
  en: {
    nav: ['Home', 'Services', 'Before/After', 'About', 'Hair Transplant'],
    education: 'Patient Education',
    articles: 'Articles',
    videos: 'Videos',
    book: 'Book Appointment',
    modalTitle: 'Consultation Type',
    transplant: 'Hair Transplant Consultation',
    online: 'Online Consultation',
    clinic: 'Contact Us', // Changed from "Clinic Consultation (WhatsApp)" to "Contact Us"
  },
  ar: {
    nav: ['الرئيسية', 'الخدمات', 'قبل وبعد', 'عن الدكتور', 'زراعة الشعر'],
    education: 'تثقيف المرضى',
    articles: 'مقالات',
    videos: 'فيديوهات',
    book: 'احجز موعد',
    modalTitle: 'نوع الاستشارة',
    transplant: 'استشارة زراعة الشعر',
    online: 'استشارة أونلاين',
    clinic: 'تواصل معنا', // Changed from "استشارة بالعيادة (WhatsApp)" to "تواصل معنا"
  },
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [mobileEducationOpen, setMobileEducationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Global Modal state
  
  const { lang, isAr } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[lang];
  const dropdownRef = useRef(null);

  const navPaths = ['/', '/services', '/before-after', '/about', '/contact'];
  const isActive = (path) => location.pathname === path;

  // Handlers
  const handleClinicConsultation = () => {
    const phoneNumber = "201288979999";
    const message = encodeURIComponent(isAr 
      ? "مرحباً دكتور أحمد، أود حجز استشارة في العيادة." 
      : "Hello Dr. Ahmed, I would like to book a Clinic Consultation.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEducationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setEducationOpen(false);
    setMobileEducationOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-[#1e3a6e] border-b border-[#162d57] sticky top-0 z-50 shadow-md" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center">
              <img src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png" alt="Dr. Megahed Hair Clinic" className="h-[120px] object-contain mix-blend-screen" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
              {t.nav.map((label, i) => (
                <Link key={navPaths[i]} to={navPaths[i]} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(navPaths[i]) ? 'text-white bg-white/20' : 'text-blue-100 hover:text-white hover:bg-white/10'}`}>
                  {label}
                </Link>
              ))}

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setEducationOpen(!educationOpen)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${location.pathname.startsWith('/blogs') ? 'text-white bg-white/20' : 'text-blue-100 hover:text-white hover:bg-white/10'}`}>
                  {t.education}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${educationOpen ? 'rotate-180' : ''}`} />
                </button>
                {educationOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100" style={{ [isAr ? 'right' : 'left']: 0 }}>
                    <Link to="/blogs/articles" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#f0f4fa] hover:text-[#1e3a6e]">
                      <span>📄</span> {t.articles}
                    </Link>
                    <Link to="/blogs/videos" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#f0f4fa] hover:text-[#1e3a6e]">
                      <span>🎥</span> {t.videos}
                    </Link>
                  </div>
                )}
              </div>

              {/* Desktop Trigger */}
              <Button onClick={() => setIsModalOpen(true)} className="ml-2 rtl:mr-2 rtl:ml-0 bg-white text-[#1e3a6e] hover:bg-blue-50 font-semibold shadow-lg">
                <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t.book}
              </Button>
            </nav>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-white hover:bg-white/10">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-2">
                {t.nav.map((label, i) => (
                  <Link key={navPaths[i]} to={navPaths[i]} className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive(navPaths[i]) ? 'text-white bg-white/20' : 'text-blue-100'}`}>
                    {label}
                  </Link>
                ))}
                
                {/* Mobile Trigger */}
                <Button onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }} className="w-full bg-white text-[#1e3a6e] font-semibold">
                  <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t.book}
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* --- SHARED BOOKING MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1e3a6e]">{t.modalTitle}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => { navigate('/book-appointment'); setIsModalOpen(false); }} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left rtl:text-right">
                  <Stethoscope className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{t.transplant}</div>
                </button>
                <button onClick={() => { navigate('/book-appointment'); setIsModalOpen(false); }} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left rtl:text-right">
                  <Video className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{t.online}</div>
                </button>
                <button onClick={handleClinicConsultation} className="w-full flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left rtl:text-right">
                  <Building2 className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-green-600`} />
                  <div className="font-bold text-green-700">{t.clinic}</div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;