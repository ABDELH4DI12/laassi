// Projects for the Works page. Ibadati is real; the others are PLACEHOLDERS — replace them with your own.
//
// Text can be written once or per language: { en: "…", fr: "…", ar: "…" } (missing ones fall back to English).
//   image        a screenshot: put it in src/assets/works/ and import it at the top, e.g.
//                  import shopShot from "../assets/works/shop.jpg";
//                then use  image: shopShot
//                Without one, an illustrated jungle cover is drawn in the project's `hue`.
//   hue          0–360, tints the cover and the light behind the screenshot
//   github, link the GitHub repository and the live site (leave "" if there isn't one)
//   stack        the technologies, shown as chips with their icons
import ibadatiShot from "../assets/works/ibadati.jpg";

export const works = [
  {
    title: { en: "Ibadati", fr: "Ibadati", ar: "عبادتي" },
    year: "",
    role: { en: "Design & development", fr: "Design et développement", ar: "التصميم والتطوير" },
    description: {
      en: [
        "An Arabic Islamic platform that brings the Holy Quran, the Prophet's hadiths, scholarly lessons and prayer times together in one calm place.",
        "Recitation and tafsir for all 114 surahs, hadiths explained across 493 topics, video lessons, scholar profiles and prayer times by city, designed right-to-left in green and gold.",
      ],
      fr: [
        "Une plateforme islamique en arabe qui réunit le Saint Coran, les hadiths du Prophète, des cours de sciences religieuses et les horaires de prière dans un même espace apaisant.",
        "Récitation et tafsir des 114 sourates, hadiths expliqués à travers 493 thèmes, cours en vidéo, biographies de savants et horaires de prière par ville, le tout conçu de droite à gauche, en vert et or.",
      ],
      ar: [
        "منصة إسلامية عربية تجمع القرآن الكريم والأحاديث النبوية والدروس العلمية ومواقيت الصلاة في مكان واحد هادئ.",
        "تلاوة وتفسير لسور القرآن الـ114، وأحاديث مشروحة ضمن 493 تصنيفًا، ودروس مرئية، وتراجم للعلماء، ومواقيت الصلاة حسب المدينة، بتصميم عربي من اليمين إلى اليسار بالأخضر والذهبي.",
      ],
    },
    stack: ["React", "React Router", "Vite", "Supabase", "Aladhan API", "HadeethEnc API", "Vercel"],
    github: "", link: "https://www.ibadati.online/", image: ibadatiShot, hue: 168,
  },
  {
    title: { en: "Project two", fr: "Projet deux", ar: "المشروع الثاني" },
    year: "2025",
    role: { en: "Front-end", fr: "Front-end", ar: "الواجهة الأمامية" },
    description: {
      en: "What made this one interesting, and what you'd want someone to notice about it.",
      fr: "Ce qui rend ce projet intéressant, et ce que vous aimeriez qu’on y remarque.",
      ar: "ما الذي جعل هذا المشروع مميزًا، وما الذي تودّ أن يلاحظه من يراه.",
    },
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    github: "", link: "", image: null, hue: 38,
  },
  {
    title: { en: "Project three", fr: "Projet trois", ar: "المشروع الثالث" },
    year: "2024",
    role: { en: "Full-stack", fr: "Full-stack", ar: "تطوير متكامل" },
    description: {
      en: "Describe the stack, your part in it, and an outcome you're proud of.",
      fr: "Décrivez les technologies, votre rôle et un résultat dont vous êtes fier.",
      ar: "صِف التقنيات المستخدمة ودورك فيه ونتيجة تفخر بها.",
    },
    stack: ["Python", "FastAPI", "Redis", "Docker"],
    github: "", link: "", image: null, hue: 178,
  },
  {
    title: { en: "Project four", fr: "Projet quatre", ar: "المشروع الرابع" },
    year: "2024",
    role: { en: "Product design", fr: "Design produit", ar: "تصميم المنتجات" },
    description: {
      en: "A sentence or two about the idea and how it turned out.",
      fr: "Une ou deux phrases sur l’idée et ce qu’elle est devenue.",
      ar: "جملة أو جملتان عن الفكرة وكيف تحقّقت.",
    },
    stack: ["Figma", "React", "Framer Motion"],
    github: "", link: "", image: null, hue: 300,
  },
  {
    title: { en: "Project five", fr: "Projet cinq", ar: "المشروع الخامس" },
    year: "2023",
    role: { en: "Back-end", fr: "Back-end", ar: "الواجهة الخلفية" },
    description: {
      en: "Scale, performance, reliability: whatever this project was about.",
      fr: "Montée en charge, performance, fiabilité : ce qui faisait l’essentiel de ce projet.",
      ar: "التوسّع، الأداء، الموثوقية: أيًّا كان جوهر هذا المشروع.",
    },
    stack: ["Go", "gRPC", "Kubernetes"],
    github: "", link: "", image: null, hue: 95,
  },
  {
    title: { en: "Project six", fr: "Projet six", ar: "المشروع السادس" },
    year: "2023",
    role: { en: "Side project", fr: "Projet personnel", ar: "مشروع جانبي" },
    description: {
      en: "Something you built for fun or to learn.",
      fr: "Quelque chose que vous avez créé pour le plaisir ou pour apprendre.",
      ar: "شيء بنيته للمتعة أو للتعلّم.",
    },
    stack: ["Rust", "WebAssembly"],
    github: "", link: "", image: null, hue: 18,
  },
];
