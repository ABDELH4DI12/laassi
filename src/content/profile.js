// Your profile. Placeholder text — replace it with your own details.
//
// Any text can be written once ("React", the same in every language) or per language:
//   { en: "Hello", fr: "Bonjour", ar: "مرحبًا" }
// A missing language falls back to English. Lists can have as many entries as you like.

export const profile = {
  name: { en: "Abdelhadi", fr: "Abdelhadi", ar: "عبد الهادي" },
  role: {
    en: "Your role, e.g. Full-stack developer",
    fr: "Votre rôle, par ex. développeur full-stack",
    ar: "دورك، مثلًا: مطوّر ويب متكامل",
  },
  location: { en: "City, Country", fr: "Ville, Pays", ar: "المدينة، البلد" },
  // Shown with a pulsing dot; "" hides it.
  status: { en: "Available for work", fr: "Disponible pour de nouveaux projets", ar: "متاح لمشاريع جديدة" },
  photo: null,   // e.g. import photo from "../assets/me.jpg", then photo: photo

  about: {
    en: [
      "Write a short introduction here: who you are, what you build, and what you care about.",
      "A second paragraph can cover what you're looking for next, or how to reach you.",
    ],
    fr: [
      "Écrivez ici une courte présentation : qui vous êtes, ce que vous créez et ce qui compte pour vous.",
      "Un second paragraphe peut dire ce que vous cherchez ensuite, ou comment vous joindre.",
    ],
    ar: [
      "اكتب هنا تعريفًا قصيرًا بنفسك: من أنت، وماذا تبني، وما الذي يهمّك.",
      "ويمكن لفقرة ثانية أن تذكر ما تتطلع إليه في خطوتك القادمة، أو كيف يمكن التواصل معك.",
    ],
  },

  // Quick facts on the About page: [label, value]
  facts: [
    [{ en: "Based in", fr: "Basé à", ar: "مقيم في" }, { en: "City, Country", fr: "Ville, Pays", ar: "المدينة، البلد" }],
    [{ en: "Focus", fr: "Spécialité", ar: "التخصص" }, { en: "What you do best", fr: "Ce que vous faites de mieux", ar: "أكثر ما تُتقنه" }],
    [{ en: "Currently", fr: "En ce moment", ar: "حاليًا" }, { en: "What you're working on", fr: "Ce sur quoi vous travaillez", ar: "ما تعمل عليه الآن" }],
  ],

  // Newest first, as on a CV. The Experience metro line runs oldest → newest.
  // Mark your present job with current: true.
  experience: [
    {
      role: { en: "Job title", fr: "Intitulé du poste", ar: "المسمى الوظيفي" },
      place: { en: "Company name", fr: "Nom de l’entreprise", ar: "اسم الشركة" },
      period: { en: "2024 — Present", fr: "2024 — Aujourd’hui", ar: "2024 — حتى الآن" },
      current: true,
      text: {
        en: "One or two lines on what you worked on and the difference it made.",
        fr: "Une ou deux lignes sur ce que vous avez fait et la différence que cela a apportée.",
        ar: "سطر أو سطران عمّا عملت عليه والأثر الذي أحدثته.",
      },
    },
    {
      role: { en: "Previous job title", fr: "Poste précédent", ar: "المنصب السابق" },
      place: { en: "Company name", fr: "Nom de l’entreprise", ar: "اسم الشركة" },
      period: "2022 — 2024",
      text: {
        en: "Key projects, technologies used, and results.",
        fr: "Projets clés, technologies utilisées et résultats.",
        ar: "أبرز المشاريع، والتقنيات المستخدمة، والنتائج.",
      },
    },
    {
      role: { en: "First job title", fr: "Premier poste", ar: "أول وظيفة" },
      place: { en: "Company name", fr: "Nom de l’entreprise", ar: "اسم الشركة" },
      period: "2020 — 2022",
      text: {
        en: "Where it started: what you learned and shipped.",
        fr: "Là où tout a commencé : ce que vous avez appris et livré.",
        ar: "حيث كانت البداية: ما تعلّمته وما أنجزته.",
      },
    },
  ],

  // EXAMPLE skills — replace them with your own. Each group is a constellation on the
  // Skills page. level: 1 (learning) to 5 (expert) sets the star's size and brightness.
  // Icons are found from the name ("Node.js", "Tailwind CSS"...); set icon: "slug" to
  // choose one (see src/pages/techIcons.jsx). A skill without an icon shows a plain star.
  skills: [
    {
      group: { en: "Front-end", fr: "Front-end", ar: "الواجهات الأمامية" },
      items: [
        { name: "React", level: 5 }, { name: "JavaScript", level: 5 }, { name: "TypeScript", level: 4 },
        { name: "HTML", level: 5 }, { name: "CSS", level: 4 }, { name: "Vite", level: 4 },
      ],
    },
    {
      group: { en: "Back-end", fr: "Back-end", ar: "الواجهات الخلفية" },
      items: [
        { name: "Node.js", level: 4 }, { name: "Supabase", level: 4 }, { name: "PostgreSQL", level: 3 },
        { name: "Python", level: 3 },
      ],
    },
    {
      group: { en: "Tools", fr: "Outils", ar: "الأدوات" },
      items: [
        { name: "Git", level: 4 }, { name: "GitHub", level: 4 }, { name: "Vercel", level: 4 },
        { name: "Docker", level: 2 },
      ],
    },
    {
      group: { en: "Design", fr: "Design", ar: "التصميم" },
      items: [
        { name: "Figma", level: 4 }, { name: "Tailwind CSS", level: 4 },
        { name: { en: "UI design", fr: "Design d’interface", ar: "تصميم الواجهات" }, level: 4 },
      ],
    },
  ],

  education: [
    {
      degree: { en: "Degree or certificate", fr: "Diplôme ou certificat", ar: "الشهادة أو الدبلوم" },
      school: { en: "School or university", fr: "École ou université", ar: "المدرسة أو الجامعة" },
      period: "2019 — 2022",
      text: {
        en: "Field of study, honours, or a notable project.",
        fr: "Domaine d’études, mention ou projet marquant.",
        ar: "مجال الدراسة، أو التقدير، أو مشروع بارز.",
      },
    },
    {
      degree: { en: "Earlier diploma", fr: "Diplôme précédent", ar: "شهادة سابقة" },
      school: { en: "School name", fr: "Nom de l’établissement", ar: "اسم المؤسسة" },
      period: "2016 — 2019",
      text: { en: "Speciality or a highlight.", fr: "Spécialité ou point fort.", ar: "التخصص أو أبرز ما فيه." },
    },
  ],

  // level: 1 (basic) to 5 (native). hello: a greeting in that language, shown when you tune in.
  languages: [
    {
      name: { en: "Arabic", fr: "Arabe", ar: "العربية" }, level: 5, hello: "مرحبًا",
      note: { en: "Native", fr: "Langue maternelle", ar: "اللغة الأم" },
    },
    {
      name: { en: "French", fr: "Français", ar: "الفرنسية" }, level: 4, hello: "Bonjour",
      note: { en: "Fluent", fr: "Courant", ar: "بطلاقة" },
    },
    {
      name: { en: "English", fr: "Anglais", ar: "الإنجليزية" }, level: 4, hello: "Hello",
      note: { en: "Professional", fr: "Professionnel", ar: "مستوى مهني" },
    },
  ],
};
