import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/components/Header';

const DR_PHOTO = "https://i.ibb.co/3mFpVHt0/Screenshot-from-2026-03-05-17-52-16.png";

function AboutPage() {
  const { isAr } = useLang();
  const dir = isAr ? 'rtl' : 'ltr';

  const biographyEn = [
    "Early in my dermatology career, it became clear to me that hair loss and scalp disorders were often under-addressed, despite their profound medical and psychological impact. The lack of precise diagnosis and structured management pushed me to focus my practice exclusively on hair loss, scalp disorders, and hair transplantation, with the goal of offering more accurate, thoughtful, and effective care.",
    "Today, I manage the full spectrum of hair loss conditions. My clinical work includes autoimmune and inflammatory disorders associated with hair loss—such as alopecia areata, lichen planopilaris, frontal fibrosing alopecia, and discoid lupus erythematosus—as well as cicatricial alopecias, where inflammation leads to permanent follicular damage. I also treat both female and male pattern hair loss, with careful attention to diagnosis, disease progression, and long-term planning.",
    "I rely on advanced dermoscopy for precise scalp and follicle evaluation, allowing me to identify subtle changes, assess disease activity, and design highly individualized treatment strategies. This technology ensures that every patient receives a thorough, evidence-based assessment before any intervention.",
    "Patients seek my care for non-surgical hair restoration and medical hair management, using evidence-based therapies tailored to each individual. Treatment plans may include topical or oral prescription medications, intralesional therapies, platelet-rich plasma (PRP) injections, and structured follow-up strategies designed to optimize outcomes while maintaining scalp health.",
    "I also provide hair transplantation using advanced techniques that emphasize natural hairline design, density, and long-lasting results. Each procedure is carefully tailored to the patient's facial features and hair characteristics, ensuring outcomes that look both natural and stunning.",
    "I place strong emphasis on the initial consultation, typically dedicating extended time to discuss the diagnosis, realistic expectations, and treatment goals. Hair plays a central role in personal identity, and I believe managing hair disorders requires time, clarity, and a highly individualized approach.",
    "Alongside clinical practice, I'm actively involved in professional education and scientific exchange. I've been invited as an expert speaker at numerous renowned dermatology conferences, where I present on hair-loss-related topics with a focus on practical, updated, and evidence-based management strategies.",
    "My work is guided by a simple principle: precision over protocols, customization over trends, and science over shortcuts—delivering care that is refined, credible, and tailored to each patient."
  ];

  const biographyAr = [
    "في بداية مسيرتي في طب الأمراض الجلدية، لاحظت أن أمراض الشعر واضطرابات فروة الرأس لم تحظَ بالاهتمام الكافي، رغم أهميتها الطبية والجمالية والنفسية. ومن هنا، قررت أن أكرّس عملي حصريًا للعناية بالشعر وفروة الرأس وزراعة الشعر، مقدمًا رعاية متكاملة تجمع بين الدقة العلمية والنتائج المميزة.",
    "اليوم، أتولى علاج جميع أنواع أمراض الشعر، من الأمراض المناعية والالتهابية مثل الثعلبة البقعية، الحزاز، الثعلبة الأمامية الندبية، والذئبة الحمراء القرصية، فضلاً عن معالجة التساقط الوراثي (الصلع) لدى الرجال والنساء، مع وضع خطط علاجية دقيقة وطويلة الأمد لكل حالة.",
    "أعتمد على أحدث أجهزة الديرموسكوب للفحص التشخيصي الدقيق، مما يتيح رؤية شاملة لفروة الرأس وبصيلات الشعر، ويساعد على تصميم خطط علاجية مخصصة تحقق أفضل النتائج لكل مريض.",
    "تشمل الخطط العلاجية غير الجراحية الأدوية الموضعية والفموية، الحقن الموضعي، وحقن البلازما الغنية بالصفائح الدموية (PRP)، وغيرها من الخيارات التي تساعد على تحفيز نمو الشعر بطريقة طبيعية وآمنة.",
    "كما أقدم خدمات زراعة الشعر بأحدث التقنيات، لتحقيق نتائج طبيعية بحسب تقييم كل حالة بدقة من جهة العمر وشكل الوجه وكثافة الشعر الحالية والنتيجة المراد تحقيقها.",
    "يتم تخصيص وقت مطول في الاستشارة الأولى لمناقشة التشخيص، تحديد الأهداف العلاجية، ووضع خطة شخصية لكل مريض. فالشعر جزء أساسي من هوية الإنسان، ونجاح العلاج يعتمد على العناية الدقيقة، والتفصيل الشخصي، والنهج العلمي المتقن.",
    "إلى جانب عملي بالعيادة، تمت دعوتي كمتحدث في مؤتمرات رائدة للأمراض الجلدية، حيث أشارك أحدث الخبرات والاستراتيجيات في علاج مشاكل الشعر وفروة الرأس وفق أحدث الأدلة العلمية.",
    "أؤمن بأن العناية بالشعر تجمع بين الدقة والعلم والنهج الشخصي المتكامل لتقديم رعاية استثنائية تحقق نتائج مثالية لكل مريض."
  ];

  const biography = isAr ? biographyAr : biographyEn;

  return (
    <>
      <Helmet>
        <title>{isAr ? 'عن الدكتور أحمد مجاهد' : 'About Dr. Ahmed Megahed'}</title>
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
              {isAr ? 'د. أحمد مجاهد' : 'Dr. Ahmed Megahed'}
            </h1>
            <p className="text-xl" style={{ color: '#a8c4e8' }}>
              {isAr ? 'أخصائي أمراض الشعر وفروة الرأس وزراعة الشعر' : 'Hair Loss, Scalp Disorders & Hair Transplant Specialist'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photo + Biography */}
      <section className="py-16" style={{ background: 'white' }} dir={dir}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="mb-12"
          >
            <img
              src={DR_PHOTO}
              alt="Dr. Ahmed Megahed"
              className="w-full rounded-2xl shadow-2xl"
              style={{ aspectRatio: '18/20', objectFit: 'cover', objectPosition: '50% 10%' }}
            />
          </motion.div>

          {/* Biography text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          >
            {biography.map((para, i) => {
              const isLast = i === biography.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    borderLeft: isAr ? 'none' : '3px solid #7a96c2',
                    borderRight: isAr ? '3px solid #7a96c2' : 'none',
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderStyle: 'solid',
                    borderColor: '#7a96c2',
                    paddingLeft: isAr ? '0' : '18px',
                    paddingRight: isAr ? '18px' : '0',
                    padding: isAr ? '14px 18px 14px 14px' : '14px 14px 14px 18px',
                    marginBottom: isLast ? '0' : '20px',
                    background: i % 2 === 0 ? '#f7f9fd' : 'white',
                    borderRadius: '4px',
                  }}
                >
                  <p style={{
                    color: isLast ? '#1e3a6e' : '#374151',
                    lineHeight: '1.9',
                    fontSize: '0.97rem',
                    fontWeight: isLast ? '500' : '400',
                    fontStyle: isLast ? 'italic' : 'normal',
                    margin: 0,
                  }}>
                    {para}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* CTA — exact header navy */}
      <section className="py-16" style={{ background: '#1e3a6e' }} dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {isAr ? 'احجز استشارتك الآن' : 'Book Your Consultation'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#a8c4e8' }}>
              {isAr
                ? 'تواصل مع د.أحمد مجاهد لمناقشة أهدافك العلاجية'
                : 'Schedule a personal consultation with Dr. Ahmed Megahed to discuss your hair restoration goals'}
            </p>
            <Link to="/book-appointment">
              <button
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-colors"
                style={{ background: 'white', color: '#1e3a6e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <Calendar className="w-5 h-5" />
                {isAr ? 'احجز موعداً' : 'Book Your Consultation'}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
