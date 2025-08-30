import {
  AnchorIcon,
  CalendarIcon,
  CarIcon,
  CircleParkingIcon,
  FolderKanbanIcon,
  ImportIcon,
  InboxIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  ParkingSquareIcon,
  SearchIcon,
  SettingsIcon,
  SlashIcon,
  UserRoundPlus,
  UsersIcon,
} from "lucide-react";

export const Icons = {
  spinner: Loader2Icon,

  slash: SlashIcon,

  // Sidebar
  overview: LayoutDashboardIcon,
  folder: FolderKanbanIcon,
  users: UsersIcon,
  vehicle: CarIcon,
  area: ParkingSquareIcon,
  dock: AnchorIcon,
  setting: SettingsIcon,
  manifest: ImportIcon,

  addParking: CircleParkingIcon,
  addUser: UserRoundPlus,
  inbox: InboxIcon,
  calendar: CalendarIcon,
  search: SearchIcon,
};
