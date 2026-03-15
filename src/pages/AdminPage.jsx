import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Eye, EyeOff, LogOut, Video, FileText, X, Check } from 'lucide-react';

const ADMIN_PASSWORD = 'megahed2024';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title_en: '', title_ar: '',
    content_en: '', content_ar: '',
    cover_image: '', type: 'article',
    video_url: '', published: false,
  });

  useEffect(() => {
    if (authed) fetchPosts();
  }, [authed]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin', 'true');
      setAuthed(true);
    } else {
      setError('Incorrect password');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('admin');
    setAuthed(false);
  };

  const resetForm = () => {
    setForm({ title_en: '', title_ar: '', content_en: '', content_ar: '', cover_image: '', type: 'article', video_url: '', published: false });
    setEditing(null);
    setView('list');
  };

  const openEdit = (post) => {
    setForm(post);
    setEditing(post.id);
    setView('form');
  };

  const handleSave = async () => {
    if (editing) {
      await supabase.from('blogs').update(form).eq('id', editing);
    } else {
      await supabase.from('blogs').insert(form);
    }
    fetchPosts();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blogs').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublish = async (post) => {
    await supabase.from('blogs').update({ published: !post.published }).eq('id', post.id);
    fetchPosts();
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4fa' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm"
          style={{ border: '1px solid #d0ddf0' }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-[#1e3a6e] rounded-2xl px-6 py-3">
              <img src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png" alt="Logo" className="h-12 object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-6" style={{ color: '#1e3a6e' }}>Admin Panel</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#1e3a6e]"
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={login}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: '#1e3a6e' }}
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Form screen ──
  if (view === 'form') {
    return (
      <div className="min-h-screen py-10 px-4" style={{ background: '#f0f4fa' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold" style={{ color: '#1e3a6e' }}>
              {editing ? 'Edit Post' : 'New Post'}
            </h1>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 space-y-5" style={{ border: '1px solid #d0ddf0' }}>
            {/* Type */}
            <div className="flex gap-3">
              {['article', 'video'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: form.type === t ? '#1e3a6e' : '#d0ddf0',
                    background: form.type === t ? '#1e3a6e' : 'white',
                    color: form.type === t ? 'white' : '#3d5a8a',
                  }}
                >
                  {t === 'article' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Titles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Title (English)</label>
                <input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e]" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Title (Arabic)</label>
                <input dir="rtl" value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e]" />
              </div>
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Cover Image URL</label>
              <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e]" />
              {form.cover_image && <img src={form.cover_image} alt="preview" className="mt-2 h-32 rounded-xl object-cover" />}
            </div>

            {/* Video URL */}
            {form.type === 'video' && (
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Video URL (YouTube embed)</label>
                <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/embed/..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e]" />
              </div>
            )}

            {/* Content */}
            {form.type === 'article' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Content (English)</label>
                  <textarea rows={8} value={form.content_en} onChange={e => setForm(f => ({ ...f, content_en: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#1e3a6e' }}>Content (Arabic)</label>
                  <textarea dir="rtl" rows={8} value={form.content_ar} onChange={e => setForm(f => ({ ...f, content_ar: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1e3a6e] resize-none" />
                </div>
              </div>
            )}

            {/* Published */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className="w-10 h-6 rounded-full transition-all relative"
                style={{ background: form.published ? '#1e3a6e' : '#d0ddf0' }}
              >
                <span
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                  style={{ left: form.published ? '20px' : '4px' }}
                />
              </button>
              <span className="text-sm font-medium" style={{ color: '#1e3a6e' }}>
                {form.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: '#1e3a6e' }}
            >
              <Check className="w-4 h-4" />
              {editing ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List screen ──
  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#f0f4fa' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e3a6e' }}>Admin Panel</h1>
            <p className="text-sm" style={{ color: '#7a96c2' }}>Manage blogs, articles and videos</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { resetForm(); setView('form'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: '#1e3a6e' }}
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2"
              style={{ borderColor: '#d0ddf0', color: '#1e3a6e' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl" style={{ border: '1px solid #d0ddf0' }}>
            <p className="text-gray-400 mb-4">No posts yet</p>
            <button
              onClick={() => setView('form')}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: '#1e3a6e' }}
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 flex items-center gap-4"
                style={{ border: '1px solid #d0ddf0' }}
              >
                {post.cover_image && (
                  <img src={post.cover_image} alt={post.title_en} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: post.type === 'video' ? '#fef3c7' : '#e8eef8', color: post.type === 'video' ? '#92400e' : '#1e3a6e' }}
                    >
                      {post.type}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: post.published ? '#dcfce7' : '#f3f4f6', color: post.published ? '#166534' : '#6b7280' }}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="font-semibold text-sm truncate" style={{ color: '#1e3a6e' }}>{post.title_en || 'Untitled'}</p>
                  <p className="text-xs truncate" style={{ color: '#7a96c2' }}>{post.title_ar}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(post)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                    {post.published ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}