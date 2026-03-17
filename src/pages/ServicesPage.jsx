import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Calendar, ChevronDown, ChevronUp, Stethoscope, 
  Syringe, Scissors, X, Video, Building2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/Header';

// ... (conditions, nonsurgical, transplants data objects remain exactly the same)
const conditions = {
  en: [
    {
      title: 'Androgenetic Hair Loss (Male & Female Pattern Hair Loss)',
      desc: 'A common, genetically influenced form of hair loss, presenting as receding hairlines and crown thinning in men, and diffuse top-of-scalp thinning in women. Early intervention with tailored therapies can slow progression and enhance hair density.'
    },
    {
      title: 'Alopecia Areata',
      desc: 'An autoimmune condition leading to sudden, well-defined bald patches. Treatments focus on reducing inflammation and promoting regrowth, with individualized plans to minimize recurrence.'
    },
    {
      title: 'Cicatricial (Scarring) Alopecia',
      desc: 'Inflammatory disorders that permanently destroy hair follicles, including lichen planopilaris, frontal fibrosing alopecia, and discoid lupus erythematosus. Early diagnosis and intervention are critical to preserve remaining hair.'
    },
    {
      title: 'Traction Alopecia',
      desc: 'Hair loss caused by prolonged tension from tight hairstyles, such as ponytails, braids, or buns. Hair may recover fully if detected early, though chronic traction can result in permanent thinning or localized bald patches.'
    },
    {
      title: 'Hypotrichosis',
      desc: 'A rare genetic condition characterized by sparse or fragile hair growth. Hair may appear normal at birth but is often lost within the first months of life. Limited treatments may improve thickness or stimulate regrowth.'
    },
    {
      title: 'Telogen Effluvium',
      desc: 'A temporary hair shedding condition triggered by stress, illness, hormonal changes, or medications. Hair usually regrows once the underlying cause is addressed. Proper evaluation ensures the correct diagnosis and effective management.'
    },
    {
      title: 'Hair Shaft Abnormalities',
      desc: 'Structural defects of the hair shaft can lead to brittle, fragile, or easily broken hair. Examples include monilethrix (beaded hair), trichorrhexis nodosa (nodes along the hair shaft causing breakage), pili torti (twisted hair), and other congenital or acquired abnormalities. Accurate diagnosis using dermoscopy and microscopic analysis is essential to guide protective strategies and optimize hair strength.'
    },
  ],
  ar: [
    {
      title: 'فقدان الشعر الوراثي (للرجال والنساء)',
      desc: 'أحد أكثر أشكال فقدان الشعر شيوعًا، وينجم عن عوامل جينية وهرمونية. يظهر لدى الرجال عادة على شكل تراجع خط الشعر وتخفف تاج الرأس، بينما تلاحظ النساء ترققًا منتشرًا في الجزء العلوي من فروة الرأس. التدخل المبكر باستخدام علاجات مخصصة يمكن أن يبطئ التقدم ويحسن كثافة الشعر.'
    },
    {
      title: 'الثعلبة البقعية',
      desc: 'اضطراب مناعي ذاتي يؤدي إلى ظهور بقع صلع محددة ومفاجئة. تركز العلاجات على تقليل الالتهاب وتحفيز إعادة نمو الشعر، مع خطط فردية للحد من تكرار الحالة.'
    },
    {
      title: 'الثعلبة الندبية (الصلع الالتهابي)',
      desc: 'مجموعة من الاضطرابات الالتهابية التي تدمر بصيلات الشعر بشكل دائم، مثل اللويحة الحزازية المتصلبة، الثعلبة الجبهية المتقدمة، والذئبة الحمراء القرصية. التشخيص المبكر والتدخل السريع ضروريان للحفاظ على الشعر المتبقي.'
    },
    {
      title: 'الثعلبة الناتجة عن شد/سحب الشعر',
      desc: 'فقدان الشعر الناتج عن شد مستمر على البصيلات بسبب تسريحات مشدودة مثل ذيل الحصان، الضفائر أو الكعكات. يمكن أن يستعيد الشعر نموه الكامل إذا تم التعرف على المشكلة مبكرًا، بينما قد يؤدي الشد المزمن إلى ترقق دائم أو بقع صلع موضعية.'
    },
    {
      title: 'قلة الشعر (Hypotrichosis)',
      desc: 'اضطراب وراثي نادر يتميز بنمو شعر خفيف أو ضعيف على فروة الرأس والجسم. قد يبدو الشعر طبيعيًا عند الولادة لكنه غالبًا ما يتساقط خلال الأشهر الأولى ويُستبدل بشعر رقيق وهش. الخيارات العلاجية محدودة، لكن بعض العلاجات قد تساعد على زيادة سماكة الشعر أو تحفيز نموه.'
    },
    {
      title: 'تساقط الشعر الكربي (Telogen Effluvium)',
      desc: 'حالة مؤقتة لفقدان الشعر تحدث نتيجة التوتر، المرض، التغيرات الهرمونية أو بعض الأدوية. عادةً ما يعود الشعر للنمو بعد معالجة السبب الأساسي، ويتطلب التشخيص الدقيق لضمان الإدارة الصحيحة.'
    },
    {
      title: 'تشوهات عمود الشعر',
      desc: 'العيوب البنيوية في عمود الشعر قد تؤدي إلى شعر هش، ضعيف أو سهل التكسر. تشمل الأمثلة: الشعر الحبيبي (Monilethrix)، العقد الشعرية (Trichorrhexis Nodosa)، الشعر الملتوي (Pili Torti)، وغيرها من التشوهات الوراثية أو المكتسبة. التشخيص الدقيق باستخدام الديرموسكوب والتحليل المجهري ضروري لتحديد الاستراتيجيات الوقائية وتعزيز قوة الشعر.'
    },
  ]
};

const nonsurgical = {
  en: [
    { title: 'PRP Therapy', desc: 'Stimulates dormant follicles, improves hair thickness, and encourages natural regrowth using your own blood.' },
    { title: 'Mesotherapy', desc: 'Micro-injections of vitamins and growth factors to nourish follicles, boost circulation, and support healthy hair.' },
    { title: 'Stem Cell Regenerative Therapy', desc: 'Revitalizes damaged follicles, stimulates new growth, and enhances scalp health with advanced regenerative techniques.' },
    { title: 'Scalp Micropigmentation (SMP)', desc: 'Conceals thinning areas, scars, or baldness by creating the illusion of fuller hair, offering a natural, low-maintenance solution.' },
  ],
  ar: [
    { title: 'البلازما الغنية بالصفائح الدموية (PRP)', desc: 'يحفز بصيلات الشعر الخامدة، يعزز كثافة الشعر، ويشجع على نمو الشعر الطبيعي باستخدام دم المريض نفسه.' },
    { title: 'الميزوثيرابي', desc: 'حقن دقيقة بالفيتامينات وعوامل النمو لتغذية البصيلات، تحسين الدورة الدموية، ودعم نمو شعر صحي وقوي.' },
    { title: 'العلاج بالخلايا الجذعية', desc: 'يعيد تنشيط بصيلات الشعر التالفة، يحفز نموًا جديدًا، ويحسن صحة فروة الرأس.' },
    { title: 'تقنية SMP', desc: 'تقنية يتم بها وضع نقاط سوداء دقيقة داخل فروة الرأس في الطبقة السطحية من الجلد لإخفاء مناطق الشعر الخفيف، الندبات، وكذلك الصلع.' },
  ]
};

const transplants = {
  en: [
    { title: 'FUE Hair Transplant', desc: 'Minimally invasive follicular extraction for natural hairline design and permanent results.' },
    { title: 'Eyebrow Transplant', desc: 'Precision restoration for symmetrical, natural-looking eyebrows tailored to your face.' },
    { title: 'Beard & Facial Hair Transplant', desc: 'Enhance or restore facial hair with state-of-the-art follicular techniques for a full, stunning appearance.' },
    { title: 'Scar & Post-Traumatic Hair Transplant', desc: 'Specialized restoration for scars or trauma-related hair loss, blending seamlessly with surrounding hair.' },
    { title: 'Forehead Reduction / Scalp Advancement Surgery', desc: 'Surgical techniques to lower a high hairline and enhance facial proportions.' },
  ],
  ar: [
    { title: 'زراعة الشعر بتقنية FUE', desc: 'استخراج بصيلات الشعر بشكل دقيق وزرعها في المناطق المصابة بالصلع لضمان تصميم خط شعر طبيعي ونتائج دائمة.' },
    { title: 'زراعة الحواجب', desc: 'استعادة دقيقة للحواجب لإنشاء قوسين متناسقين وطبيعيين يتناسبان مع ملامح الوجه.' },
    { title: 'زراعة اللحية والشارب', desc: 'تعزيز أو استعادة الشعر في اللحية أو الشارب أو الجوانب باستخدام تقنيات استخراج البصيلات المتقدمة للحصول على مظهر كامل ومذهل.' },
    { title: 'زراعة الشعر في الندبات وما بعد الإصابات', desc: 'استعادة الشعر في مناطق الندوب أو فقدان الشعر الناتج عن الصدمات، مع دمج طبيعي مع الشعر المحيط.' },
    { title: 'زراعة تصغير الجبهة', desc: 'تقنيات جراحية لخفض خط الشعر المرتفع وتحسين نسب الوجه وجماليات خط الشعر.' },
  ]
};

function AccordionCard({ title, desc, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden shadow-sm"
      style={{ background: 'white', border: '1px solid #d0ddf0' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
        style={{ background: open ? '#f0f4fa' : 'white' }}
      >
        <span className="font-semibold text-sm leading-snug" style={{ color: '#1e3a6e' }}>{title}</span>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#1e3a6e' }} />
          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#7a96c2' }} />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed pt-3" style={{ color: '#5a7099', borderTop: '1px solid #e8eef8' }}>{desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ServiceCard({ title, desc, index, accent }) {
  const isNavy = accent === 'blue';
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl p-6 shadow-sm"
      style={{
        background: isNavy ? '#f0f4fa' : 'white',
        border: `1px solid ${isNavy ? '#d0ddf0' : '#d4edda'}`,
      }}
    >
      <div className="flex items-start gap-3">
        <CheckCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: isNavy ? '#1e3a6e' : '#2d7a4f' }}
        />
        <div>
          <h3 className="font-bold mb-1" style={{ color: '#1e3a6e' }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#5a7099' }}>{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

const TABS = {
  en: [
    { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
    { id: 'nonsurgical', label: 'Non-Surgical', icon: Syringe },
    { id: 'surgical', label: 'Surgical', icon: Scissors },
  ],
  ar: [
    { id: 'diagnosis', label: 'التشخيص', icon: Stethoscope },
    { id: 'nonsurgical', label: 'غير جراحي', icon: Syringe },
    { id: 'surgical', label: 'جراحي', icon: Scissors },
  ],
};

function ServicesPage() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const dir = isAr ? 'rtl' : 'ltr';
  const lang = isAr ? 'ar' : 'en';

  const [activeTab, setActiveTab] = useState('diagnosis');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabs = TABS[lang];

  const handleClinicConsultation = () => {
    const phoneNumber = "201288979999";
    const message = encodeURIComponent(isAr 
      ? "مرحباً دكتور أحمد، أود حجز استشارة في العيادة." 
      : "Hello Dr. Ahmed, I would like to book a Clinic Consultation.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{isAr ? 'خدمات العيادة — د. أحمد مجاهد' : 'Services — Dr. Ahmed Megahed'}</title>
      </Helmet>

      {/* Hero Section */}
      <section className="text-white py-16" style={{ background: 'linear-gradient(135deg, #162d57 0%, #1e3a6e 50%, #253f7a 100%)' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">{isAr ? 'خدمات العيادة' : 'Our Services'}</h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr ? 'نقدم أحدث العلاجات لمختلف مشاكل الشعر وفروة الرأس' : 'Comprehensive hair and scalp care using the latest techniques.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-30 shadow-sm" style={{ background: 'white', borderBottom: '1px solid #d0ddf0' }} dir={dir}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-4 text-sm font-semibold transition-all duration-200"
                  style={{
                    borderBottom: isActive ? '2px solid #1e3a6e' : '2px solid transparent',
                    color: isActive ? '#1e3a6e' : '#7a96c2',
                    background: isActive ? '#f0f4fa' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 min-h-[60vh]" style={{ background: '#f0f4fa' }} dir={dir}>
        <div className="max-w-5xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'diagnosis' && (
              <motion.div key="diagnosis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="space-y-3">
                  {conditions[lang].map((c, i) => (
                    <AccordionCard key={i} index={i} title={c.title} desc={c.desc} />
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'nonsurgical' && (
              <motion.div key="nonsurgical" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {nonsurgical[lang].map((s, i) => (
                    <ServiceCard key={i} index={i} title={s.title} desc={s.desc} accent="blue" />
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'surgical' && (
              <motion.div key="surgical" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {transplants[lang].map((s, i) => (
                    <ServiceCard key={i} index={i} title={s.title} desc={s.desc} accent="green" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section — TRIGGERS MODAL */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">{isAr ? 'ابدأ رحلتك نحو شعر أفضل' : 'Ready to Begin?'}</h2>
          <Button onClick={() => setIsModalOpen(true)} size="lg" style={{ background: 'white', color: '#1e3a6e' }}>
            <Calendar className="w-5 h-5 mr-2" />
            {isAr ? 'احجز موعداً' : 'Book Your Consultation'}
          </Button>
        </div>
      </section>

      {/* --- CONSULTATION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-[101]" dir={dir}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900" style={{ color: '#1e3a6e' }}>{isAr ? 'نوع الاستشارة' : 'Consultation Type'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => {navigate('/book-appointment'); setIsModalOpen(false);}} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <Stethoscope className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{isAr ? 'استشارة زراعة الشعر' : 'Hair Transplant Consultation'}</div>
                </button>
                <button onClick={() => {navigate('/book-appointment'); setIsModalOpen(false);}} className="w-full flex items-center p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <Video className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-blue-600`} />
                  <div className="font-bold">{isAr ? 'استشارة أونلاين' : 'Online Consultation'}</div>
                </button>
                <button onClick={handleClinicConsultation} className="w-full flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left">
                  <Building2 className={`${isAr ? 'ml-4' : 'mr-4'} w-8 h-8 text-green-600`} />
                  <div className="font-bold text-green-700">{isAr ? 'تواصل معنا' : 'Contact Us'}</div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ServicesPage;