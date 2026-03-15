import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/components/Header';
import { motion } from 'framer-motion';
import { Video, FileText, Calendar } from 'lucide-react';

export default function BlogsPage() {
  const { isAr } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <>
      {/* Hero */}
      <section
        className="text-white py-16"
        style={{ background: 'linear-gradient(135deg, #162d57 0%, #1e3a6e 50%, #253f7a 100%)' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {isAr ? 'المدونة والفيديوهات' : 'Blog & Videos'}
            </h1>
            <p className="text-xl" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'آخر المقالات والفيديوهات من د. أحمد مجاهد'
                : 'Latest articles and videos from Dr. Ahmed Megahed'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" style={{ background: '#f0f4fa' }} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4">

          {/* Filter tabs */}
          <div className="flex gap-3 mb-10 justify-center">
            {[
              { value: 'all', en: 'All', ar: 'الكل' },
              { value: 'article', en: 'Articles', ar: 'مقالات' },
              { value: 'video', en: 'Videos', ar: 'فيديوهات' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className="px-5 py-2 rounded-xl border-2 text-sm font-semibold transition-all"
                style={{
                  borderColor: filter === tab.value ? '#1e3a6e' : '#d0ddf0',
                  background: filter === tab.value ? '#1e3a6e' : 'white',
                  color: filter === tab.value ? 'white' : '#3d5a8a',
                }}
              >
                {isAr ? tab.ar : tab.en}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-20">
              {isAr ? 'لا توجد منشورات بعد' : 'No posts yet'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/blogs/${post.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all" style={{ border: '1px solid #d0ddf0' }}>
                    {/* Cover */}
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title_en} className="w-full h-48 object-cover" />
                    ) : post.type === 'video' && post.video_url ? (
                      <div className="w-full h-48 flex items-center justify-center" style={{ background: '#1e3a6e' }}>
                        <Video className="w-12 h-12 text-white opacity-60" />
                      </div>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center" style={{ background: '#e8eef8' }}>
                        <FileText className="w-12 h-12" style={{ color: '#1e3a6e', opacity: 0.4 }} />
                      </div>
                    )}

                    <div className="p-5">
                      {/* Type badge */}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-3"
                        style={{
                          background: post.type === 'video' ? '#fef3c7' : '#e8eef8',
                          color: post.type === 'video' ? '#92400e' : '#1e3a6e',
                        }}
                      >
                        {post.type === 'video'
                          ? (isAr ? 'فيديو' : 'Video')
                          : (isAr ? 'مقال' : 'Article')}
                      </span>

                      <h2 className="font-bold text-base mb-2 line-clamp-2" style={{ color: '#1e3a6e' }}>
                        {isAr ? post.title_ar : post.title_en}
                      </h2>

                      {post.type === 'article' && (
                        <p className="text-sm line-clamp-3" style={{ color: '#7a96c2' }}>
                          {isAr ? post.content_ar : post.content_en}
                        </p>
                      )}

                      <div className="flex items-center gap-1 mt-4" style={{ color: '#a0b4cc' }}>
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(post.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}