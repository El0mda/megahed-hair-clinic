import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Send, CheckCircle, X, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/Header';

// ─── Static Data ──────────────────────────────────────────────────────────────
const PROCEDURES = {
  en: [
    'FUE Hair Transplant', 'Eyebrow Transplant', 'Beard & Facial Hair Transplant',
    'Scar & Post-Traumatic Hair Transplant', 'Forehead Reduction / Scalp Advancement Surgery',
    'PRP Therapy', 'Mesotherapy', 'Stem Cell Regenerative Therapy',
    'Scalp Micropigmentation (SMP)', 'Hair & Scalp Diagnosis / Consultation',
  ],
  ar: [
    'زراعة الشعر بتقنية FUE', 'زراعة الحواجب', 'زراعة اللحية والشارب',
    'زراعة الشعر في الندبات وما بعد الإصابات', 'زراعة تصغير الجبهة',
    'علاج البلازما (PRP)', 'الميزوثيرابي', 'العلاج بالخلايا الجذعية',
    'تقنية SMP', 'تشخيص الشعر وفروة الرأس / استشارة',
  ],
};

const REGIONS = {
  en: [
    'Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar',
    'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Iraq', 'Libya', 'Tunisia',
    'Morocco', 'Algeria', 'United Kingdom', 'Germany', 'France',
    'United States', 'Canada', 'Australia', 'Other',
  ],
  ar: [
    'مصر', 'السعودية', 'الإمارات', 'الكويت', 'قطر',
    'البحرين', 'عُمان', 'الأردن', 'لبنان', 'العراق', 'ليبيا', 'تونس',
    'المغرب', 'الجزائر', 'المملكة المتحدة', 'ألمانيا', 'فرنسا',
    'الولايات المتحدة', 'كندا', 'أستراليا', 'أخرى',
  ],
};

const COUNTRY_CODES = [
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
];

const BENEFITS = {
  en: [
    'Personalised consultation',
    'Custom treatment plan & quote',
    'No-obligation assessment',
    'Response within 24 hours',
  ],
  ar: [
    'استشارة مخصصة لك',
    'تقييم حالتك لزراعة الشعر و عرض سعر مخصص لك',
    'تقييم بدون أي التزام',
    'رد خلال 24 ساعة',
  ],
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold" style={{ color: '#1e3a6e' }}>
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Input base styles ────────────────────────────────────────────────────────
const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:border-transparent ${err
    ? 'border-red-400 bg-red-50 focus:ring-red-300'
    : 'border-[#d0ddf0] bg-[#f7f9fd] focus:bg-white focus:ring-[#1e3a6e]'
  }`;

// ─── Pill button style helper ─────────────────────────────────────────────────
function PillButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200"
      style={{
        borderColor: selected ? '#1e3a6e' : '#d0ddf0',
        background: selected ? '#1e3a6e' : '#f7f9fd',
        color: selected ? 'white' : '#3d5a8a',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = '#7a96c2'; e.currentTarget.style.background = '#eef2fa'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = '#d0ddf0'; e.currentTarget.style.background = '#f7f9fd'; } }}
    >
      {children}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { toast } = useToast();
  const { isAr } = useLang();
  const dir = isAr ? 'rtl' : 'ltr';
  const lang = isAr ? 'ar' : 'en';
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    countryCode: '+20', phone: '',
    sex: '', region: '', procedure: '',
    hairLossDuration: '',
    dailyShedding: [],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = isAr ? 'الاسم الأول مطلوب' : 'First name is required';
    if (!form.lastName.trim()) e.lastName = isAr ? 'اسم العائلة مطلوب' : 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = isAr ? 'بريد إلكتروني غير صالح' : 'Valid email is required';
    if (!form.phone.trim()) e.phone = isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    if (!form.sex) e.sex = isAr ? 'الجنس مطلوب' : 'Please select your sex';
    if (!form.region) e.region = isAr ? 'المنطقة مطلوبة' : 'Region is required';
    if (!form.procedure) e.procedure = isAr ? 'الإجراء مطلوب' : 'Procedure of interest is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFiles = (incoming) => {
    const allowed = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...allowed].slice(0, 5));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Convert images to base64
  const toBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.readAsDataURL(file);
  });

  const images = await Promise.all(files.map(toBase64));

  try {
    await fetch('https://n8n.srv1116147.hstgr.cloud/webhook/65af3d64-d0d4-4c3f-b8e0-0baebd3f03bd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: `${form.countryCode}${form.phone}`,
        sex: form.sex,
        region: form.region,
        hadTransplantBefore: form.procedure,
        hairLossDuration: form.hairLossDuration,
        dailyShedding: form.dailyShedding,
        message: form.message,
        submittedAt: new Date().toISOString(),
        language: isAr ? 'ar' : 'en',
        images: images,
      }),
    });
  } catch (err) {
    console.error('Webhook error:', err);
  }

  setSubmitted(true);
};

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f0f4fa' }} dir={dir}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
          style={{ border: '1px solid #d0ddf0' }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#e8eef8' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#1e3a6e' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1e3a6e' }}>
            {isAr ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted!'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#5a7099' }}>
            {isAr
              ? 'شكرًا لتواصلك مع عيادة د. أحمد مجاهد. سيتواصل معك فريقنا خلال 24 ساعة.'
              : "Thank you for reaching out to Dr. Ahmed Megahed's clinic. Our team will get back to you within 24 hours."}
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="w-full rounded-xl font-semibold text-white"
            style={{ background: '#1e3a6e' }}
            onMouseEnter={e => e.currentTarget.style.background = '#162d57'}
            onMouseLeave={e => e.currentTarget.style.background = '#1e3a6e'}
          >
            {isAr ? 'إرسال طلب جديد' : 'Submit Another Request'}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isAr ? 'استشارة زراعة الشعر — د. أحمد مجاهد' : 'Hair Transplant Consultation — Dr. Ahmed Megahed'}</title>
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
              {isAr ? 'احجز استشارتك' : 'Book Your Consultation'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'ارسل لنا صور شعرك واحصل على تقييم حالتك لزراعة الشعر وعرض سعر مخصص لك'
                : 'Share your hair photos and receive a personalised treatment plan and quote'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="py-16" style={{ background: '#f0f4fa' }} dir={dir}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* ── Left: Benefits sidebar ── */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="rounded-2xl shadow-sm p-6" style={{ background: 'white', border: '1px solid #d0ddf0' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#1e3a6e' }}>
                  {isAr ? 'ما الذي ستحصل عليه' : 'What you get'}
                </h3>
                <ul className="space-y-3">
                  {BENEFITS[lang].map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#3d5a8a' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1e3a6e' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro tip — solid navy matching header */}
              <div className="rounded-2xl p-6 text-white" style={{ background: '#1e3a6e' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#a8c4e8' }}>
                  {isAr ? 'نصيحة' : 'Pro tip'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#dce8f5' }}>
                  {isAr
                    ? 'ارفع صورًا من الأمام والأعلى والخلف لفروة الرأس للحصول على تقييم أكثر دقة وسرعة.'
                    : 'Upload front, top, and back photos of your scalp for a faster and more accurate assessment.'}
                </p>
              </div>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 rounded-2xl shadow-sm p-8"
              style={{ background: 'white', border: '1px solid #d0ddf0' }}
            >
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e3a6e' }}>
                {isAr ? 'أرسل طلب استشارتك' : 'Get your personalised plan and quote'}
              </h2>
              <p className="text-sm mb-8" style={{ color: '#7a96c2' }}>
                {isAr ? 'جميع الحقول المعلمة بـ * مطلوبة' : 'All fields marked * are required'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={isAr ? 'الاسم الأول *' : 'First Name *'} error={errors.firstName}>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      placeholder={isAr ? 'أدخل اسمك الأول' : 'Insert your first name'}
                      className={inputCls(errors.firstName)}
                    />
                  </Field>
                  <Field label={isAr ? 'اسم العائلة *' : 'Last Name *'} error={errors.lastName}>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      placeholder={isAr ? 'أدخل اسم العائلة' : 'Insert your last name'}
                      className={inputCls(errors.lastName)}
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field label={isAr ? 'البريد الإلكتروني *' : 'Email Address *'} error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Insert your email'}
                    className={inputCls(errors.email)}
                  />
                </Field>

                {/* Phone + Sex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={isAr ? 'رقم الهاتف *' : 'Phone Number *'} error={errors.phone}>
                    <div
                      className="flex rounded-xl border overflow-hidden"
                      style={{
                        borderColor: errors.phone ? '#f87171' : '#d0ddf0',
                        background: '#f7f9fd',
                      }}
                    >
                      <select
                        value={form.countryCode}
                        onChange={e => set('countryCode', e.target.value)}
                        className="text-sm px-2 py-3 focus:outline-none"
                        style={{ background: '#eef2fa', borderRight: '1px solid #d0ddf0', color: '#1e3a6e' }}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder={isAr ? 'رقم الهاتف' : 'Phone number'}
                        className="flex-1 px-3 py-3 text-sm focus:outline-none"
                        style={{ background: 'transparent', color: '#1a2e4a' }}
                      />
                    </div>
                  </Field>

                  <Field label={isAr ? 'الجنس *' : 'Sex *'} error={errors.sex}>
                    <select
                      value={form.sex}
                      onChange={e => set('sex', e.target.value)}
                      className={inputCls(errors.sex)}
                    >
                      <option value="">{isAr ? 'اختر الجنس' : 'Your Sex'}</option>
                      <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                      <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                    </select>
                  </Field>
                </div>

                {/* Region */}
                <Field label={isAr ? 'المنطقة *' : 'Your Region *'} error={errors.region}>
                  <select
                    value={form.region}
                    onChange={e => set('region', e.target.value)}
                    className={inputCls(errors.region)}
                  >
                    <option value="">{isAr ? 'اختر منطقتك *' : 'Select your region *'}</option>
                    {REGIONS[lang].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                {/* Previous Transplant */}
                <Field label={isAr ? 'هل خضعت لعملية زراعة شعر من قبل؟ *' : 'Have you had a hair transplant before? *'} error={errors.procedure}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'yes', labelEn: 'Yes', labelAr: 'نعم' },
                      { value: 'no', labelEn: 'No', labelAr: 'لا' },
                    ].map(opt => (
                      <PillButton
                        key={opt.value}
                        selected={form.procedure === opt.value}
                        onClick={() => set('procedure', opt.value)}
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </PillButton>
                    ))}
                  </div>
                </Field>

                {/* Hair Loss Duration */}
                <Field label={isAr ? 'منذ متى وأنت تعاني من تساقط الشعر؟' : 'How long have you been experiencing hair loss?'}>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: '5+', en: '5 years or more', ar: '٥ سنوات أو أكثر' },
                      { value: '2-5', en: '2 to 5 years', ar: 'من ٢ إلى ٥ سنوات' },
                      { value: '1-2', en: '1 to 2 years', ar: 'من ١ إلى ٢ سنة' },
                      { value: '<1y', en: 'Less than a year', ar: 'أقل من سنة' },
                      { value: '<6m', en: 'Less than 6 months', ar: 'أقل من ٦ أشهر' },
                    ].map(opt => (
                      <PillButton
                        key={opt.value}
                        selected={form.hairLossDuration === opt.value}
                        onClick={() => set('hairLossDuration', form.hairLossDuration === opt.value ? '' : opt.value)}
                      >
                        {isAr ? opt.ar : opt.en}
                      </PillButton>
                    ))}
                  </div>
                </Field>

                {/* Daily Shedding */}
                <Field label={isAr ? 'ما كمية تساقط الشعر يومياً؟ (شعرة في اليوم)' : 'How much hair do you shed daily? (hairs/day)'}>
                  <p className="text-xs mb-2" style={{ color: '#7a96c2' }}>
                    {isAr ? 'يمكن اختيار أكثر من خيار' : 'You can select more than one'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: '<50', en: 'Less than 50', ar: 'أقل من ٥٠' },
                      { value: '50-100', en: '50–100', ar: '١٠٠-٥٠' },
                      { value: '100+', en: 'More than 100', ar: 'أكثر من ١٠٠' },
                      { value: '150+', en: 'More than 150', ar: 'أكثر من ١٥٠' },
                      { value: '200+', en: 'More than 200', ar: 'أكثر من ٢٠٠' },
                      { value: '300+', en: 'More than 300', ar: 'أكثر من ٣٠٠' },
                      { value: 'unsure', en: 'Not sure', ar: 'غير متأكد' },
                    ].map(opt => {
                      const selected = form.dailyShedding.includes(opt.value);
                      return (
                        <PillButton
                          key={opt.value}
                          selected={selected}
                          onClick={() => {
                            const next = selected
                              ? form.dailyShedding.filter(v => v !== opt.value)
                              : [...form.dailyShedding, opt.value];
                            set('dailyShedding', next);
                          }}
                        >
                          {isAr ? opt.ar : opt.en}
                        </PillButton>
                      );
                    })}
                  </div>
                </Field>

                {/* Message */}
                <Field label={isAr ? 'رسالتك (اختياري)' : 'Your Message (optional)'}>
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={3}
                    placeholder={isAr ? 'أي تفاصيل إضافية تود مشاركتها...' : "Any additional details you'd like to share..."}
                    className={inputCls(false) + ' resize-none'}
                  />
                </Field>

                {/* Photo Upload */}
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#1e3a6e' }}>
                    {isAr ? 'صور الشعر (اختياري)' : 'Hair Photos (optional)'}
                  </p>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: '#5a7099' }}>
                    {isAr
                      ? 'ارفع صور شعرك (الأمام، الأعلى، والخلف) للحصول على تقييم عبر الإنترنت.'
                      : 'Upload photos of your hair (front, top, and back) for an online assessment.'}
                  </p>

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                    style={{
                      borderColor: dragging ? '#1e3a6e' : '#c0cfe8',
                      background: dragging ? '#eef2fa' : '#f7f9fd',
                    }}
                    onMouseEnter={e => { if (!dragging) { e.currentTarget.style.borderColor = '#7a96c2'; e.currentTarget.style.background = '#eef2fa'; } }}
                    onMouseLeave={e => { if (!dragging) { e.currentTarget.style.borderColor = '#c0cfe8'; e.currentTarget.style.background = '#f7f9fd'; } }}
                  >
                    <ImagePlus className="w-8 h-8 mx-auto mb-2" style={{ color: '#7a96c2' }} />
                    <p className="text-sm" style={{ color: '#5a7099' }}>
                      {isAr ? 'انقر أو اسحب الصور هنا للرفع' : 'Click or drag files to this area to upload'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#7a96c2' }}>
                      {isAr ? 'حتى 5 صور — JPG، PNG' : 'Up to 5 images — JPG, PNG'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => handleFiles(e.target.files)}
                    />
                  </div>

                  {/* Preview thumbnails */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-3 mt-4"
                      >
                        {files.map((f, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm"
                            style={{ border: '1px solid #d0ddf0' }}
                          >
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-600 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-xl text-base font-semibold py-3.5 text-white flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#1e3a6e' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#162d57'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1e3a6e'}
                >
                  <Send className={`w-5 h-5 ${isAr ? 'ml-2' : 'mr-2'}`} />
                  {isAr ? 'إرسال طلب الاستشارة' : 'Send Consultation Request'}
                </button>

                <p className="text-center text-xs" style={{ color: '#7a96c2' }}>
                  {isAr
                    ? 'بإرسال هذا النموذج، أنت توافق على التواصل معك بخصوص استشارتك.'
                    : 'By submitting, you agree to be contacted regarding your consultation request.'}
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}