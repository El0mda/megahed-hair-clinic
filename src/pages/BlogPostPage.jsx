import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/components/Header';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const { isAr } = useLang();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  // ✅ Must be before any early returns
  useEffect(() => {
    if (!post) return;

    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) return;

      const articleUrl = `https://megahedhairclinic.netlify.app/blogs/${post.id}`;
      const suffix = isAr
        ? `\n\nاقرأ المزيد على: ${articleUrl}`
        : `\n\nSee more at: ${articleUrl}`;

      const copied = selection.toString() + suffix;
      e.clipboardData.setData('text/plain', copied);
      e.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [post, isAr]);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4fa' }}><p className="text-gray-400">Loading...</p></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4fa' }}><p className="text-gray-400">Post not found</p></div>;

  return (
    <div style={{ background: '#f0f4fa' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero */}
      {post.cover_image && (
        <div className="w-full h-72 overflow-hidden">
          <img src={post.cover_image} alt={post.title_en} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8"
          style={{ color: '#1e3a6e' }}
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isAr ? 'العودة للمدونة' : 'Back to Blog'}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Type badge */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-4"
            style={{
              background: post.type === 'video' ? '#fef3c7' : '#e8eef8',
              color: post.type === 'video' ? '#92400e' : '#1e3a6e',
            }}
          >
            {post.type === 'video' ? (isAr ? 'فيديو' : 'Video') : (isAr ? 'مقال' : 'Article')}
          </span>

          <h1 className="text-3xl font-bold mb-4" style={{ color: '#1e3a6e' }}>
            {isAr ? post.title_ar : post.title_en}
          </h1>

          {/* Date only above article */}
          <div className="flex items-center gap-1 mb-8" style={{ color: '#a0b4cc' }}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date(post.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB')}
            </span>
          </div>

          {/* Video */}
          {post.type === 'video' && post.video_url && (
            <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
              <video
                src={post.video_url}
                className="w-full h-full"
                controls
              />
            </div>
          )}

          {/* Article content */}
          {post.type === 'article' && (
            <div
              className="bg-white rounded-2xl p-8 text-base leading-relaxed"
              style={{ border: '1px solid #d0ddf0', color: '#374151', whiteSpace: 'pre-wrap' }}
            >
              {isAr ? post.content_ar : post.content_en}
            </div>
          )}

          {/* Author + Reading time — below article */}
          <div
            className="mt-4 bg-white rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4"
            style={{ border: '1px solid #d0ddf0' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e8eef8' }}>
                <User className="w-4 h-4" style={{ color: '#1e3a6e' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#a0b4cc' }}>{isAr ? 'بقلم' : 'Written by'}</p>
                <p className="text-sm font-semibold" style={{ color: '#1e3a6e' }}>
                  {isAr ? 'د. أحمد مجاهد' : (post.author || 'Dr. Ahmed Megahed')}
                </p>
              </div>
            </div>
            {post.reading_time && (
              <>
                <div className="w-px h-8 hidden sm:block" style={{ background: '#d0ddf0' }} />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e8eef8' }}>
                    <Clock className="w-4 h-4" style={{ color: '#1e3a6e' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#a0b4cc' }}>{isAr ? 'وقت القراءة' : 'Reading time'}</p>
                    <p className="text-sm font-semibold" style={{ color: '#1e3a6e' }}>{post.reading_time}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #d0ddf0' }}>
            <h3 className="font-bold text-lg mb-2" style={{ color: '#1e3a6e' }}>
              {isAr ? 'هل تريد استشارة؟' : 'Want a consultation?'}
            </h3>
            <p className="text-sm mb-4" style={{ color: '#7a96c2' }}>
              {isAr ? 'احجز استشارتك مع د. أحمد مجاهد اليوم' : 'Book your consultation with Dr. Ahmed Megahed today'}
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#1e3a6e' }}
            >
              {isAr ? 'احجز الآن' : 'Book Now'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}