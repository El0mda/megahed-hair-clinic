import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  Video,
  FileText,
  X,
  Check,
  ImageIcon,
  ImagePlus,
  LayoutGrid,
  Star,
  MessageSquare,
} from "lucide-react";

const ADMIN_PASSWORD = "megahed2024";

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin") === "true",
  );
  const [activeTab, setActiveTab] = useState("blogs");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Gallery State
  const [galleryPairs, setGalleryPairs] = useState([
    {
      id: Date.now(),
      before_file: null,
      after_file: null,
      label_en: "",
      label_ar: "",
      before_url: "",
      after_url: "",
    },
  ]);

  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    cover_image: "",
    type: "article",
    video_url: "",
    published: true,
    author: "Dr. Ahmed Megahed",
    reading_time: "",
    category: "transplant",
    desc_en: "",
    desc_ar: "",
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    patient_name: "",
    patient_name_en: "", // ← add this
    review_text: "",
    review_text_en: "",
    stars: 5,
    image_url: "",
  });

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let data, error;
      if (activeTab === "blogs") {
        ({ data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false }));
      } else if (activeTab === "gallery") {
        ({ data, error } = await supabase
          .from("before_after_cases")
          .select("*, case_images(*)")
          .order("created_at", { ascending: false }));
      } else if (activeTab === "reviews") {
        ({ data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false }));
      }
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin", "true");
      setAuthed(true);
    } else setError("Incorrect password");
  };

  const logout = () => {
    sessionStorage.removeItem("admin");
    setAuthed(false);
  };

  const resetForm = () => {
    setForm({
      title_en: "",
      title_ar: "",
      content_en: "",
      content_ar: "",
      cover_image: "",
      type: "article",
      video_url: "",
      published: true,
      author: "Dr. Ahmed Megahed",
      reading_time: "",
      category: "transplant",
      desc_en: "",
      desc_ar: "",
    });
    // inside resetForm()
    setReviewForm({
      patient_name: "",
      patient_name_en: "", // ← add this
      review_text: "",
      review_text_en: "",
      stars: 5,
      image_url: "",
    });
    setGalleryPairs([
      {
        id: Date.now(),
        before_file: null,
        after_file: null,
        label_en: "",
        label_ar: "",
        before_url: "",
        after_url: "",
      },
    ]);
    setEditing(null);
    setImageFile(null);
    setVideoFile(null);
    setReviewImageFile(null);
    setView("list");
  };

  const openEdit = (item) => {
    if (activeTab === "blogs") {
      setForm({ ...item });
    } else if (activeTab === "gallery") {
      setForm({
        title_en: item.patient_name_en || "",
        title_ar: item.patient_name_ar || "",
        desc_en: item.description_en || "",
        desc_ar: item.description_ar || "",
        category: item.category || "transplant",
      });
      setGalleryPairs(
        item.case_images?.map((img) => ({
          ...img,
          before_file: null,
          after_file: null,
          before_url: img.before_image_url,
          after_url: img.after_image_url,
        })) || [],
      );
    } else if (activeTab === "reviews") {
      setReviewForm({
        patient_name: item.patient_name || "",
        patient_name_en: item.patient_name_en || "", // ← add this
        review_text: item.review_text || "",
        review_text_en: item.review_text_en || "",
        stars: item.stars || 5,
        image_url: item.image_url || "",
      });
    }
    setEditing(item.id);
    setView("form");
  };

  const handleFileUpload = async (file, bucket) => {
    if (!file) return null;
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      if (activeTab === "blogs") {
        let payload = { ...form };
        if (imageFile)
          payload.cover_image = await handleFileUpload(
            imageFile,
            "blog-images",
          );
        if (videoFile)
          payload.video_url = await handleFileUpload(videoFile, "blog-videos");
        const { error } = editing
          ? await supabase.from("blogs").update(payload).eq("id", editing)
          : await supabase.from("blogs").insert([payload]);
        if (error) throw error;
      } else if (activeTab === "gallery") {
        const casePayload = {
          patient_name_en: form.title_en,
          patient_name_ar: form.title_ar,
          description_en: form.desc_en,
          description_ar: form.desc_ar,
          category: form.category,
        };
        let caseId = editing;
        if (editing) {
          await supabase
            .from("before_after_cases")
            .update(casePayload)
            .eq("id", editing);
          await supabase.from("case_images").delete().eq("case_id", editing);
        } else {
          const { data, error } = await supabase
            .from("before_after_cases")
            .insert([casePayload])
            .select();
          if (error) throw error;
          if (!data || data.length === 0)
            throw new Error("Failed to create case entry.");
          caseId = data[0].id;
        }
        for (const pair of galleryPairs) {
          let bUrl = pair.before_url;
          let aUrl = pair.after_url;
          if (pair.before_file)
            bUrl = await handleFileUpload(pair.before_file, "blog-images");
          if (pair.after_file)
            aUrl = await handleFileUpload(pair.after_file, "blog-images");
          if (bUrl && aUrl) {
            await supabase.from("case_images").insert([
              {
                case_id: caseId,
                before_image_url: bUrl,
                after_image_url: aUrl,
                label_en: pair.label_en,
                label_ar: pair.label_ar,
              },
            ]);
          }
        }
      } else if (activeTab === "reviews") {
        let payload = { ...reviewForm };
        if (reviewImageFile)
          payload.image_url = await handleFileUpload(
            reviewImageFile,
            "blog-images",
          );
        const { error } = editing
          ? await supabase.from("reviews").update(payload).eq("id", editing)
          : await supabase.from("reviews").insert([payload]);
        if (error) throw error;
      }

      fetchData();
      resetForm();
      alert("Saved Successfully!");
    } catch (err) {
      alert("Error saving: " + err.message);
      console.error(err);
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    const table =
      activeTab === "blogs"
        ? "blogs"
        : activeTab === "gallery"
          ? "before_after_cases"
          : "reviews";
    await supabase.from(table).delete().eq("id", id);
    fetchData();
  };

  const addPair = () =>
    setGalleryPairs([
      ...galleryPairs,
      {
        id: Date.now(),
        before_file: null,
        after_file: null,
        label_en: "",
        label_ar: "",
        before_url: "",
        after_url: "",
      },
    ]);
  const removePair = (id) =>
    setGalleryPairs(galleryPairs.filter((p) => p.id !== id));
  const updatePair = (id, field, value) =>
    setGalleryPairs(
      galleryPairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4fa]">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm border border-[#d0ddf0]">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1e3a6e] rounded-2xl px-6 py-3">
              <img
                src="https://res.cloudinary.com/dbxpapbtb/image/upload/v1773240719/Screenshot_from_2026-03-11_16-23-45-removebg-preview_1_mgwtpj.png"
                alt="Logo"
                className="h-10 object-contain"
              />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-6 text-[#1e3a6e]">
            Megahed Admin
          </h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm mb-4 outline-none focus:border-[#1e3a6e] transition-all"
          />
          {error && (
            <p className="text-red-400 text-xs mb-3 font-bold">{error}</p>
          )}
          <button
            onClick={login}
            className="w-full py-3 rounded-2xl text-white font-bold bg-[#1e3a6e] hover:bg-[#162d55] transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ─── FORM VIEW ────────────────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div className="min-h-screen py-10 px-4 bg-[#f0f4fa]">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1e3a6e]">
              {editing ? "Edit" : "New"}{" "}
              {activeTab === "blogs"
                ? "Blog"
                : activeTab === "gallery"
                  ? "Case"
                  : "Review"}
            </h1>
            <button
              onClick={resetForm}
              className="bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500"
            >
              <X />
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 space-y-8 border border-[#d0ddf0] shadow-sm">
            {/* ── REVIEWS FORM ── */}
            {activeTab === "reviews" ? (
              <div className="space-y-8">
                {/* Patient Name */}
                {/* Patient Name - Arabic & English */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Patient Name
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Arabic اسم المريض
                      </label>
                      <input
                        dir="rtl"
                        value={reviewForm.patient_name}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            patient_name: e.target.value,
                          })
                        }
                        placeholder="مثال: محمد علي"
                        className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e] transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        English
                      </label>
                      <input
                        value={reviewForm.patient_name_en}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            patient_name_en: e.target.value,
                          })
                        }
                        placeholder="e.g. Mohamed Ali"
                        className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Text - Arabic & English */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      Review Text (AR) النص بالعربي
                    </label>
                    <textarea
                      dir="rtl"
                      value={reviewForm.review_text}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          review_text: e.target.value,
                        })
                      }
                      placeholder="اكتب تقييم المريض هنا..."
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm outline-none h-36 resize-none focus:border-[#1e3a6e] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      Review Text (EN)
                    </label>
                    <textarea
                      value={reviewForm.review_text_en}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          review_text_en: e.target.value,
                        })
                      }
                      placeholder="Write the patient's review in English..."
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm outline-none h-36 resize-none focus:border-[#1e3a6e] transition-all"
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Star Rating
                  </label>
                  <div className="flex gap-3 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, stars: star })
                        }
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={32}
                          className="transition-colors"
                          style={{
                            fill: star <= reviewForm.stars ? "#f59e0b" : "none",
                            stroke:
                              star <= reviewForm.stars ? "#f59e0b" : "#d1d5db",
                          }}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-black text-[#1e3a6e]">
                      {reviewForm.stars} / 5
                    </span>
                  </div>
                </div>

                {/* Google Review Image (Optional) */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Google Review Screenshot{" "}
                    <span className="text-gray-300 font-normal normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="p-6 bg-[#f8faff] rounded-3xl border-2 border-dashed border-[#d0ddf0] space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReviewImageFile(e.target.files[0])}
                      className="text-xs w-full"
                    />
                    {/* Preview existing image if editing */}
                    {!reviewImageFile && reviewForm.image_url && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          Current Image
                        </p>
                        <img
                          src={reviewForm.image_url}
                          alt="Review"
                          className="h-28 rounded-2xl object-cover border border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, image_url: "" })
                          }
                          className="text-[10px] text-red-400 font-bold hover:text-red-600"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                    {reviewImageFile && (
                      <div className="flex items-center gap-2 text-xs text-[#1e3a6e] font-bold">
                        <Check size={14} className="text-green-500" />
                        {reviewImageFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === "blogs" ? (
              /* ── BLOGS FORM (unchanged) ── */
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Content Type
                  </label>
                  <div className="flex gap-3">
                    {[
                      {
                        id: "article",
                        label: "Article",
                        icon: <FileText size={16} />,
                      },
                      {
                        id: "video",
                        label: "Video",
                        icon: <Video size={16} />,
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, type: t.id })}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 text-sm font-bold transition-all"
                        style={{
                          borderColor:
                            form.type === t.id ? "#1e3a6e" : "#f0f4fa",
                          background: form.type === t.id ? "#1e3a6e" : "white",
                          color: form.type === t.id ? "white" : "#3d5a8a",
                        }}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      Title (EN)
                    </label>
                    <input
                      value={form.title_en}
                      onChange={(e) =>
                        setForm({ ...form, title_en: e.target.value })
                      }
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      العنوان (AR)
                    </label>
                    <input
                      dir="rtl"
                      value={form.title_ar}
                      onChange={(e) =>
                        setForm({ ...form, title_ar: e.target.value })
                      }
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="text-xs w-full"
                  />
                </div>
                {form.type === "video" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200"
                  >
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e] block mb-2">
                      Upload Video File
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="text-xs w-full"
                    />
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <textarea
                    placeholder="Content (EN)"
                    value={form.content_en}
                    onChange={(e) =>
                      setForm({ ...form, content_en: e.target.value })
                    }
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm outline-none h-40 resize-none"
                  />
                  <textarea
                    dir="rtl"
                    placeholder="المحتوى (AR)"
                    value={form.content_ar}
                    onChange={(e) =>
                      setForm({ ...form, content_ar: e.target.value })
                    }
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm outline-none h-40 resize-none"
                  />
                </div>
              </div>
            ) : (
              /* ── GALLERY FORM (unchanged) ── */
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                    Case Category
                  </label>
                  <div className="flex gap-3">
                    {[
                      {
                        id: "transplant",
                        label: "Hair Transplant",
                        icon: <ImageIcon size={16} />,
                      },
                      {
                        id: "treatment",
                        label: "Treatment",
                        icon: <ImagePlus size={16} />,
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, category: t.id })}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 text-sm font-bold transition-all"
                        style={{
                          borderColor:
                            form.category === t.id ? "#1e3a6e" : "#f0f4fa",
                          background:
                            form.category === t.id ? "#1e3a6e" : "white",
                          color: form.category === t.id ? "white" : "#3d5a8a",
                        }}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      Name (EN)
                    </label>
                    <input
                      value={form.title_en}
                      onChange={(e) =>
                        setForm({ ...form, title_en: e.target.value })
                      }
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
                      الاسم (AR)
                    </label>
                    <input
                      dir="rtl"
                      value={form.title_ar}
                      onChange={(e) =>
                        setForm({ ...form, title_ar: e.target.value })
                      }
                      className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <textarea
                    placeholder="Case Description (EN)"
                    value={form.desc_en}
                    onChange={(e) =>
                      setForm({ ...form, desc_en: e.target.value })
                    }
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none h-24 resize-none"
                  />
                  <textarea
                    dir="rtl"
                    placeholder="وصف الحالة (AR)"
                    value={form.desc_ar}
                    onChange={(e) =>
                      setForm({ ...form, desc_ar: e.target.value })
                    }
                    className="w-full border-2 border-gray-50 rounded-2xl px-5 py-3 text-sm outline-none h-24 resize-none"
                  />
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black text-[#1e3a6e] uppercase tracking-tighter">
                      Angles / Pairs
                    </h3>
                    <button
                      onClick={addPair}
                      className="flex items-center gap-2 bg-[#1e3a6e] text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      <Plus size={14} /> Add Angle
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {galleryPairs.map((pair) => (
                      <div
                        key={pair.id}
                        className="p-6 bg-[#fcfcfd] rounded-3xl border-2 border-dashed border-gray-100 relative"
                      >
                        <button
                          onClick={() => removePair(pair.id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                              Before
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                updatePair(
                                  pair.id,
                                  "before_file",
                                  e.target.files[0],
                                )
                              }
                              className="text-[10px] w-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                              After
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                updatePair(
                                  pair.id,
                                  "after_file",
                                  e.target.files[0],
                                )
                              }
                              className="text-[10px] w-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="Label EN"
                            value={pair.label_en}
                            onChange={(e) =>
                              updatePair(pair.id, "label_en", e.target.value)
                            }
                            className="text-xs border-b border-gray-200 bg-transparent py-2 outline-none"
                          />
                          <input
                            dir="rtl"
                            placeholder="العنوان AR"
                            value={pair.label_ar}
                            onChange={(e) =>
                              updatePair(pair.id, "label_ar", e.target.value)
                            }
                            className="text-xs border-b border-gray-200 bg-transparent py-2 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={uploading}
              className="w-full py-5 bg-[#1e3a6e] text-white rounded-[1.5rem] font-black text-lg shadow-xl disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {uploading ? "Uploading..." : "Publish Content"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-10 px-4 bg-[#f0f4fa]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1e3a6e] tracking-tighter">
              Megahed Admin
            </h1>
            <div className="flex gap-6 mt-4">
              {[
                { key: "blogs", label: "Articles" },
                { key: "gallery", label: "Before & After" },
                { key: "reviews", label: "Reviews" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`text-sm font-black uppercase tracking-widest pb-2 border-b-4 transition-all ${activeTab === key ? "border-[#1e3a6e] text-[#1e3a6e]" : "border-transparent text-gray-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setView("form");
              }}
              className="bg-[#1e3a6e] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-all"
            >
              <Plus size={20} /> New{" "}
              {activeTab === "blogs"
                ? "Post"
                : activeTab === "gallery"
                  ? "Case"
                  : "Review"}
            </button>
            <button
              onClick={logout}
              className="p-4 bg-white text-gray-400 rounded-2xl shadow-sm hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">
            Syncing...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-300 font-bold">
            No {activeTab === "reviews" ? "reviews" : "items"} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl flex items-center gap-5 border border-[#d0ddf0] shadow-sm"
              >
                {/* Thumbnail / Icon */}
                {activeTab === "reviews" ? (
                  <div className="w-16 h-16 bg-[#f8faff] rounded-2xl overflow-hidden flex-shrink-0 border border-[#d0ddf0] flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt="Review"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MessageSquare size={24} className="text-[#b0c4de]" />
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border">
                    <img
                      src={
                        activeTab === "blogs"
                          ? item.cover_image
                          : item.case_images?.[0]?.after_image_url
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 truncate">
                  {activeTab === "reviews" ? (
                    <>
                      <p className="font-black text-[#1e3a6e] truncate">
                        {item.patient_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            style={{
                              fill: s <= item.stars ? "#f59e0b" : "none",
                              stroke: s <= item.stars ? "#f59e0b" : "#d1d5db",
                            }}
                          />
                        ))}
                        <span className="text-[10px] font-bold text-gray-400 ml-1">
                          {item.stars}/5
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {item.review_text}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-[#1e3a6e] truncate">
                        {activeTab === "blogs"
                          ? item.title_en
                          : item.patient_name_en}
                      </p>
                      <span className="text-[10px] font-bold uppercase text-[#1e3a6e] bg-[#e8eef8] px-2 py-0.5 rounded-md">
                        {activeTab === "blogs" ? item.type : item.category}
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-3 text-gray-300 hover:text-[#1e3a6e] transition-all"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
