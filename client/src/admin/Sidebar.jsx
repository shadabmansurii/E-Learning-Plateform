import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChartNoAxesColumn,
  SquareLibrary,
} from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

/* ---------------- NAV CONFIG ---------------- */
const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: ChartNoAxesColumn,
  },
  {
    name: "Courses",
    path: "course",
    icon: SquareLibrary,
  },
];

/* ---------------- NAV ITEM ---------------- */
const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-4 font-semibold transition px-2 py-2 rounded-md
        ${
          isActive
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300"
        }
        hover:text-blue-600 dark:hover:text-blue-400`}
    >
      <Icon size={22} />
      <span>{item.name}</span>
    </Link>
  );
};

/* ---------------- COMPONENT ---------------- */
const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  /* ---------------- ACTIVE MATCH ---------------- */
  const isActive = (path) =>
    location.pathname.startsWith(`/admin/${path}`);

  /* ---------------- NAV LIST ---------------- */
  const renderNav = (onClick) =>
    NAV_ITEMS.map((item) => (
      <NavItem
        key={item.path}
        item={item}
        isActive={isActive(item.path)}
        onClick={onClick}
      />
    ));

  return (
    <div className="flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-[250px] lg:w-[280px] border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-[#0A0A0A] p-5 sticky top-0 h-screen">
        <div className="space-y-4">{renderNav()}</div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="p-4 text-gray-700 dark:text-gray-300"
              aria-label="Open menu"
            >
              <span className="text-xl">☰</span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="bg-[#f0f0f0] dark:bg-[#0A0A0A] p-5"
          >
            <div className="space-y-4">
              {renderNav(() => setIsOpen(false))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:p-10 p-2 bg-white dark:bg-[#121212]">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
