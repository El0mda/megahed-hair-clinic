import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/Header';
import { Link } from 'react-router-dom';

function BeforeAfterPage() {
  const { isAr } = useLang();
  const dir = isAr ? 'rtl' : 'ltr';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    { id: 'all', labelEn: 'All Results', labelAr: 'جميع النتائج' },
    { id: 'transplant', labelEn: 'Hair Transplant', labelAr: 'زراعة الشعر' },
    { id: 'treatment', labelEn: 'Hair Loss Treatment', labelAr: 'علاج تساقط الشعر' },
  ];

  const gallery = [
    {
      id: 1,
      before: 'https://images.unsplash.com/photo-1701885183616-cf00e2db1a3b',
      after: 'https://images.unsplash.com/photo-1701885183616-cf00e2db1a3b',
      category: 'transplant',
      titleEn: 'FUE Hair Transplant - 3500 Grafts',
      titleAr: 'زراعة شعر FUE - 3500 طعم',
      descEn: '12 months post-procedure result showing natural hairline restoration',
      descAr: 'نتيجة بعد 12 شهرًا تُظهر استعادة خط الشعر الطبيعي',
    },
    {
      id: 2,
      before: 'https://images.unsplash.com/photo-1701885881102-de58a9e6e0a6',
      after: 'https://images.unsplash.com/photo-1701885881102-de58a9e6e0a6',
      category: 'transplant',
      titleEn: 'FUT Hair Transplant - 4000 Grafts',
      titleAr: 'زراعة شعر FUT - 4000 طعم',
      descEn: '15 months post-procedure with excellent density improvement',
      descAr: 'نتيجة بعد 15 شهرًا مع تحسن ملحوظ في الكثافة',
    },
    {
      id: 3,
      before: 'https://images.unsplash.com/photo-1645235997928-0d70f3233154',
      after: 'https://images.unsplash.com/photo-1645235997928-0d70f3233154',
      category: 'treatment',
      titleEn: 'PRP Therapy Treatment',
      titleAr: 'علاج بالبلازما (PRP)',
      descEn: '6 months of PRP treatment showing increased hair thickness',
      descAr: '6 أشهر من علاج PRP مع زيادة ملحوظة في سماكة الشعر',
    },
    {
      id: 4,
      before: 'https://images.unsplash.com/photo-1520345376710-1662a32db252',
      after: 'https://images.unsplash.com/photo-1520345376710-1662a32db252',
      category: 'transplant',
      titleEn: 'Crown Restoration - 2800 Grafts',
      titleAr: 'استعادة تاج الرأس - 2800 طعم',
      descEn: '10 months post-FUE procedure with natural crown coverage',
      descAr: 'نتيجة بعد 10 أشهر من FUE مع تغطية طبيعية للقمة',
    },
  ];

  const filteredGallery = selectedCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  const openLightbox = (item, index) => {
    setLightboxImage(item);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxImage(null);

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredGallery.length
      : (lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredGallery[newIndex]);
  };

  return (
    <>
      <Helmet>
        <title>{isAr ? 'قبل وبعد — د. أحمد مجاهد' : 'Before & After Gallery - Dr. Ahmed Megahed'}</title>
        <meta name="description" content="View real patient results from Dr. Ahmed Megahed's hair transplant and hair loss treatment procedures." />
      </Helmet>

      {/* Hero — exact header navy */}
      <section
        className="text-white py-16"
        style={{ background: 'linear-gradient(135deg, #162d57 0%, #1e3a6e 50%, #253f7a 100%)' }}
        dir={dir}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              {isAr ? 'معرض قبل وبعد' : 'Before & After Gallery'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'نتائج حقيقية لمرضى حقيقيين — شاهد التحول الذي أحدثناه'
                : 'Real results from real patients — see the transformation achieved through expert hair restoration'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section
        className="py-5 sticky top-16 z-40"
        style={{ background: 'white', borderBottom: '1px solid #d0ddf0' }}
        dir={dir}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter className="w-4 h-4" style={{ color: '#7a96c2' }} />
            <span className="text-sm font-medium" style={{ color: '#5a7099' }}>
              {isAr ? 'تصفية:' : 'Filter by:'}
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200"
                  style={{
                    borderColor: active ? '#1e3a6e' : '#d0ddf0',
                    background: active ? '#1e3a6e' : 'white',
                    color: active ? 'white' : '#5a7099',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#7a96c2'; e.currentTarget.style.color = '#1e3a6e'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#d0ddf0'; e.currentTarget.style.color = '#5a7099'; } }}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16" style={{ background: '#f0f4fa' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="wait">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
                  style={{ background: 'white', border: '1px solid #d0ddf0' }}
                  onClick={() => openLightbox(item, index)}
                >
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={item.before} alt={`Before ${item.titleEn}`} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-sm px-3 py-1.5 rounded-lg" style={{ background: '#c0392b' }}>
                          {isAr ? 'قبل' : 'BEFORE'}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <img src={item.after} alt={`After ${item.titleEn}`} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-sm px-3 py-1.5 rounded-lg" style={{ background: '#1e3a6e' }}>
                          {isAr ? 'بعد' : 'AFTER'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1e3a6e' }}>
                      {isAr ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-sm" style={{ color: '#5a7099' }}>
                      {isAr ? item.descAr : item.descEn}
                    </p>
                    <div className="mt-4">
                      <span
                        className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: '#e8eef8', color: '#1e3a6e' }}
                      >
                        {isAr
                          ? categories.find(c => c.id === item.category)?.labelAr
                          : categories.find(c => c.id === item.category)?.labelEn}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: '#7a96c2' }}>
                {isAr ? 'لا توجد نتائج لهذه الفئة.' : 'No results found for this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50">
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-6xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-white text-center py-2 mb-2 rounded-lg font-bold" style={{ background: '#c0392b' }}>
                    {isAr ? 'قبل' : 'BEFORE'}
                  </div>
                  <img src={lightboxImage.before} alt="Before" className="w-full h-auto rounded-lg" />
                </div>
                <div>
                  <div className="text-white text-center py-2 mb-2 rounded-lg font-bold" style={{ background: '#1e3a6e' }}>
                    {isAr ? 'بعد' : 'AFTER'}
                  </div>
                  <img src={lightboxImage.after} alt="After" className="w-full h-auto rounded-lg" />
                </div>
              </div>
              <div className="rounded-lg p-6" style={{ background: 'white' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1e3a6e' }}>
                  {isAr ? lightboxImage.titleAr : lightboxImage.titleEn}
                </h3>
                <p style={{ color: '#5a7099' }}>
                  {isAr ? lightboxImage.descAr : lightboxImage.descEn}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA — exact header navy */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {isAr ? 'هل أنت مستعد لتحولك الخاص؟' : 'Ready for Your Own Transformation?'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'انضم إلى آلاف المرضى الراضين الذين استعادوا ثقتهم مع د. أحمد مجاهد'
                : 'Join thousands of satisfied patients who have restored their confidence with Dr. Ahmed Megahed'}
            </p>
            <Link to="/book-appointment">
              <button
                className="px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-colors"
                style={{ background: 'white', color: '#1e3a6e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {isAr ? 'احجز استشارتك' : 'Schedule Your Consultation'}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default BeforeAfterPage;