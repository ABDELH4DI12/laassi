// Films for the WatchList cinema.
// Text can be written once or per language: { en: "…", fr: "…", ar: "…" } (missing ones fall back to English).
//   type    "film" | "series"
//   rating  0–5 stars (0 shows "Not rated yet")
//   note    a line under the title: a short synopsis, or your own review
//   poster  the poster image, imported below
//   hue     0–360, the colour of the glow around the screen (taken from the poster)
import papillon from "../assets/watchlist/papillon.jpg";
import shawshank from "../assets/watchlist/shawshank.jpg";
import oppenheimer from "../assets/watchlist/oppenheimer.jpg";
import darkKnight from "../assets/watchlist/dark-knight.jpg";
import goodWillHunting from "../assets/watchlist/good-will-hunting.jpg";
import moneyball from "../assets/watchlist/moneyball.jpg";
import revenant from "../assets/watchlist/revenant.jpg";
import iSawTheDevil from "../assets/watchlist/i-saw-the-devil.jpg";
import memoriesOfMurder from "../assets/watchlist/memories-of-murder.jpg";
import parasite from "../assets/watchlist/parasite.jpg";

export const watchlist = [
  {
    title: { en: "Papillon", fr: "Papillon", ar: "بابيون" }, year: "1973", type: "film",
    by: { en: "Franklin J. Schaffner", ar: "فرانكلين جيه. شافنر" }, rating: 0, poster: papillon, hue: 20,
    note: {
      en: "A safecracker sent to a French Guiana penal colony never stops planning his escape.",
      fr: "Un perceur de coffres envoyé au bagne de Guyane ne cesse jamais de préparer son évasion.",
      ar: "لصّ خزائن يُرسَل إلى سجن في غويانا الفرنسية ولا يتوقف أبدًا عن التخطيط للهرب.",
    },
  },
  {
    title: { en: "The Shawshank Redemption", fr: "Les Évadés", ar: "الخلاص من شاوشانك" }, year: "1994", type: "film",
    by: { en: "Frank Darabont", ar: "فرانك دارابونت" }, rating: 0, poster: shawshank, hue: 30,
    note: {
      en: "A banker serving a life sentence holds on to hope and an unlikely friendship over two decades.",
      fr: "Un banquier condamné à perpétuité s’accroche à l’espoir et à une amitié inattendue pendant vingt ans.",
      ar: "مصرفي محكوم بالسجن المؤبد يتمسّك بالأمل وبصداقة غير متوقعة على مدى عشرين عامًا.",
    },
  },
  {
    title: { en: "Oppenheimer", fr: "Oppenheimer", ar: "أوبنهايمر" }, year: "2023", type: "film",
    by: { en: "Christopher Nolan", ar: "كريستوفر نولان" }, rating: 0, poster: oppenheimer, hue: 20,
    note: {
      en: "The physicist behind the atomic bomb, and the weight of what he created.",
      fr: "Le physicien derrière la bombe atomique, et le poids de ce qu’il a créé.",
      ar: "الفيزيائي الذي صنع القنبلة الذرية، وثقل ما أوجده.",
    },
  },
  {
    title: { en: "The Dark Knight", fr: "The Dark Knight : Le Chevalier noir", ar: "فارس الظلام" }, year: "2008", type: "film",
    by: { en: "Christopher Nolan", ar: "كريستوفر نولان" }, rating: 0, poster: darkKnight, hue: 200,
    note: {
      en: "Batman faces the Joker, an agent of chaos who pushes Gotham to its limits.",
      fr: "Batman affronte le Joker, un agent du chaos qui pousse Gotham à ses limites.",
      ar: "باتمان في مواجهة الجوكر، رسول الفوضى الذي يدفع غوثام إلى حافتها.",
    },
  },
  {
    title: { en: "Good Will Hunting", fr: "Will Hunting", ar: "غود ويل هانتنغ" }, year: "1997", type: "film",
    by: { en: "Gus Van Sant", ar: "غاس فان سانت" }, rating: 0, poster: goodWillHunting, hue: 40,
    note: {
      en: "A self-taught genius working as a janitor learns to face his past with the help of a therapist.",
      fr: "Un génie autodidacte, agent d’entretien, apprend à affronter son passé avec l’aide d’un thérapeute.",
      ar: "عبقري علّم نفسه بنفسه ويعمل عامل نظافة، يتعلّم مواجهة ماضيه بمساعدة معالج نفسي.",
    },
  },
  {
    title: { en: "Moneyball", fr: "Le Stratège", ar: "كرة المال" }, year: "2011", type: "film",
    by: { en: "Bennett Miller", ar: "بينيت ميلر" }, rating: 0, poster: moneyball, hue: 80,
    note: {
      en: "A baseball manager with no budget rebuilds his team using statistics.",
      fr: "Un manager de baseball sans budget reconstruit son équipe grâce aux statistiques.",
      ar: "مدير فريق بيسبول بلا ميزانية يعيد بناء فريقه بالاعتماد على الإحصاء.",
    },
  },
  {
    title: { en: "The Revenant", fr: "The Revenant", ar: "العائد" }, year: "2015", type: "film",
    by: { en: "Alejandro G. Iñárritu", ar: "أليخاندرو غونزاليس إيناريتو" }, rating: 0, poster: revenant, hue: 220,
    note: {
      en: "Left for dead in the frozen wilderness, a frontiersman fights his way back.",
      fr: "Laissé pour mort dans une nature glacée, un trappeur se bat pour revenir.",
      ar: "رجل يُترك ليموت في البرية المتجمّدة، فيشقّ طريق العودة بكل ما فيه.",
    },
  },
  {
    title: { en: "I Saw the Devil", fr: "J’ai rencontré le Diable", ar: "رأيت الشيطان" }, year: "2010", type: "film",
    by: { en: "Kim Jee-woon", ar: "كيم جي-وون" }, rating: 0, poster: iSawTheDevil, hue: 0,
    note: {
      en: "A secret agent hunts the serial killer who murdered his fiancée.",
      fr: "Un agent secret traque le tueur en série qui a assassiné sa fiancée.",
      ar: "عميل سرّي يطارد القاتل المتسلسل الذي قتل خطيبته.",
    },
  },
  {
    title: { en: "Memories of Murder", fr: "Memories of Murder", ar: "ذكريات جريمة قتل" }, year: "2003", type: "film",
    by: { en: "Bong Joon Ho", ar: "بونغ جون-هو" }, rating: 0, poster: memoriesOfMurder, hue: 80,
    note: {
      en: "Two detectives in rural Korea chase a serial killer they can't seem to catch.",
      fr: "Deux inspecteurs de la campagne coréenne traquent un tueur en série insaisissable.",
      ar: "محقّقان في ريف كوريا يطاردان قاتلًا متسلسلًا يبدو أنه لا يُمسَك.",
    },
  },
  {
    title: { en: "Parasite", fr: "Parasite", ar: "طفيلي" }, year: "2019", type: "film",
    by: { en: "Bong Joon Ho", ar: "بونغ جون-هو" }, rating: 0, poster: parasite, hue: 130,
    note: {
      en: "A poor family slips, one by one, into the household of a wealthy one.",
      fr: "Une famille pauvre s’infiltre, un par un, dans la maison d’une famille riche.",
      ar: "عائلة فقيرة تتسلّل، واحدًا تلو الآخر، إلى منزل عائلة ثرية.",
    },
  },
];
