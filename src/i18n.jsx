import { createContext, useContext, useEffect, useState } from 'react'

export const WA_NUMBER = '96599015863'
export const WA_DISPLAY = '+965 9901 5863'
export const PHONE_2_DISPLAY = '+965 9755 8200'
export const EMAIL = 'Almanar.kw.jcb2012@gmail.com'

const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`
const W = (path) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/1280px-${path.split('/').pop()}`

export const FLEET = [
  {
    id: 'excavator',
    img: U('1580901368919-7738efb0f87e'),
    en: { name: 'Excavators', blurb: 'Digging, trenching and foundation work — the machine that opens every site.', tags: ['Digging', 'Trenching', 'Foundations'] },
    ar: { name: 'الحفارات', blurb: 'الحفر وحفر الخنادق وأعمال الأساسات — المعدة التي تفتتح كل موقع.', tags: ['حفر', 'خنادق', 'أساسات'] },
  },
  {
    id: 'loader',
    img: W('9/98/Komatsu_WA500_wheel_loader_for_gravel_mining.jpg'),
    en: { name: 'Wheel Loaders', blurb: 'Aggregates moved, trucks loaded, yards kept clear and flowing.', tags: ['Aggregates', 'Truck loading', 'Site clearing'] },
    ar: { name: 'اللودرات', blurb: 'نقل الركام وتحميل الشاحنات وإبقاء الساحات نظيفة وفي حركة دائمة.', tags: ['ركام', 'تحميل شاحنات', 'تنظيف مواقع'] },
  },
  {
    id: 'jcb',
    img: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/JCB_3CX_Backhoe_Loader_on_outriggers.jpg',
    en: { name: 'JCB Machines', blurb: 'Backhoe loaders and more — a front loader and an excavator arm in one machine.', tags: ['Backhoes', 'Two-in-one', 'All-rounder'] },
    ar: { name: 'معدات JCB', blurb: 'حفارات لودر وغيرها — لودر أمامي وذراع حفر خلفي في معدة واحدة.', tags: ['حفار لودر', 'اثنان في واحد', 'متعددة الاستخدام'] },
  },
  {
    id: 'cat',
    img: W('1/18/Caterpillar_950k_Wheel_Loader.jpg'),
    en: { name: 'CAT Machines', blurb: 'Caterpillar power for earthmoving, loading and road work.', tags: ['Earthmoving', 'Road work', 'Heavy duty'] },
    ar: { name: 'معدات CAT', blurb: 'قوة كاتربيلر لأعمال التربة والتحميل والطرق.', tags: ['أعمال ترابية', 'طرق', 'خدمة شاقة'] },
  },
  {
    id: 'crane',
    img: W('e/e0/20230107_Construction_Site_Nuremberg.jpg'),
    en: { name: 'Cranes', blurb: 'Lifting for steel, precast and heavy installation work.', tags: ['Steel lifting', 'Precast', 'Installations'] },
    ar: { name: 'الرافعات', blurb: 'قدرة رفع للحديد والخرسانة الجاهزة وأعمال التركيبات الثقيلة.', tags: ['رفع حديد', 'خرسانة جاهزة', 'تركيبات'] },
  },
  {
    id: 'mixer',
    img: W('e/e7/Clean_concrete_mixer_truck.jpg'),
    en: { name: 'Concrete Mixers', blurb: 'Mixer trucks that keep every pour moving — one load or a full project supply.', tags: ['On-schedule pours', 'Project supply'] },
    ar: { name: 'خلاطات الخرسانة', blurb: 'شاحنات خلط تحافظ على حركة كل صبة — حمولة واحدة أو توريد مشروع كامل.', tags: ['صب في الموعد', 'توريد مشاريع'] },
  },
]

export const dict = {
  en: {
    dir: 'ltr',
    nav: { fleet: 'Fleet', services: 'Services', jcb: 'JCB', why: 'Why us', about: 'Company', contact: 'Contact', quote: 'Get a quote', langName: 'العربية', menu: 'Menu', close: 'Close' },
    hero: {
      eyebrow: 'Heavy machinery rental — Kuwait',
      titleA: 'Heavy machinery,',
      titleB: 'ready when you are.',
      sub: 'Excavators, loaders, JCB & CAT machines, cranes and mixers — hired by the day, the week or the full project, with our operator in the cab and delivery to your site anywhere in Kuwait.',
      cta1: 'Get a WhatsApp quote',
      cta2: 'Explore the fleet',
      cta3: 'Quote the JCB',
      accent: 'Est. 2002 — Jaleeb Al-Shuyukh, Kuwait',
      points: ['Front loader + bucket', 'Rear excavator arm', 'Four-wheel site mobility'],
      hudUnit: 'Unit 01 — JCB Backhoe Loader',
      hudDrag: 'Drag to spin',
      hudScroll: 'Scroll — come closer',
      hudCoords: '29.38°N / 47.99°E — Kuwait',
      readout: { slew: 'ROTATION', camera: 'CAMERA' },
      facts: [
        { v: 'SINCE 2002', l: 'Trading & contracting in Kuwait' },
        { v: '06', l: 'Fleet categories under one roof' },
        { v: 'DAY · WEEK · PROJECT', l: 'Hire terms that flex' },
        { v: 'JALEEB AL-SHUYUKH', l: 'Kuwait — delivered to your site' },
      ],
    },
    about: {
      eyebrow: 'The company',
      title: 'Powering Kuwait\u2019s projects since 2002.',
      p1: 'Al Manar Al Asriya — General Trading & Contracting Co. — has supplied heavy machinery to construction projects across Kuwait since 2002. One call brings the machine, its operator and its delivery together.',
      p2: 'From a single day\u2019s digging to a full project contract, the arrangement stays simple: the right machine, an experienced operator in the cab, and transport to your site handled by us.',
      values: [
        { t: 'Ready fleet', d: 'Six categories of machinery — excavators to mixers — under one roof.' },
        { t: 'Operator included', d: 'Every hire arrives with our own experienced operator or driver.' },
        { t: 'Terms that flex', d: 'Day, week or full project contract — agreed clearly, before work starts.' },
      ],
    },
    services: {
      eyebrow: 'Services',
      title: 'Three promises, kept on every hire.',
      scenes: [
        {
          n: '01', tag: 'Hire terms',
          t: 'By the day. By the week. By the project.',
          d: 'A two-day trench or a two-year build — the term fits the job, not the other way round. Start short, extend when the work grows.',
          specs: ['Day hire', 'Week hire', 'Project contract'],
        },
        {
          n: '02', tag: 'Operator',
          t: 'An operator in every cab.',
          d: 'Every machine is supplied with our own experienced operator or driver as part of the hire. The machine arrives ready to work, not ready to be figured out.',
          specs: ['Experienced operators', 'Included in the hire', 'No crew to arrange'],
        },
        {
          n: '03', tag: 'Delivery',
          t: 'Delivered to your site.',
          d: 'We transport the machine to your site anywhere in Kuwait and collect it when the hire ends. You mark the spot — we handle the road.',
          specs: ['Anywhere in Kuwait', 'Transport handled', 'Collected on completion'],
        },
      ],
    },
    jcb: {
      eyebrow: 'Featured machine — interactive 3D',
      title: 'The JCB backhoe loader.',
      sub: 'Two machines in one: a front loader for moving and loading, a rear excavator arm for digging. Drag the model — then watch it work.',
      hudDrag: 'Drag to rotate',
      hudAuto: 'Scroll — it works',
      cta: 'Quote this machine',
      points: ['Front loader + bucket', 'Rear excavator arm', 'Four-wheel site mobility'],
    },
    fleet: {
      eyebrow: 'The fleet',
      title: 'Six categories. One phone number.',
      sub: 'Choose a machine and it goes straight into your quote — or simply call and describe the job.',
      quoteBtn: 'Quote this machine',
      interactive: 'Interactive 3D — in this section',
      excavator3d: { title: 'Excavators, up close — in 3D.', hint: 'Drag to rotate · it turns on its own' },
    },
    why: {
      eyebrow: 'Why Al Manar',
      title: 'Why builders call us first.',
      items: [
        { t: 'One call, everything', d: 'Machine, operator and delivery arranged in a single conversation.' },
        { t: 'Operator included', d: 'Our experienced operators and drivers come with every hire, as standard.' },
        { t: 'Delivered to site', d: 'Transport to sites across Kuwait — and collection when you are done.' },
        { t: 'Terms that flex', d: 'Day, weekly and full project-contract terms, agreed clearly up front.' },
      ],
    },
    quote: {
      eyebrow: 'Get a quote',
      title: 'Tell us the job. We\u2019ll price it.',
      sub: 'Machine, site, dates — that\u2019s all we need. Send the form and WhatsApp opens with your request ready to go.',
      formTitle: 'Request a quote',
      machine: 'Machine',
      machinePlaceholder: 'Choose a machine…',
      other: 'Something else / not sure yet',
      period: 'Rental period',
      periods: ['A day', 'A few days', 'One week', 'A few weeks', 'Full project contract'],
      name: 'Your name', namePh: 'Full name',
      phone: 'Phone / WhatsApp', phonePh: '+965 …',
      site: 'Site location', sitePh: 'Area / city in Kuwait',
      notes: 'Anything else? (optional)', notesPh: 'Dates, access, working hours…',
      send: 'Send via WhatsApp',
      note: 'Opens WhatsApp with your request pre-filled — just press send.',
      waIntro: 'Hello Al Manar Al Asriya, I would like a quote:',
      waMachine: 'Machine', waPeriod: 'Rental period', waName: 'Name', waPhone: 'Phone', waSite: 'Site', waNotes: 'Details',
      contact: {
        addressL: 'Office', address: 'Jaleeb Al-Shuyukh, Al-Sahli Complex, 3rd Floor, Office 47/1, Kuwait',
        phoneL: 'WhatsApp / Main line', phone2L: 'Second line', emailL: 'Email',
      },
    },
    footer: {
      tag: 'Heavy machinery rental in Kuwait — with operator, delivered to your site.',
      rights: 'Al Manar Al Asriya — General Trading & Contracting Co. All rights reserved.',
      since: 'Since 2002 · Jaleeb Al-Shuyukh, Kuwait',
      credits: '3D model "JCB Backhoe Loader 3CX Tractor" by Kyle Burton (Sketchfab), CC BY 4.0. Fleet excavator: textured 3D model, rigged in-house.',
      back: 'Back to top',
    },
  },

  ar: {
    dir: 'rtl',
    nav: { fleet: 'الأسطول', services: 'الخدمات', jcb: 'JCB', why: 'لماذا نحن', about: 'الشركة', contact: 'تواصل معنا', quote: 'اطلب عرض سعر', langName: 'English', menu: 'القائمة', close: 'إغلاق' },
    hero: {
      eyebrow: 'تأجير معدات ثقيلة — الكويت',
      titleA: 'معدات ثقيلة،',
      titleB: 'جاهزة متى ما احتجتها.',
      sub: 'حفارات ولودرات ومعدات JCB وCAT ورافعات وخلاطات خرسانة — تأجير باليوم أو الأسبوع أو بعقد المشروع الكامل، مع مشغّلنا في الكابينة وتوصيل إلى موقعك في أي مكان بالكويت.',
      cta1: 'اطلب عرض سعر عبر واتساب',
      cta2: 'تصفح الأسطول',
      cta3: 'اطلب سعر الـ JCB',
      accent: 'منذ 2002 — جليب الشيوخ، الكويت',
      points: ['لودر أمامي + دلو', 'ذراع حفر خلفي', 'حركة رباعية في الموقع'],
      hudUnit: 'المعدة ٠١ — حفار لودر JCB',
      hudDrag: 'اسحب للتدوير',
      hudScroll: 'مرّر — واقترب أكثر',
      hudCoords: '29.38°N / 47.99°E — الكويت',
      readout: { slew: 'الدوران', camera: 'الكاميرا' },
      facts: [
        { v: 'منذ 2002', l: 'تجارة ومقاولات في الكويت' },
        { v: '06', l: 'فئات من المعدات تحت سقف واحد' },
        { v: 'يوم · أسبوع · مشروع', l: 'شروط تأجير مرنة' },
        { v: 'جليب الشيوخ', l: 'الكويت — توصيل إلى موقعك' },
      ],
    },
    about: {
      eyebrow: 'الشركة',
      title: 'ندعم مشاريع الكويت منذ عام 2002.',
      p1: 'المنار العصرية — شركة تجارة عامة ومقاولات — تزوّد مشاريع البناء في جميع أنحاء الكويت بالمعدات الثقيلة منذ عام 2002. مكالمة واحدة تجمع المعدة ومشغّلها وتوصيلها معاً.',
      p2: 'من حفر ليوم واحد إلى عقد مشروع كامل، تبقى المعادلة بسيطة: المعدة المناسبة، ومشغّل ذو خبرة في الكابينة، ونقل إلى موقعك نتولاه نحن.',
      values: [
        { t: 'أسطول جاهز', d: 'ست فئات من المعدات — من الحفارات إلى الخلاطات — تحت سقف واحد.' },
        { t: 'المشغّل مشمول', d: 'كل تأجير يصلك مع مشغّل أو سائق ذي خبرة من فريقنا.' },
        { t: 'شروط مرنة', d: 'باليوم أو الأسبوع أو بعقد مشروع كامل — باتفاق واضح قبل بدء العمل.' },
      ],
    },
    services: {
      eyebrow: 'الخدمات',
      title: 'ثلاثة وعود نفي بها في كل تأجير.',
      scenes: [
        {
          n: '01', tag: 'مدة التأجير',
          t: 'باليوم. بالأسبوع. بالمشروع.',
          d: 'خندق ليومين أو مشروع لعامين — المدة تناسب العمل، وليس العكس. ابدأ قصيراً ومدّد متى ما كبر العمل.',
          specs: ['تأجير يومي', 'تأجير أسبوعي', 'عقد مشروع'],
        },
        {
          n: '02', tag: 'المشغّل',
          t: 'مشغّل في كل كابينة.',
          d: 'كل معدة تُورَّد مع مشغّل أو سائق ذي خبرة من فريقنا ضمن التأجير. المعدة تصل جاهزة للعمل، لا جاهزة للتعلّم عليها.',
          specs: ['مشغّلون ذوو خبرة', 'مشمول في التأجير', 'لا حاجة لترتيب طاقم'],
        },
        {
          n: '03', tag: 'التوصيل',
          t: 'توصيل إلى موقعك.',
          d: 'ننقل المعدة إلى موقعك في أي مكان بالكويت ونستلمها عند انتهاء التأجير. أنت تحدّد المكان — ونحن نتولى الطريق.',
          specs: ['لأي مكان في الكويت', 'النقل علينا', 'استلام عند الانتهاء'],
        },
      ],
    },
    jcb: {
      eyebrow: 'معدة مميزة — ثلاثي الأبعاد تفاعلي',
      title: 'حفار لودر JCB.',
      sub: 'معدتان في واحدة: لودر أمامي للنقل والتحميل، وذراع حفر خلفي للحفر. اسحب النموذج — ثم شاهدها تعمل.',
      hudDrag: 'اسحب للتدوير',
      hudAuto: 'مرّر — ستراها تعمل',
      cta: 'اطلب سعر هذه المعدة',
      points: ['لودر أمامي + دلو', 'ذراع حفر خلفي', 'حركة رباعية في الموقع'],
    },
    fleet: {
      eyebrow: 'الأسطول',
      title: 'ست فئات. رقم هاتف واحد.',
      sub: 'اختر معدة وستنتقل مباشرة إلى طلب عرض السعر — أو اتصل بنا وصف العمل ببساطة.',
      quoteBtn: 'اطلب سعر هذه المعدة',
      interactive: 'ثلاثي الأبعاد تفاعلي — في هذا القسم',
      excavator3d: { title: 'الحفارات عن قرب — بتقنية ثلاثية الأبعاد.', hint: 'اسحب للتدوير · تدور من تلقاء نفسها' },
    },
    why: {
      eyebrow: 'لماذا المنار',
      title: 'لماذا يتصل بنا المقاولون أولاً.',
      items: [
        { t: 'مكالمة واحدة، كل شيء', d: 'المعدة والمشغّل والتوصيل — كلها تُرتَّب في محادثة واحدة.' },
        { t: 'المشغّل مشمول', d: 'مشغّلونا وسائقونا ذوو الخبرة يأتون مع كل تأجير، بشكل قياسي.' },
        { t: 'توصيل إلى الموقع', d: 'نقل إلى المواقع في جميع أنحاء الكويت — واستلام عند انتهائك.' },
        { t: 'شروط مرنة', d: 'شروط يومية وأسبوعية وبعقود مشاريع كاملة، باتفاق واضح من البداية.' },
      ],
    },
    quote: {
      eyebrow: 'طلب عرض سعر',
      title: 'أخبرنا بالعمل. وسنعطيك السعر.',
      sub: 'المعدة والموقع والتواريخ — هذا كل ما نحتاجه. أرسل النموذج وسيفتح واتساب بطلبك جاهزاً للإرسال.',
      formTitle: 'اطلب عرض سعر',
      machine: 'المعدة',
      machinePlaceholder: 'اختر معدة…',
      other: 'شيء آخر / لست متأكداً بعد',
      period: 'مدة التأجير',
      periods: ['يوم واحد', 'بضعة أيام', 'أسبوع واحد', 'بضعة أسابيع', 'عقد مشروع كامل'],
      name: 'اسمك', namePh: 'الاسم الكامل',
      phone: 'الهاتف / واتساب', phonePh: '+965 …',
      site: 'موقع العمل', sitePh: 'المنطقة / المدينة في الكويت',
      notes: 'أي شيء آخر؟ (اختياري)', notesPh: 'التواريخ، الدخول، ساعات العمل…',
      send: 'أرسل عبر واتساب',
      note: 'يفتح واتساب بطلبك مكتوباً وجاهزاً — ما عليك سوى الضغط على إرسال.',
      waIntro: 'مرحباً المنار العصرية، أود طلب عرض سعر:',
      waMachine: 'المعدة', waPeriod: 'مدة التأجير', waName: 'الاسم', waPhone: 'الهاتف', waSite: 'الموقع', waNotes: 'تفاصيل',
      contact: {
        addressL: 'المكتب', address: 'جليب الشيوخ، مجمع السهلي، الطابق الثالث، مكتب 47/1، الكويت',
        phoneL: 'واتساب / الخط الرئيسي', phone2L: 'الخط الثاني', emailL: 'البريد الإلكتروني',
      },
    },
    footer: {
      tag: 'تأجير معدات ثقيلة في الكويت — مع المشغّل، وتوصيل إلى موقعك.',
      rights: 'المنار العصرية — شركة تجارة عامة ومقاولات. جميع الحقوق محفوظة.',
      since: 'منذ 2002 · جليب الشيوخ، الكويت',
      credits: 'النموذج ثلاثي الأبعاد «JCB Backhoe Loader 3CX Tractor» من تصميم Kyle Burton (Sketchfab)، برخصة CC BY 4.0. حفارة الأسطول: نموذج ثلاثي الأبعاد بخامات، جُهّز داخلياً.',
      back: 'العودة إلى الأعلى',
    },
  },
}

const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('am3-lang') || 'en' } catch { return 'en' }
  })
  useEffect(() => {
    const d = dict[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = d.dir
    try { localStorage.setItem('am3-lang', lang) } catch { /* private mode */ }
  }, [lang])
  const toggle = () => setLang(l => (l === 'en' ? 'ar' : 'en'))
  return <LangCtx.Provider value={{ lang, t: dict[lang], toggle }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}
