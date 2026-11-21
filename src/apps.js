import BrowserIcon from "./icons/Browser.svg";
import WorkbenchIcon from "./icons/Workbench.svg";
import StoreIcon from "./icons/Store.svg";
import CinemaIcon from "./icons/Cinema.svg";
import MangaIcon from "./icons/Manga.svg";
import SettingsIcon from "./icons/Settings.svg";

export const apps = [
  {
    name: "Browser",
    title: "Project Browser",
    icon: BrowserIcon,
    empty: "No projects yet.",
  },
  {
    name: "Workbench",
    title: "Workbench",
    icon: WorkbenchIcon,
    empty: "No skills added yet.",
  },
  {
    name: "Store",
    title: "Addon Store",
    icon: StoreIcon,
    empty: "No addons yet.",
  },
  { name: "Cinema", title: "Cinema", icon: CinemaIcon, empty: "No films yet." },
  {
    name: "Manga",
    title: "Manga Shelf",
    icon: MangaIcon,
    empty: "No manga yet.",
  },
  { name: "Settings", title: "Settings", icon: SettingsIcon },
];
