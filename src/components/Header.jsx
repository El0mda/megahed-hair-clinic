import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
// ─────────────────────────────────────────────────────────────────────────────

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
// ─────────────────────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: ['Home', 'Services', 'Before/After', 'About', 'Hair Transplant'],
    book: 'Book Appointment',
  },
  ar: {
    nav: ['الرئيسية', 'الخدمات', 'قبل وبعد', 'عن الدكتور', 'زراعة الشعر'],
    book: 'احجز موعد',
  },
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, isAr } = useLang();
  const location = useLocation();
  const t = translations[lang];

  const navPaths = ['/', '/services', '/before-after', '/about', '/contact'];
  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="bg-[#1e3a6e] border-b border-[#162d57] sticky top-0 z-50 shadow-md"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <Link to="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png"
              alt="Dr. Megahed Hair Clinic"
              className="h-[120px] object-contain mix-blend-screen"
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {t.nav.map((label, i) => (
              <Link
                key={navPaths[i]}
                to={navPaths[i]}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(navPaths[i])
                    ? 'text-white bg-white/20'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link to="/book-appointment">
              <Button className="ml-2 rtl:mr-2 rtl:ml-0 bg-white text-[#1e3a6e] hover:bg-blue-50 font-semibold">
                <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t.book}
              </Button>
            </Link>
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {t.nav.map((label, i) => (
                <Link
                  key={navPaths[i]}
                  to={navPaths[i]}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(navPaths[i])
                      ? 'text-white bg-white/20'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link to="/book-appointment" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-white text-[#1e3a6e] hover:bg-blue-50 font-semibold">
                  <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t.book}
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;