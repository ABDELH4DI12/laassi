import SettingsIcon from "./icons/Settings.svg";

// Dock icons are drawn by DockIcons.jsx, keyed by name.
export const apps = [
  { name: "Terminal" },
  { name: "Works" },
  { name: "Store" },
  { name: "WatchList" },
  { name: "Mangas" },
  { name: "Settings", icon: SettingsIcon },
];

export const dockApps = apps.filter((app) => app.name !== "Settings");
