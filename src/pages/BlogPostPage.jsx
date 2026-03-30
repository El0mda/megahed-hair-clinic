import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User, Clock, X, Stethoscope, Video as VideoIcon, MessageSquare, Play } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const { isAr } = useLang();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "201288979999";
    const message = encodeURIComponent(isAr 
      ? `مرحباً دكتور أحمد، أود الاستفسار بخصوص: ${post?.title_ar}` 
      : `Hello Dr. Ahmed, I have an inquiry regarding: ${post?.title_en}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0f4fa]"><p>Loading...</p></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#f0f4fa]"><p>Post not found</p></div>;

  return (
    <div style={{ background: '#f0f4fa' }} dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen">
      
      {/* ─── MEDIA HEADER ─── */}
      <div className="w-full h-[450px] bg-[#1e3a6e] relative overflow-hidden">
        {post.type === 'video' && post.video_url ? (
          /* VIDEO PLAYER MODE */
          <video 
            src={post.video_url} 
            controls 
            className="w-full h-full object-contain bg-black"
            poster={post.cover_image} // Uses cover image as thumbnail while loading
          />
        ) : (
          /* STANDARD IMAGE MODE */
          post.cover_image && (
            <img src={post.cover_image} alt="" className="w-full h-full object-cover opacity-90" />
          )
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-medium mb-8 text-[#1e3a6e]">
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isAr ? 'العودة للمدونة' : 'Back to Blog'}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Badge for Type */}
          <div className="mb-4">
            <span className="px-3 py-1 bg-[#1e3a6e] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
              {post.type === 'video' ? (isAr ? 'فيديو' : 'Video') : (isAr ? 'مقالة' : 'Article')}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-[#1e3a6e] leading-tight">
            {isAr ? post.title_ar : post.title_en}
          </h1>
          
          <div className="flex items-center gap-4 mb-8 text-[#a0b4cc]">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            {post.reading_time && (
               <div className="flex items-center gap-1">
                 <Clock className="w-4 h-4" />
                 <span className="text-sm">{post.reading_time}</span>
               </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-10 text-lg leading-relaxed shadow-sm border border-[#d0ddf0] whitespace-pre-wrap text-gray-700">
            {isAr ? post.content_ar : post.content_en}
          </div>

          {/* Book Now Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-12 py-5 bg-[#1e3a6e] text-white font-black rounded-2xl hover:bg-[#162d55] transition-all shadow-xl hover:-translate-y-1 text-lg"
            >
              {isAr ? 'احجز موعدك الآن' : 'Book Your Appointment'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── MODAL (Consultation Type) ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#1e3a6e]">
                  {isAr ? 'اختر نوع الاستشارة' : 'Consultation Type'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <Link to="/contact" className="w-full flex items-center gap-4 p-5 rounded-3xl border-2 border-[#3b82f6] bg-[#f8fbff] hover:shadow-lg transition-all">
                  <div className="text-[#3b82f6]"><Stethoscope className="w-8 h-8" /></div>
                  <span className="font-bold text-lg text-[#1e3a6e]">{isAr ? 'استشارة زراعة الشعر' : 'Hair Transplant'}</span>
                </Link>

                <Link to="/book-appointment" className="w-full flex items-center gap-4 p-5 rounded-3xl border border-gray-100 bg-white hover:border-[#3b82f6] hover:shadow-lg transition-all">
                  <div className="text-[#3b82f6]"><VideoIcon className="w-8 h-8" /></div>
                  <span className="font-bold text-lg text-[#1e3a6e]">{isAr ? 'استشارة أونلاين' : 'Online Consultation'}</span>
                </Link>

                <button onClick={handleWhatsAppRedirect} className="w-full flex items-center gap-4 p-5 rounded-3xl border border-gray-100 bg-white hover:border-green-500 hover:shadow-lg transition-all">
                  <div className="text-green-600"><MessageSquare className="w-8 h-8" /></div>
                  <span className="font-bold text-lg text-green-600">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}