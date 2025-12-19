import { User, Users, LayoutDashboard, LogOut, Gamepad2 } from "lucide-react";
import BrandName from "./BrandName";
import { NavLink } from "react-router";
import useAuthContext from "../../context/auth";
import useFetch from "../../hooks/useFetch";

const navItems = [
  {
    name: "Profil",
    Icon: User,
    href: "/profile",
  },
  {
    name: "Joueurs en Ligne",
    Icon: Users,
    href: "/online-players",
  },
  {
    name: "Dashboard",
    Icon: LayoutDashboard,
    href: "/",
  },
  {
    name: "Nouvelle partie solo",
    Icon: Gamepad2,
    href: "/solo-game",
  },
];

const SidebarItem = ({ name, Icon, href, ...props }) => {
  const itemClass = `flex items-center p-3 rounded-lg transition-colors duration-200   ${
    href === "/logout"
      ? "text-red-500 hover:bg-red-500/10 hover:text-red-700 font-semibold mt-4"
      : "text-gray-600 hover:bg-red-50 hover:text-gray-500"
  }`;

  return (
    <NavLink
      {...props}
      to={href}
      className={({ isActive }) =>
        isActive ? `${itemClass} bg-red-50` : itemClass
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">
        {name}{" "}
        {name === "Joueurs en Ligne" && (
          <strong className="inline-block ms-2"> ({props?.onlinePlayer || 0}) </strong>
        )}{" "}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { logout } = useAuthContext();
  const { data, error, isLoading } = useFetch("/online-players", []);

  return (
    <div className="flex flex-col h-screen w-64 left-0 top-0 bg-white shadow-xl p-4 fixed">
      <div className="flex items-center justify-center py-4 border-b border-gray-400 mb-6">
        <BrandName className="text-xl" />
      </div>

      <div className="flex grow flex-col justify-between">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem key={item.name} {...item} onlinePlayer={data.total} />
          ))}
        </nav>

        <div>
          <SidebarItem
            onClick={logout}
            name="Se Déconnecter"
            Icon={LogOut}
            href="/logout"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
