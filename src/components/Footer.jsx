import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

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
    phones: ['+20502399903'],
    whatsapp: ['+201025995096', '+201020008448'],
  },
];

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
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
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Dr. Ahmed Megahed</span>
                <span className="text-xs text-gray-400">Hair Transplant Specialist</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Egypt’s first specialized hair clinic for medical and surgical hair loss management and advanced hair transplant.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-white font-semibold text-sm mb-4 block">Quick Links</span>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-sm hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link to="/before-after" className="text-sm hover:text-blue-400 transition-colors">Before/After Gallery</Link></li>
              <li><Link to="/about" className="text-sm hover:text-blue-400 transition-colors">About Dr. Megahed</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Branches — col spans 2 on large screens */}
          <div className="lg:col-span-2">
            <span className="text-white font-semibold text-sm mb-4 block">Our Branches / فروعنا</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {branches.map((b, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-2">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  <p className="text-blue-400 text-xs">{b.service}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">{b.address}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {b.phones.map((p, j) => (
                        <a key={j} href={`tel:${p}`} className="block text-xs text-gray-300 hover:text-blue-400 transition-colors">{p}</a>
                      ))}
                    </div>
                  </div>
                  {b.whatsapp.length > 0 && (
                    <div className="flex items-start gap-2">
                      {/* WhatsApp icon */}
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ fill: '#25D366' }} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.04 7.8L.5 31.5l7.93-2.07A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.27 18.37c-.4-.2-2.35-1.16-2.72-1.29-.36-.13-.63-.2-.89.2s-1.02 1.29-1.25 1.56c-.23.26-.46.3-.86.1a10.84 10.84 0 0 1-3.19-1.97 11.96 11.96 0 0 1-2.21-2.75c-.23-.4-.02-.61.17-.81.18-.18.4-.46.6-.69.2-.23.26-.4.4-.66.13-.26.07-.5-.03-.69-.1-.2-.89-2.15-1.22-2.94-.32-.77-.65-.67-.89-.68h-.76c-.26 0-.69.1-1.05.5s-1.38 1.35-1.38 3.3 1.41 3.83 1.61 4.09c.2.27 2.78 4.24 6.73 5.95.94.4 1.67.65 2.24.83.94.3 1.8.26 2.47.16.75-.11 2.35-.96 2.68-1.89.33-.92.33-1.71.23-1.88-.1-.17-.36-.27-.76-.47z" />
                      </svg>
                      <div className="space-y-0.5">
                        {b.whatsapp.map((w, j) => (
                          <a key={j} href={`https://wa.me/${w.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-300 hover:text-green-400 transition-colors">{w}</a>
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
            © {new Date().getFullYear()} Dr. Megahed Hair Transplant Clinic. All rights reserved.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
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