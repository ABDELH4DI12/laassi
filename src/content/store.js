// Your Odoo addons, shown in the Store. PLACEHOLDERS — replace them with your real modules.
// Text can be written once or per language: { en: "…", fr: "…", ar: "…" } (missing ones fall back to English).
//
//   name        the module's display name
//   technical   its technical name (the folder name in your addons path)
//   category    sales | crm | inventory | accounting | hr | website | pos | manufacturing | project | tools
//               (sets the app icon and its colour)
//   versions    the Odoo versions it supports, e.g. ["17.0", "18.0"]
//   price       "Free" or a price, e.g. "€49"
//   license     e.g. "LGPL-3", "OPL-1", "AGPL-3"
//   summary     one line, shown on the card
//   description a few sentences for the details panel
//   features    what it adds
//   depends     the Odoo modules it depends on, e.g. ["sale", "stock"]
//   appsUrl     its page on apps.odoo.com ("" if none)
//   github      its repository ("" if none)
//   image       optional screenshot: import it at the top, then image: myShot
//   featured    true shows a "Featured" badge

const FREE = { en: "Free", fr: "Gratuit", ar: "مجاني" };

const summary = {
  en: "One line on what this module adds to Odoo.",
  fr: "Une ligne sur ce que ce module ajoute à Odoo.",
  ar: "سطر واحد عمّا يضيفه هذا الموديول إلى أودو.",
};
const description = {
  en: "A few sentences about the problem this module solves, who it is for, and how it fits into the standard Odoo workflow.",
  fr: "Quelques phrases sur le problème que ce module résout, à qui il s’adresse et comment il s’intègre au flux standard d’Odoo.",
  ar: "بضع جمل عن المشكلة التي يحلّها هذا الموديول، ولمن هو موجّه، وكيف يندمج في سير العمل المعتاد في أودو.",
};
const features = (count) => ({
  en: ["First feature", "Second feature", "Third feature", "Fourth feature"].slice(0, count),
  fr: ["Première fonctionnalité", "Deuxième fonctionnalité", "Troisième fonctionnalité", "Quatrième fonctionnalité"].slice(0, count),
  ar: ["الميزة الأولى", "الميزة الثانية", "الميزة الثالثة", "الميزة الرابعة"].slice(0, count),
});
const addon = (n, fr, ar) => ({ en: "Addon " + n, fr: "Module " + fr, ar: "الموديول " + ar });

export const store = [
  { name: addon("one", "un", "الأول"), technical: "addon_one", category: "sales", versions: ["16.0", "17.0", "18.0"],
    price: FREE, license: "LGPL-3", summary, description, features: features(4), depends: ["sale_management"],
    appsUrl: "", github: "", featured: true },
  { name: addon("two", "deux", "الثاني"), technical: "addon_two", category: "inventory", versions: ["17.0", "18.0"],
    price: "€49", license: "OPL-1", summary, description, features: features(3), depends: ["stock"],
    appsUrl: "", github: "" },
  { name: addon("three", "trois", "الثالث"), technical: "addon_three", category: "accounting", versions: ["17.0"],
    price: "€79", license: "OPL-1", summary, description, features: features(3), depends: ["account"],
    appsUrl: "", github: "" },
  { name: addon("four", "quatre", "الرابع"), technical: "addon_four", category: "hr", versions: ["16.0", "17.0"],
    price: FREE, license: "LGPL-3", summary, description, features: features(2), depends: ["hr"],
    appsUrl: "", github: "" },
  { name: addon("five", "cinq", "الخامس"), technical: "addon_five", category: "website", versions: ["18.0"],
    price: "€29", license: "OPL-1", summary, description, features: features(3), depends: ["website_sale"],
    appsUrl: "", github: "" },
  { name: addon("six", "six", "السادس"), technical: "addon_six", category: "pos", versions: ["17.0", "18.0"],
    price: FREE, license: "LGPL-3", summary, description, features: features(2), depends: ["point_of_sale"],
    appsUrl: "", github: "" },
];
