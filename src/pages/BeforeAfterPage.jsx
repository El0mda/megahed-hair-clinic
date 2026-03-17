import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, ImageIcon, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import ImageComparison from '@/components/ImageComparison';

// ─── INTERNAL CAROUSEL COMPONENT ───
const ResultCarousel = ({ images, isAr }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2">
        <ImageIcon size={28} strokeWidth={1} />
        <p className="text-[9px] uppercase tracking-widest font-bold">No Images</p>
      </div>
    );
  }

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group overflow-hidden">
      {/* Angle label */}
      <AnimatePresence mode="wait">
        {(images[index]?.label_en || images[index]?.label_ar) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            key={`label-${index}`}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg"
          >
            {isAr ? images[index].label_ar : images[index].label_en}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={images[index]?.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ImageComparison
            before={images[index]?.before_image_url}
            after={images[index]?.after_image_url}
            isAr={isAr}
          />
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 z-20 pointer-events-none">
            <button
              onClick={(e) => { e.preventDefault(); prev(); }}
              className="p-1.5 rounded-full bg-white/90 shadow-lg text-[#1e3a6e] hover:bg-white transition-all pointer-events-auto active:scale-90"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next(); }}
              className="p-1.5 rounded-full bg-white/90 shadow-lg text-[#1e3a6e] hover:bg-white transition-all pointer-events-auto active:scale-90"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/20 p-1 rounded-full backdrop-blur-sm">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── MAIN PAGE COMPONENT ───
export default function BeforeAfterPage() {
  const { isAr } = useLang();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('before_after_cases')
          .select('*, case_images(*)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setGallery(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { id: 'all', en: 'All Results', ar: 'الكل' },
    { id: 'transplant', en: 'Hair Transplant', ar: 'زراعة الشعر' },
    { id: 'treatment', en: 'Hair Loss Treatment', ar: 'علاجات التساقط' },
  ];

  const filtered = selectedCategory === 'all'
    ? gallery
    : gallery.filter(i => i.category === selectedCategory);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
      <div className="w-8 h-8 border-4 border-[#1e3a6e] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#1e3a6e] font-bold animate-pulse">{isAr ? 'جاري تحميل النتائج...' : 'Loading Results...'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={isAr ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{isAr ? 'النتائج قبل وبعد | د. أحمد مجاهد' : 'Before & After Results | Dr. Ahmed Megahed'}</title>
      </Helmet>

      {/* Hero Header */}
      <section className="py-24 bg-[#1e3a6e] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <LayoutGrid className="w-full h-full" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            {isAr ? 'قصص نجاح مرضانا' : 'Our Patient Success Stories'}
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'نتائج حقيقية تعكس خبرتنا والدقة المتناهية في زراعة وعلاج الشعر بأحدث التقنيات العالمية'
              : 'Real results reflecting our expertise and precision in hair restoration using the latest global technologies.'}
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-[40] bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-[#1e3a6e] text-white shadow-lg shadow-[#1e3a6e]/20 scale-105'
                  : 'bg-white text-[#5a7099] hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {isAr ? cat.ar : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-8 md:py-12 max-w-7xl mx-auto px-3 md:px-6">
        {/* 2 cols on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md shadow-blue-900/5 border border-gray-100 flex flex-col"
              >
                {/* Carousel */}
                <div className="w-full">
                  <ResultCarousel images={item.case_images} isAr={isAr} />
                </div>

                {/* Info */}
                <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1 mb-1">
                      <h3 className="font-black text-[#1e3a6e] text-xs md:text-sm leading-tight line-clamp-1">
                        {isAr ? item.patient_name_ar : item.patient_name_en}
                      </h3>
                      <span className="text-[7px] md:text-[8px] bg-[#e8eef8] text-[#1e3a6e] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest flex-shrink-0">
                        {item.category}
                      </span>
                    </div>
                    {(item.description_en || item.description_ar) && (
                      <p className="text-[#5a7099] text-[10px] md:text-xs leading-relaxed line-clamp-2">
                        {isAr ? item.description_ar : item.description_en}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                      #{String(item.id).split('-')[0]}
                    </span>
                    <div className="h-1 w-6 bg-[#1e3a6e] rounded-full opacity-20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <ImageIcon size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1e3a6e] mb-1">{isAr ? 'لا توجد نتائج حالياً' : 'No results found'}</h3>
            <p className="text-gray-400 text-sm">{isAr ? 'يرجى اختيار تصنيف آخر' : 'Please try selecting a different category'}</p>
          </div>
        )}
      </section>
    </div>
  );
}