// Your profile (from your LinkedIn). Text can be written once ("React", the same in
// every language) or per language: { en: "…", fr: "…", ar: "…" }. A missing language
// falls back to English. Lists can have as many entries as you like.
import photo from "../assets/me.jpg";

export const profile = {
  name: { en: "Abdelhadi Laassi", fr: "Abdelhadi Laassi", ar: "عبد الهادي لعاصي" },
  role: {
    en: "Odoo Developer · Python, OWL & full-stack web",
    fr: "Développeur Odoo · Python, OWL et web full-stack",
    ar: "مطوّر Odoo · Python وOWL وتطوير الويب المتكامل",
  },
  location: { en: "Casablanca, Morocco", fr: "Casablanca, Maroc", ar: "الدار البيضاء، المغرب" },
  // Shown with a pulsing dot; "" hides it.
  status: { en: "Odoo Developer at TECHPAL", fr: "Développeur Odoo chez TECHPAL", ar: "مطوّر Odoo في TECHPAL" },
  photo,
  links: {
    linkedin: "https://www.linkedin.com/in/abdelhadi-laassi-65606431a",
  },

  // The big statement on the About page.
  headline: {
    en: "I build Odoo ERP solutions that run businesses every day.",
    fr: "Je conçois des solutions ERP Odoo qui font tourner les entreprises au quotidien.",
    ar: "أبني حلول Odoo ERP تُدار بها الشركات كل يوم.",
  },
  since: 2024,   // first professional role: used for "years of experience"
  topSkills: ["Odoo", "Python", "OWL", "PostgreSQL", "XML", "JavaScript", "React.js", "Laravel"],

  about: {
    en: [
      "I'm an Odoo developer: I build, customise and deploy Odoo ERP modules that fit the way a business actually works. Day to day I write Python on the server, XML views, forms and dashboards, and OWL and JavaScript on the front end, then host and deploy projects on the cloud.",
      "My full-stack background in React and Laravel means I can also connect Odoo to the rest of a company's tools, with clean APIs, solid databases and interfaces people enjoy using.",
    ],
    fr: [
      "Je suis développeur Odoo : je conçois, personnalise et déploie des modules ERP Odoo adaptés à la façon dont une entreprise fonctionne vraiment. Au quotidien, j’écris du Python côté serveur, des vues, formulaires et tableaux de bord en XML, et du OWL et JavaScript côté interface, puis j’héberge et déploie les projets dans le cloud.",
      "Mon expérience full-stack en React et Laravel me permet aussi de relier Odoo au reste des outils d’une entreprise, avec des API propres, des bases de données solides et des interfaces agréables à utiliser.",
    ],
    ar: [
      "أنا مطوّر Odoo: أبني موديولات Odoo ERP وأخصّصها وأنشرها لتناسب الطريقة التي تعمل بها الشركة فعلًا. أكتب يوميًا Python في الخادم، وواجهات ونماذج ولوحات تحكّم بـ XML، وOWL وJavaScript في الواجهة، ثم أستضيف المشاريع وأنشرها على السحابة.",
      "وخبرتي في التطوير المتكامل بـ React وLaravel تمكّنني أيضًا من ربط Odoo ببقية أدوات الشركة، عبر واجهات برمجية نظيفة وقواعد بيانات متينة وواجهات يستمتع الناس باستخدامها.",
    ],
  },

  // Quick facts on the About page: [label, value]
  facts: [
    [{ en: "Based in", fr: "Basé à", ar: "مقيم في" }, { en: "Casablanca, Morocco", fr: "Casablanca, Maroc", ar: "الدار البيضاء، المغرب" }],
    [{ en: "Focus", fr: "Spécialité", ar: "التخصص" }, "Odoo · Python · OWL"],
    [{ en: "Currently", fr: "En ce moment", ar: "حاليًا" }, { en: "Odoo Developer at TECHPAL", fr: "Développeur Odoo chez TECHPAL", ar: "مطوّر Odoo في TECHPAL" }],
  ],

  // Newest first, as on a CV. The Experience metro line runs oldest → newest.
  experience: [
    {
      role: { en: "Web Developer", fr: "Développeur web", ar: "مطوّر ويب" },
      place: "TECHPAL", start: "2025-03", type: { en: "Full-time · On-site", fr: "Temps plein · Sur site", ar: "دوام كامل · حضوري" },
      tech: ["Odoo", "Python", "OWL", "XML", "JavaScript", "PostgreSQL", "Git"],
      highlights: {
        en: [
          "Develop and customise Odoo modules in Python, XML and JavaScript to fit each client's business.",
          "Design custom views, forms and dashboards that make daily operations faster.",
          "Build front-end components and interfaces with OWL, the Odoo Web Library.",
          "Integrate complex business logic on the server and optimise existing apps.",
          "Host and deploy Odoo projects on the cloud for scalability, security and uptime.",
        ],
        fr: [
          "Je développe et personnalise des modules Odoo en Python, XML et JavaScript, adaptés au métier de chaque client.",
          "Je conçois des vues, formulaires et tableaux de bord sur mesure qui accélèrent le travail quotidien.",
          "Je crée des composants et interfaces avec OWL, la bibliothèque web d’Odoo.",
          "J’intègre une logique métier complexe côté serveur et j’optimise les applications existantes.",
          "J’héberge et déploie les projets Odoo dans le cloud : évolutivité, sécurité et disponibilité.",
        ],
        ar: [
          "أطوّر موديولات Odoo وأخصّصها بـ Python وXML وJavaScript لتناسب نشاط كل عميل.",
          "أصمّم واجهات ونماذج ولوحات تحكّم مخصّصة تُسرّع العمل اليومي.",
          "أبني مكوّنات وواجهات بـ OWL، مكتبة الويب الخاصة بـ Odoo.",
          "أدمج منطق أعمال معقّدًا في الخادم وأحسّن أداء التطبيقات القائمة.",
          "أستضيف مشاريع Odoo وأنشرها على السحابة لضمان التوسّع والأمان والتوفّر.",
        ],
      },
      period: { en: "Mar 2025 — Present", fr: "Mars 2025 — Aujourd’hui", ar: "مارس 2025 — حتى الآن" },
      current: true,
      text: {
        en: "Full-time. I develop and customise Odoo modules in Python, XML, JavaScript and OWL, build custom views, forms and dashboards, integrate complex business logic, optimise existing apps, and host and deploy Odoo projects on the cloud.",
        fr: "Temps plein. Je développe et personnalise des modules Odoo en Python, XML, JavaScript et OWL, je crée des vues, formulaires et tableaux de bord sur mesure, j’intègre une logique métier complexe, j’optimise les applications existantes et j’héberge et déploie les projets Odoo dans le cloud.",
        ar: "دوام كامل. أطوّر وأخصّص موديولات Odoo بـ Python وXML وJavaScript وOWL، وأبني واجهات ونماذج ولوحات تحكّم مخصّصة، وأدمج منطق أعمال معقّدًا، وأحسّن التطبيقات القائمة، وأستضيف مشاريع Odoo وأنشرها على السحابة.",
      },
    },
    {
      role: { en: "Web Developer (Intern)", fr: "Développeur web (stage)", ar: "مطوّر ويب (تدريب)" },
      place: "TECHPAL", start: "2024-07", end: "2025-02", type: { en: "Internship · On-site", fr: "Stage · Sur site", ar: "تدريب · حضوري" },
      tech: ["Odoo", "Python", "OWL", "XML", "JavaScript"],
      highlights: {
        en: [
          "Developed and customised Odoo modules for specific business requirements.",
          "Built custom views, forms and dashboards, and worked on OWL front-end components.",
          "Debugged and optimised existing Odoo applications to improve performance.",
          "Worked with cross-functional teams on tailored ERP solutions.",
        ],
        fr: [
          "Développement et personnalisation de modules Odoo pour des besoins métier précis.",
          "Création de vues, formulaires et tableaux de bord, et de composants front-end en OWL.",
          "Débogage et optimisation d’applications Odoo existantes.",
          "Travail en équipes pluridisciplinaires sur des solutions ERP sur mesure.",
        ],
        ar: [
          "تطوير موديولات Odoo وتخصيصها لاحتياجات أعمال محدّدة.",
          "بناء واجهات ونماذج ولوحات تحكّم، ومكوّنات أمامية بـ OWL.",
          "تصحيح تطبيقات Odoo القائمة وتحسين أدائها.",
          "العمل مع فرق متعددة التخصصات على حلول ERP مخصّصة.",
        ],
      },
      period: { en: "Jul 2024 — Feb 2025", fr: "Juil. 2024 — Févr. 2025", ar: "يوليوز 2024 — فبراير 2025" },
      text: {
        en: "Internship. Developed and customised Odoo modules, built custom views and dashboards, worked with OWL on the front end, debugged and optimised existing applications, and collaborated with cross-functional teams on tailored ERP solutions.",
        fr: "Stage. Développement et personnalisation de modules Odoo, création de vues et de tableaux de bord sur mesure, interfaces en OWL, débogage et optimisation d’applications existantes, et travail en équipes pluridisciplinaires sur des solutions ERP sur mesure.",
        ar: "تدريب. تطوير وتخصيص موديولات Odoo، وبناء واجهات ولوحات تحكّم مخصّصة، والعمل بـ OWL في الواجهة، وتصحيح التطبيقات القائمة وتحسينها، والتعاون مع فرق متعددة التخصصات على حلول ERP مخصّصة.",
      },
    },
    {
      role: { en: "Frontend Developer (Intern)", fr: "Développeur front-end (stage)", ar: "مطوّر واجهات أمامية (تدريب)" },
      place: "Brighten Consulting", start: "2024-04", end: "2024-05", type: { en: "Internship · On-site", fr: "Stage · Sur site", ar: "تدريب · حضوري" },
      tech: ["HTML", "CSS", "JavaScript", "jQuery"],
      highlights: {
        en: [
          "Built the front end of a company website in HTML, CSS and JavaScript.",
          "Applied modern UI/UX principles for a responsive, user-friendly design.",
          "Ensured cross-browser compatibility and optimised performance.",
        ],
        fr: [
          "Réalisation du front-end du site d’une entreprise en HTML, CSS et JavaScript.",
          "Application de principes UI/UX modernes pour un design responsive et agréable.",
          "Compatibilité multi-navigateurs et optimisation des performances.",
        ],
        ar: [
          "إنجاز الواجهة الأمامية لموقع شركة بـ HTML وCSS وJavaScript.",
          "تطبيق مبادئ UI/UX حديثة لتصميم متجاوب وسهل الاستخدام.",
          "ضمان التوافق مع كل المتصفحات وتحسين الأداء.",
        ],
      },
      period: { en: "Apr 2024 — May 2024", fr: "Avr. 2024 — Mai 2024", ar: "أبريل 2024 — ماي 2024" },
      text: {
        en: "Internship, on-site. Built the front end of a company website in HTML, CSS and JavaScript: responsive, user-friendly, cross-browser compatible and optimised for performance.",
        fr: "Stage sur site. Réalisation du front-end du site d’une entreprise en HTML, CSS et JavaScript : responsive, agréable à utiliser, compatible avec tous les navigateurs et optimisé.",
        ar: "تدريب حضوري. إنجاز الواجهة الأمامية لموقع شركة بـ HTML وCSS وJavaScript: متجاوبة وسهلة الاستخدام ومتوافقة مع كل المتصفحات ومحسّنة الأداء.",
      },
    },
  ],

  // Skills, shown as a garden of cards on the Skills page (the first group is featured).
  // level: 1 (learning) to 5 (expert). icon: a slug from src/pages/techIcons.jsx when
  // the name alone doesn't find one. Skills without an icon show a leaf.
  skills: [
    {
      id: "odoo",
      group: { en: "Odoo stack", fr: "Stack Odoo", ar: "منظومة Odoo" },
      note: { en: "ERP modules, from models to views to deployment", fr: "Modules ERP, des modèles aux vues jusqu’au déploiement", ar: "موديولات ERP من النماذج إلى الواجهات حتى النشر" },
      items: [
        { name: "Odoo", level: 5, icon: "odoo" }, { name: "Python", level: 5 }, { name: "OWL", level: 4 },
        { name: "XML", level: 4 }, { name: "PostgreSQL", level: 4 }, { name: "QWeb", level: 4 },
      ],
    },
    {
      id: "front",
      group: { en: "Front-end", fr: "Front-end", ar: "الواجهات الأمامية" },
      note: { en: "Interfaces people enjoy using", fr: "Des interfaces agréables à utiliser", ar: "واجهات يستمتع الناس باستخدامها" },
      items: [
        { name: "React.js", level: 5 }, { name: "JavaScript", level: 5 }, { name: "HTML", level: 5 },
        { name: "CSS", level: 5 }, { name: "Redux.js", level: 3 }, { name: "jQuery", level: 3 },
      ],
    },
    {
      id: "back",
      group: { en: "Back-end", fr: "Back-end", ar: "الواجهات الخلفية" },
      note: { en: "APIs, data and server logic", fr: "API, données et logique serveur", ar: "واجهات برمجية وبيانات ومنطق الخادم" },
      items: [
        { name: "Laravel", level: 5 }, { name: "PHP", level: 4 }, { name: "Node.js", level: 3 },
        { name: "Express.js", level: 3 }, { name: "MySQL", level: 4 },
      ],
    },
    {
      id: "ops",
      group: { en: "DevOps & deployment", fr: "DevOps et déploiement", ar: "DevOps والنشر" },
      note: { en: "Shipping apps and keeping them running", fr: "Livrer les applications et les garder en ligne", ar: "إطلاق التطبيقات وإبقاؤها تعمل" },
      items: [
        { name: "Docker", level: 4 }, { name: "Nginx", level: 4 }, { name: "Jenkins", level: 3 },
        { name: "CI/CD", level: 4, icon: "githubactions" }, { name: "Linux", level: 4 }, { name: "Git", level: 5 },
        { name: { en: "Cloud hosting", fr: "Hébergement cloud", ar: "الاستضافة السحابية" }, level: 4 },
      ],
    },
    {
      id: "games",
      group: { en: "Games", fr: "Jeux vidéo", ar: "الألعاب" },
      note: { en: "Where I play with code", fr: "Là où je joue avec le code", ar: "حيث ألعب بالبرمجة" },
      items: [{ name: "Unity", level: 3 }, { name: "C#", level: 3 }],
    },
    {
      id: "craft",
      group: { en: "Craft", fr: "Méthodes", ar: "منهجية العمل" },
      note: { en: "How I plan and work", fr: "Ma façon de concevoir et de travailler", ar: "طريقتي في التخطيط والعمل" },
      items: [
        { name: "UML", level: 3 }, { name: { en: "Agile", fr: "Agile", ar: "منهجية Agile" }, level: 4 },
        { name: { en: "Responsive design", fr: "Design responsive", ar: "التصميم المتجاوب" }, level: 5 },
      ],
    },
  ],

  education: [
    {
      degree: { en: "Specialised Technician in Digital Development", fr: "Technicien spécialisé en développement digital", ar: "تقني متخصص في التنمية الرقمية" },
      school: "ISTAG Sidi Moumen",
      skills: ["JavaScript", "React.js", "Node.js", "Express.js", "Laravel", "PHP", "Python", "MySQL", "UML"],
      period: "2022 — 2024",
      text: {
        en: "Web and software development: JavaScript, React, Node.js, Express, Laravel, PHP, Python, SQL and UML.",
        fr: "Développement web et logiciel : JavaScript, React, Node.js, Express, Laravel, PHP, Python, SQL et UML.",
        ar: "تطوير الويب والبرمجيات: JavaScript وReact وNode.js وExpress وLaravel وPHP وPython وSQL وUML.",
      },
    },
    {
      degree: { en: "Baccalaureate", fr: "Baccalauréat", ar: "شهادة الباكالوريا" },
      school: { en: "Lycée Abderrahmane Belkourchi", fr: "Lycée Abderrahmane Belkourchi", ar: "ثانوية عبد الرحمان بلقرشي" },
      period: "2022",
      text: { en: "High-school diploma.", fr: "Diplôme de fin d’études secondaires.", ar: "شهادة نهاية الدراسة الثانوية." },
    },
  ],

  // level: 1 (basic) to 5 (native). hello: a greeting in that language, shown when you tune in.
  languages: [
    {
      name: { en: "Arabic", fr: "Arabe", ar: "العربية" }, level: 5, hello: "مرحبًا", native: "العربية",
      note: { en: "Native", fr: "Langue maternelle", ar: "اللغة الأم" },
    },
    {
      name: { en: "French", fr: "Français", ar: "الفرنسية" }, level: 4, hello: "Bonjour", native: "Français",
      note: { en: "Fluent", fr: "Courant", ar: "بطلاقة" },
    },
    {
      name: { en: "English", fr: "Anglais", ar: "الإنجليزية" }, level: 4, hello: "Hello", native: "English",
      note: { en: "Professional", fr: "Professionnel", ar: "مستوى مهني" },
    },
  ],
};
