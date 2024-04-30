import { NavLink, useNavigate } from "react-router-dom";

import classNames from "classnames";

import { logout } from "@/api/userController";

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
import Logo from "@/components/icons/Logo";
import DashboardLogo from "@/components/icons/DashboardLogo";
import { Theme } from "@/components/icons/Theme";
import { useToast } from "@/components/ui/use-toast";

const navItems = [
  {
    label: "Tableau de bord",
    route: "/dashboard",
    icon: (className) => <Home className={className} />,
  },
  {
    label: "Mes ECGs",
    route: "ecg",
    icon: (className) => <Activity className={className} />,
  },
  {
    label: "Profiles",
    route: "profiles",
    icon: (className) => <UsersRound className={className} />,
  },
  // {
  //   label: "Mon compte",
  //   route: "account",
  //   icon: (className) => <UserRoundCog className={className} />,
  // },
  {
    label: "Paramètres",
    route: "settings",
    icon: (className) => <Settings className={className} />,
  },
];

const MobileNavLink = ({ children, label, route }) => {
  return (
    <NavLink
      to={route}
      end={route === "/dashboard"}
      className={({ isActive }) =>
        classNames(
          "my-4 rounded-lg flex items-center gap-4 px-4 py-3 transition duration-150",
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

const MobileHeader = ({ logout }) => {
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
            <ul className="flex flex-col gap-4">
              <li>
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.route}
                    end={item.route === "/dashboard"}
                    label={item.label}
                    route={item.route}
                  >
                    {item.icon("s-5")}
                  </MobileNavLink>
                ))}
              </li>
              <Separator className="my-4" />
              <li>
                <button
                  onClick={logout}
                  className="w-full rounded-lg flex items-center gap-4 px-4 py-3 transition duration-150 hover:bg-primary hover:text-primary-foreground text-muted-foreground"
                >
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

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home", { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur.",
        description: error.message,
      });
    }
  };

  return (
    <>
      <header className="hidden lg:flex flex-col w-16 bg-background border-r fixed h-screen top-0 left-0 px-3 py-4">
        <DashboardLogo />
        <Separator className="mb-4 mt-2" />
        <nav>
          <ul>
            <li>
              {navItems.map((item) => (
                <NavLink
                  to={item.route}
                  end={item.route === "/dashboard"}
                  key={item.route}
                  className={({ isActive }) =>
                    classNames(
                      "flex justify-center items-center p-2 rounded-md transition duration-100 mb-4",
                      {
                        "bg-primary hover:bg-primary/80 text-primary-foreground":
                          isActive,
                      },
                      {
                        "bg-transparent hover:bg-muted": !isActive,
                      }
                    )
                  }
                >
                  {item.icon("s-5")}
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              ))}
            </li>
            <Separator className="mb-5" />
            <li onClick={() => handleLogout()}>
              <Button className="flex justify-center items-center p-2 rounded-md transition duration-100 bg-transparent hover:bg-muted">
                <LogOut className="s-5 stroke-foreground" />
                <span className="sr-only">Déconnexion</span>
              </Button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <Theme />
        </div>
      </header>

      <MobileHeader logout={handleLogout} />
    </>
  );
};

export default Header;
