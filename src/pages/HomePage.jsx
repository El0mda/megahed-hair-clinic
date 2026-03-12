import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ArrowRight, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/Header';

function HomePage() {
  const { isAr } = useLang();

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
      titleEn: 'Consultation',
      titleAr: 'الاستشارة',
      descEn: 'Personalized assessment and treatment planning for your specific needs.',
      descAr: 'تقييم شخصي ووضع خطة علاجية مناسبة لحالتك.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
      link: '/book-appointment'
    },
    {
      titleEn: 'Hair Loss Treatment',
      titleAr: 'علاج تساقط الشعر',
      descEn: 'Comprehensive diagnosis and treatment plans for all types of hair loss conditions.',
      descAr: 'تشخيص شامل وخطط علاجية لجميع أنواع تساقط الشعر.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      link: '/services'
    },
    {
      titleEn: 'Hair Transplant',
      titleAr: 'زراعة الشعر',
      descEn: 'Advanced FUE and FUT techniques for natural-looking, permanent hair restoration.',
      descAr: 'تقنيات FUE و FUT المتقدمة لنتائج طبيعية ودائمة.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
      link: '/services'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{isAr ? 'د. أحمد مجاهد - أخصائي زراعة الشعر' : 'Dr. Megahed Hair Clinic - Hair Loss Solutions & Hair Transplant Specialist'}</title>
        <meta name="description" content={isAr ? 'أخصائي زراعة الشعر وعلاج التساقط في مصر. أكثر من 10 سنوات من الخبرة وأكثر من 3000 عملية ناجحة.' : 'Leading hair transplant specialist offering advanced hair loss treatments and FUE hair transplant procedures in Egypt.'} />
      </Helmet>

      {/* Hero Section — matches header #1e3a6e exactly */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #162d57 0%, #1e3a6e 50%, #253f7a 100%)' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81"
            alt="Clinic"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {isAr ? 'عيادة الدكتور مجاهد' : 'Dr. Megahed Hair Clinic'}
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#a8c4e8' }}>
                {isAr
                  ? 'أول عيادة في مصر متخصصة في علاج جميع أنواع تساقط الشعر وزراعة الشعر بأحدث التقنيات.'
                  : "Egypt's first specialized hair clinic for medical and surgical hair loss management and advanced hair transplant."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-appointment">
                  <Button size="lg" className="font-semibold shadow-xl" style={{ background: 'white', color: '#1e3a6e' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    {isAr ? 'احجز استشارتك' : 'Book Online Consultation'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="font-semibold shadow-xl border-2" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                  >
                    {isAr ? 'احجز استشارتك لزراعة الشعر' : 'Hair Transplant Consultation'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credentials Section — light navy-tinted background */}
      <section className="py-16" style={{ background: '#f0f4fa' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tagline */}
          <div className="mb-12">
            <p className="text-xl font-semibold leading-snug" style={{ color: '#1e3a6e' }}>
              {isAr
                ? 'رعاية متخصصة لتساقط الشعر وزراعة الشعر تحت إشراف د. أحمد مجاهد.'
                : 'Expert Hair Loss Management & Hair Transplant by Dr. Ahmed Megahed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: 'white', borderTop: '3px solid #1e3a6e' }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#e8eef8' }}>
                  <item.icon className="w-6 h-6" style={{ color: '#1e3a6e' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1e3a6e' }}>{isAr ? item.titleAr : item.titleEn}</h3>
                <p className="text-sm" style={{ color: '#5a7099' }}>{isAr ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview — pure white with navy accents */}
      <section className="py-16" style={{ background: 'white' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#1e3a6e' }}>
              {isAr ? 'خدماتنا' : 'Our Services'}
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5a7099' }}>
              {isAr ? 'حلول شاملة لترميم الشعر مصممة خصيصًا لاحتياجاتك' : 'Comprehensive hair restoration solutions tailored to your needs'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                style={{ background: 'white' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={isAr ? service.titleAr : service.titleEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,58,110,0.7), transparent)' }}></div>
                </div>
                <div className="p-6" style={{ borderTop: '2px solid #e8eef8' }}>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#1e3a6e' }}>{isAr ? service.titleAr : service.titleEn}</h3>
                  <p className="mb-4 text-sm" style={{ color: '#5a7099' }}>{isAr ? service.descAr : service.descEn}</p>
                  <Link to={service.link}>
                    <Button
                      variant="outline"
                      className="w-full font-semibold transition-colors"
                      style={{ borderColor: '#1e3a6e', color: '#1e3a6e' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1e3a6e'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1e3a6e'; }}
                    >
                      {isAr ? 'اعرف أكثر' : 'Learn More'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — same navy as header */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {isAr ? 'هل أنت مستعد لاستعادة ثقتك بنفسك؟' : 'Ready to Restore Your Confidence?'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'احجز استشارتك الشخصية اليوم.'
                : 'Schedule your personalized consultation today'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-appointment">
                <Button size="lg" className="font-semibold shadow-xl" style={{ background: 'white', color: '#1e3a6e' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  {isAr ? 'احجز استشارتك' : 'Book Online Consultation'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="font-semibold shadow-xl border-2" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                >
                  {isAr ? 'احجز استشارتك لزراعة الشعر' : 'Hair Transplant Consultation'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default HomePage;