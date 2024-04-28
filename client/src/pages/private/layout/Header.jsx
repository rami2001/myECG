import { NavLink } from "react-router-dom";

import classNames from "classnames";

import Logo from "@/components/icons/Logo";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  PanelLeft,
  Settings,
  Activity,
  UsersRound,
  UserRoundCog,
  LogOut,
} from "lucide-react";
import DashboardLogo from "@/components/icons/DashboardLogo";

const navItems = [
  {
    label: "Tableau de bord",
    route: "/dashboard",
    icon: (className) => <Home className={className} />,
  },
  {
    label: "Mes ECGs",
    route: "/ecg",
    icon: (className) => <Activity className={className} />,
  },
  {
    label: "Profiles",
    route: "/profiles",
    icon: (className) => <UsersRound className={className} />,
  },
  {
    label: "Mon compte",
    route: "/account",
    icon: (className) => <UserRoundCog className={className} />,
  },
  {
    label: "Paramètres",
    route: "/settings",
    icon: (className) => <Settings className={className} />,
  },
];

const MobileNavLink = ({ children, label, route }) => {
  return (
    <NavLink
      to={route}
      end={route === "/dashboard/"}
      className={({ isActive }) =>
        classNames(
          "rounded-lg flex items-center gap-4 px-4 py-3 transition duration-150",
          {
            "bg-primary text-primary-foreground": isActive,
          },
          {
            "text-muted-foreground hover:text-foreground hover:bg-secondary":
              !isActive,
          }
        )
      }
    >
      {children}
      {label}
    </NavLink>
  );
};

const MobileHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex justify-center items-center gap-8 border-b bg-background px-4 py-5 lg:hidden">
      <Logo />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="absolute left-4 lg:hidden"
          >
            <PanelLeft className="s-7" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <h4 className="text-3xl">Menu</h4>
          <Separator className="my-4" />
          <nav>
            <ul className="grid gap-4 text-lg font-medium">
              <li>
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.route}
                    label={item.label}
                    route={item.route}
                  >
                    {item.icon("s-5")}
                  </MobileNavLink>
                ))}
              </li>
              <Separator className="my-4" />
              <li>
                <button className="w-full rounded-lg flex items-center gap-4 px-4 py-3 transition duration-150 hover:bg-primary hover:text-primary-foreground text-muted-foreground">
                  <LogOut className="s-5" />
                  Se déconnecter
                </button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

const NavItem = ({ children, route, label }) => {
  return (
    <NavLink to={route} end={route === "/dashboard/"}>
      <div className="group items-center justify-center rounded-full bg-transparent p-2 cursor-pointer hover:bg-primary transition-all duration-150">
        {children}
        <Heart className="s-5 group-hover:stroke-primary-foreground" />
        <span className="sr-only">{label}</span>
      </div>
    </NavLink>
  );
};

const Header = () => {
  return (
    <>
      <header className="hidden lg:block bg-background border-r sticky h-full top-0 left-0 p-3">
        <DashboardLogo />
        <Separator className="my-2" />
      </header>
      <nav>
        <ul>
          <li>
            <NavLink></NavLink>
          </li>
        </ul>
      </nav>
      <MobileHeader />
    </>
  );
};

export default Header;
