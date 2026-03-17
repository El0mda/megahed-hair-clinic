import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ArrowRight, Clock, Heart, X, Stethoscope, Video, Building2, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/components/Header';

// ─── REVIEWS CAROUSEL ────────────────────────────────────────────────────────
function ReviewsSection({ isAr }) {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setReviews(data);
    });
  }, []);

  const count = reviews.length;

  useEffect(() => {
    if (count <= 1) return;
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % count);
      }, 4500);
    }
    return () => clearInterval(intervalRef.current);
  }, [count, isPaused]);

  const goTo = (i) => {
    setCurrent((i + count) % count);
    setIsPaused(true);
    clearInterval(intervalRef.current);
    setTimeout(() => setIsPaused(false), 8000);
  };

  if (count === 0) return null;

  const review = reviews[current];

  return (
    <section
      className="py-24 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(160deg, #0f2347 0%, #1e3a6e 55%, #162d57 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          top: '-120px', right: '-100px'
        }} />
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          bottom: '-80px', left: '-60px'
        }} />
        {/* subtle grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <Star size={13} style={{ fill: '#f59e0b', stroke: 'none' }} />
            <span className="text-xs font-bold tracking-widest uppercase text-white/60">
              {isAr ? 'آراء مرضانا' : "Patient Reviews"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isAr ? 'ماذا يقول مرضانا' : 'What Our Patients Say'}
          </h2>
        </div>

        {/* Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl p-8 sm:p-12"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.35)'
              }}
            >
              {/* Quote icon */}
              <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <Quote
                  size={44}
                  style={{
                    color: 'rgba(255,255,255,0.12)',
                    transform: isAr ? 'scaleX(-1)' : 'none',
                    flexShrink: 0
                  }}
                />
                {/* Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={18}
                      style={{
                        fill: s <= review.stars ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                        stroke: 'none',
                        transition: 'fill 0.3s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-white/85 text-lg sm:text-xl leading-relaxed mb-8 font-light"
                style={{ fontStyle: 'italic', letterSpacing: '0.01em' }}>
                "{review.review_text}"
              </p>

              {/* Patient name row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)' }}>
                  {review.patient_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{review.patient_name}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {isAr ? 'مريض دكتور مجاهد' : 'Dr. Megahed Patient'}
                  </p>
                </div>

              </div>

              {/* Full Google Review screenshot */}
              {review.image_url && (
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img
                    src={review.image_url}
                    alt="Google Review"
                    className="w-full h-auto object-contain"
                    style={{ display: 'block', maxHeight: '420px', objectFit: 'contain', background: 'rgba(255,255,255,0.03)' }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Prev */}
            <button
              onClick={() => goTo(current - 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {isAr ? <ChevronRight size={18} color="white" /> : <ChevronLeft size={18} color="white" />}
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all"
                  style={{
                    width: i === current ? 28 : 8,
                    height: 8,
                    borderRadius: 99,
                    background: i === current ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goTo(current + 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {isAr ? <ChevronLeft size={18} color="white" /> : <ChevronRight size={18} color="white" />}
            </button>
          </div>
        )}

        {/* Counter */}
        {count > 1 && (
          <p className="text-center text-white/25 text-xs mt-5 font-bold tracking-widest">
            {current + 1} / {count}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function HomePage() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClinicConsultation = () => {
    const phoneNumber = "201288979999";
    const message = encodeURIComponent(isAr
      ? "مرحباً دكتور أحمد، أود حجز استشارة في العيادة."
      : "Hello Dr. Ahmed, I would like to book a Clinic Consultation.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setIsModalOpen(false);
  };

  const credentials = [
    {
      icon: Users,
      titleEn: '10,000+ Satisfied Patients and Clients',
      titleAr: '+10,000 مريض وعميل راضٍ',
      descEn: 'Trusted by thousands for expert hair care and restoration',
      descAr: 'ثقة الآلاف في رعاية الشعر وعلاجه'
    },
    {
      icon: Heart,
      titleEn: '3,000+ Successful Hair Transplant Surgeries',
      titleAr: '+3,000 عملية زراعة شعر ناجحة',
      descEn: 'Advanced hair transplant procedures with natural results',
      descAr: 'عمليات زراعة شعر متقدمة بنتائج طبيعية'
    },
    {
      icon: Clock,
      titleEn: '10+ Years Experience',
      titleAr: '+10 سنوات خبرة',
      descEn: 'Experience in hair loss management and restoration',
      descAr: 'في إدارة تساقط الشعر وزراعته'
    }
  ];

  const services = [
    {
      titleEn: 'Comprehensive hair assessment',
      titleAr: 'الاستشارة',
      descEn: 'Personalized assessment and treatment planning for your specific needs.',
      descAr: 'تقييم شخصي ووضع خطة علاجية مناسبة لحالتك.',
      image: 'https://cdn.sanity.io/images/0vv8moc6/dermatologytimes/1ca878c5ecdb8b7791a50524205b27d0f6ad1718-4286x2857.jpg',
      link: '#',
      isModalTrigger: true
    },
    {
      titleEn: 'Hair Loss Treatment',
      titleAr: 'علاج تساقط الشعر',
      descEn: 'Comprehensive diagnosis and treatment plans for all types of hair loss conditions.',
      descAr: 'تشخيص شامل وخطط علاجية لجميع أنواع تساقط الشعر.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSslc08kzVICRpcOcBmPr1JoOQr7D2WEHQ_sg&s',
      link: '/services'
    },
    {
      titleEn: 'Hair Transplant',
      titleAr: 'زراعة الشعر',
      descEn: 'Advanced FUE technique for natural-looking, permanent hair restoration.',
      descAr: 'تقنية FUE المتقدمة لنتائج طبيعية ودائمة.',
      image: 'https://media.istockphoto.com/id/1265650028/photo/hair-transplant.jpg?s=612x612&w=0&k=20&c=XVJRcIwrSx1x-RgbVPMw0lLcWwhgFnWslLllKN30cdE=',
      link: '/services'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{isAr ? 'د. أحمد مجاهد - أخصائي زراعة الشعر' : 'Dr. Megahed Hair Clinic - Hair Loss Solutions & Hair Transplant Specialist'}</title>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #162d57 0%, #1e3a6e 50%, #253f7a 100%)' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {isAr ? 'عيادة الدكتور مجاهد' : 'Dr. Megahed Hair Clinic'}
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#a8c4e8' }}>
                {isAr ? 'أول عيادة في مصر متخصصة في علاج جميع أنواع تساقط الشعر وزراعة الشعر بأحدث التقنيات.' : "Egypt's first specialized hair clinic."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-appointment">
                  <Button size="lg" className="font-semibold shadow-xl" style={{ background: 'white', color: '#1e3a6e' }}>
                    {isAr ? 'احجز استشارتك عن بعد (Online)' : 'Book Online Consultation'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="font-semibold shadow-xl border-2" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                    {isAr ? 'احجز استشارتك لزراعة الشعر' : 'Hair Transplant Consultation'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16" style={{ background: '#f0f4fa' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((item, index) => (
              <motion.div key={index} className="rounded-xl p-6 shadow-lg bg-white" style={{ borderTop: '3px solid #1e3a6e' }}>
                <item.icon className="w-10 h-10 mb-4" style={{ color: '#1e3a6e' }} />
                <h3 className="text-lg font-bold" style={{ color: '#1e3a6e' }}>{isAr ? item.titleAr : item.titleEn}</h3>
                <p className="text-sm opacity-80">{isAr ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img src={service.image} className="h-48 w-full object-cover" alt="" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a6e' }}>{isAr ? service.titleAr : service.titleEn}</h3>
                  {service.isModalTrigger ? (
                    <Button onClick={() => setIsModalOpen(true)} variant="outline" className="w-full" style={{ borderColor: '#1e3a6e', color: '#1e3a6e' }}>
                      {isAr ? 'احجز الآن' : 'Book Now'}
                    </Button>
                  ) : (
                    <Link to={service.link}>
                      <Button variant="outline" className="w-full" style={{ borderColor: '#1e3a6e', color: '#1e3a6e' }}>
                        {isAr ? 'اعرف أكثر' : 'Learn More'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      <ReviewsSection isAr={isAr} />

      {/* CTA */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">{isAr ? 'هل أنت مستعد؟' : 'Ready to Start?'}</h2>
          <Button size="lg" onClick={() => setIsModalOpen(true)} style={{ background: 'white', color: '#1e3a6e' }}>
            {isAr ? 'احجز استشارتك الآن' : 'Book Your Appointment Now'}
            <Calendar className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-[101]" dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{isAr ? 'نوع الاستشارة' : 'Consultation Type'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => { navigate('/book-appointment'); setIsModalOpen(false); }} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <Stethoscope className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{isAr ? 'استشارة زراعة الشعر' : 'Hair Transplant Consultation'}</div>
                </button>
                <button onClick={() => { navigate('/book-appointment'); setIsModalOpen(false); }} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <Video className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{isAr ? 'استشارة أونلاين' : 'Online Consultation'}</div>
                </button>
                <button onClick={handleClinicConsultation} className="w-full flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left">
                  <Building2 className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-green-600`} />
                  <div className="font-bold text-green-700">{isAr ? 'تواصل معنا' : 'Contact Us'}</div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HomePage;