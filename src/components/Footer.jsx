import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLang } from '@/components/Header';

const branches = [
  {
    name: 'فرع مصر الجديدة',
    nameEn: 'Heliopolis Branch',
    service: 'كشف ومتابعة بعد العملية',
    serviceEn: 'Consultation & Post-Op Follow-up',
    address: '١٩٣ ش الحجاز - أعلى مطعم العائلات - الدور الأول',
    addressEn: '193 Al-Hijaz St, above Al-Aeila Restaurant, 1st Floor',
    phones: ['+201288979999'],
    whatsapp: ['+201288979999'],
  },
  {
    name: 'فرع مدينتي',
    nameEn: 'Madinaty Branch',
    service: 'كشف ومتابعة بعد العملية',
    serviceEn: 'Consultation & Post-Op Follow-up',
    address: 'مول All Seasons Park - الدور الثاني - عيادة S60',
    addressEn: 'All Seasons Park Mall, 2nd Floor, Clinic S60',
    phones: ['+201055339937'],
    whatsapp: ['+201055339937'],
  },
  {
    name: 'فرع المنصورة',
    nameEn: 'Mansoura Branch',
    service: 'كشف وعملية زراعة الشعر',
    serviceEn: 'Consultation & Hair Transplant Surgery',
    address: 'مركز DHC - حي الجامعة - امتداد شارع جيهان - أمام مطعم كنتاكي',
    addressEn: 'DHC Center, University District, Gehan St Extension, opp. KFC',
    phones: ['+201288979999', '+201055339937'],
    whatsapp: ['+201288979999', '+201055339937'],
  },
];

const refundPolicy = [
  {
    en: '48 hours or more before the appointment — full refund.',
    ar: 'قبل الموعد بـ 48 ساعة أو أكثر — استرداد كامل.',
  },
  {
    en: 'Within 24 hours of the appointment — 50% refund.',
    ar: 'خلال 24 ساعة قبل الموعد — استرداد 50٪.',
  },
  {
    en: 'Same day cancellation — non-refundable.',
    ar: 'إلغاء في يوم الموعد — لا يحق استرداد أي رسوم.',
  },
  {
    en: 'After the consultation is completed — non-refundable.',
    ar: 'بعد إتمام الاستشارة — رسوم غير قابلة للاسترداد.',
  },
];

function Footer() {
  const { isAr } = useLang();
  const [refundOpen, setRefundOpen] = React.useState(false);

  const getWhatsAppLink = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    const message = encodeURIComponent(
      isAr
        ? 'مرحباً دكتور أحمد، أود الاستفسار عن خدمات عيادة الشعر.'
        : 'Hello Dr. Ahmed, I would like to inquire about your hair clinic services.'
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <footer className="bg-gray-900 text-gray-300" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Clinic Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex items-center">
                <img
                  src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png"
                  alt="Dr. Megahed Hair Clinic"
                  className="h-20 object-contain mix-blend-screen"
                />
              </Link>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isAr
                ? 'أول عيادة متخصصة في مصر لعلاج تساقط الشعر وزراعة الشعر بالتقنيات الحديثة.'
                : "Egypt's first specialized hair clinic for medical and surgical hair loss management and advanced hair transplant."}
            </p>
          </div>

          {/* Quick Links + Refund Policy */}
          <div>
            <span className="text-white font-semibold text-sm mb-4 block">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </span>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'الخدمات' : 'Services'}
                </Link>
              </li>
              <li>
                <Link to="/before-after" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'قبل وبعد' : 'Before/After Gallery'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'عن الدكتور' : 'About Dr. Megahed'}
                </Link>
              </li>
              <li>
                <Link to="/blogs/articles" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'تثقيف المرضى — مقالات' : 'Patient Education — Articles'}
                </Link>
              </li>
              <li>
                <Link to="/blogs/videos" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'تثقيف المرضى — فيديوهات' : 'Patient Education — Videos'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">
                  {isAr ? 'احجز استشارة' : 'Book Consultation'}
                </Link>
              </li>
            </ul>

            {/* Refund Policy — directly under Quick Links */}
{/* Refund Policy — collapsible tab under Quick Links */}
{/* Refund Policy — button tab style */}
<div className="mt-8">
  <button
    onClick={() => setRefundOpen((prev) => !prev)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors duration-200 ${
      refundOpen
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-transparent border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
    }`}
  >
    <svg
      className="w-3.5 h-3.5 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    {isAr ? 'سياسة الاسترداد' : 'Refund Policy'}
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${refundOpen ? 'rotate-180' : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>

  {refundOpen && (
    <ul className="mt-3 space-y-2 pl-1">
      {refundPolicy.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
          {isAr ? item.ar : item.en}
        </li>
      ))}
    </ul>
  )}
</div>
          </div>

          {/* Branches */}
          <div className="lg:col-span-2">
            <span className="text-white font-semibold text-sm mb-4 block">
              {isAr ? 'فروعنا' : 'Our Branches'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {branches.map((b, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-2 flex flex-col h-full">
                  <p className="text-white font-semibold text-sm">{isAr ? b.name : b.nameEn}</p>
                  <p className="text-blue-400 text-[11px] leading-tight mb-1">{isAr ? b.service : b.serviceEn}</p>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">{isAr ? b.address : b.addressEn}</p>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start gap-2 mt-auto">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {b.phones.map((p, j) => (
                        <a
                          key={j}
                          href={getWhatsAppLink(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-gray-300 hover:text-blue-400 transition-colors"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>

                  {b.whatsapp.length > 0 && (
                    <div className="flex items-start gap-2 pt-1 border-t border-gray-700 mt-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ fill: '#25D366' }} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.04 7.8L.5 31.5l7.93-2.07A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.27 18.37c-.4-.2-2.35-1.16-2.72-1.29-.36-.13-.63-.2-.89.2s-1.02 1.29-1.25 1.56c-.23.26-.46.3-.86.1a10.84 10.84 0 0 1-3.19-1.97 11.96 11.96 0 0 1-2.21-2.75c-.23-.4-.02-.61.17-.81.18-.18.4-.46.6-.69.2-.23.26-.4.4-.66.13-.26.07-.5-.03-.69-.1-.2-.89-2.15-1.22-2.94-.32-.77-.65-.67-.89-.68h-.76c-.26 0-.69.1-1.05.5s-1.38 1.35-1.38 3.3 1.41 3.83 1.61 4.09c.2.27 2.78 4.24 6.73 5.95.94.4 1.67.65 2.24.83.94.3 1.8.26 2.47.16.75-.11 2.35-.96 2.68-1.89.33-.92.33-1.71.23-1.88-.1-.17-.36-.27-.76-.47z" />
                      </svg>
                      <div className="space-y-0.5">
                        {b.whatsapp.map((w, j) => (
                          <a
                            key={j}
                            href={getWhatsAppLink(w)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-gray-300 hover:text-green-400 transition-colors"
                          >
                            {w}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Dr. Megahed Hair Transplant Clinic.{' '}
            {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex space-x-3">
            <a href="https://www.facebook.com/DrAhmedMegahedHairClinic" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/drahmedmegahed_hairclinic/" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;