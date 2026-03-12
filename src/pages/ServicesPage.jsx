import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, ChevronDown, ChevronUp, Stethoscope, Syringe, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/Header';

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Accordion Card ───────────────────────────────────────────────────────────
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

// ─── Service Card ─────────────────────────────────────────────────────────────
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

// ─── Tab definitions ──────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
function ServicesPage() {
  const { isAr } = useLang();
  const dir = isAr ? 'rtl' : 'ltr';
  const lang = isAr ? 'ar' : 'en';

  const [activeTab, setActiveTab] = useState('diagnosis');
  const tabs = TABS[lang];

  return (
    <>
      <Helmet>
        <title>{isAr ? 'خدمات العيادة — د. أحمد مجاهد' : 'Services — Dr. Ahmed Megahed'}</title>
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
              {isAr ? 'خدمات العيادة' : 'Our Services'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'نقدم أحدث العلاجات لمختلف مشاكل الشعر وفروة الرأس'
                : 'Comprehensive hair and scalp care using the latest techniques and technologies'}
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
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#1e3a6e'; e.currentTarget.style.background = '#f7f9fd'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#7a96c2'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#1e3a6e' : '#7a96c2' }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 min-h-[60vh]" style={{ background: '#f0f4fa' }} dir={dir}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <AnimatePresence mode="wait">

            {/* ── Diagnosis ── */}
            {activeTab === 'diagnosis' && (
              <motion.div
                key="diagnosis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: '#e8eef8', color: '#1e3a6e' }}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    {isAr ? 'التشخيص' : 'Diagnosis'}
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#1e3a6e' }}>
                    {isAr ? 'أمراض الشعر وفروة الرأس' : 'Hair and Scalp Conditions'}
                  </h2>
                  <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5a7099' }}>
                    {isAr
                      ? 'نقدم تقييمًا دقيقًا وإدارة متخصصة لكامل طيف أمراض الشعر وفروة الرأس'
                      : 'Expert evaluation and management of the full spectrum of hair and scalp disorders'}
                  </p>
                </div>
                <div className="space-y-3">
                  {conditions[lang].map((c, i) => (
                    <AccordionCard key={i} index={i} title={c.title} desc={c.desc} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Non-Surgical ── */}
            {activeTab === 'nonsurgical' && (
              <motion.div
                key="nonsurgical"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: '#e8eef8', color: '#1e3a6e' }}
                  >
                    <Syringe className="w-3.5 h-3.5" />
                    {isAr ? 'غير جراحي' : 'Non-Surgical'}
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#1e3a6e' }}>
                    {isAr ? 'العلاجات غير الجراحية' : 'Non-Surgical Treatments'}
                  </h2>
                  <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5a7099' }}>
                    {isAr
                      ? 'علاجات متطورة لتحفيز نمو الشعر وتعزيز صحة فروة الرأس دون تدخل جراحي'
                      : 'Advanced treatments to stimulate hair growth and improve scalp health — no surgery required'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {nonsurgical[lang].map((s, i) => (
                    <ServiceCard key={i} index={i} title={s.title} desc={s.desc} accent="blue" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Surgical ── */}
            {activeTab === 'surgical' && (
              <motion.div
                key="surgical"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: '#d4edda', color: '#2d7a4f' }}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    {isAr ? 'جراحي' : 'Surgical'}
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#1e3a6e' }}>
                    {isAr ? 'العلاجات الجراحية' : 'Hair Transplants & Surgical Procedures'}
                  </h2>
                  <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5a7099' }}>
                    {isAr
                      ? 'إجراءات جراحية دقيقة لاستعادة الشعر بشكل دائم وطبيعي'
                      : 'Precision surgical procedures for permanent, natural-looking hair restoration'}
                  </p>
                </div>
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

      {/* CTA — exact header navy */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {isAr ? 'ابدأ رحلتك نحو شعر أفضل' : 'Ready to Begin Your Hair Restoration Journey?'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'احجز استشارتك مع د.أحمد مجاهد لمناقشة أفضل خيار علاجي لحالتك'
                : 'Schedule a consultation to discuss the best treatment option for your needs'}
            </p>
            <Link to="/book-appointment">
              <Button
                size="lg"
                className="font-semibold shadow-xl"
                style={{ background: 'white', color: '#1e3a6e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {isAr ? 'احجز موعداً' : 'Book Your Consultation'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;