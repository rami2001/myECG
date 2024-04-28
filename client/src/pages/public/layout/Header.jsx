import { NavLink } from "react-router-dom";

import { Menu } from "lucide-react";

import Logo from "@/components/icons/Logo";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import classNames from "classnames";
import { Theme } from "@/components/icons/Theme";

const nav = [
  {
    route: "/home/",
    label: "Accueil",
  },
  {
    route: "/home/about",
    label: "A propos",
  },
  {
    route: "/home/api",
    label: "API",
  },
];

const NavItem = ({ route, label }) => {
  return (
    <li>
      <NavLink end={route === "/home/"} to={route}>
        {({ isActive }) => (
          <Button
            className={classNames(
              "w-full text-lg md:text-base lg:text-sm lg:w-[10ch]",
              {
                "bg-foreground text-background hover:bg-foreground/80 hover:no-underline w-full":
                  isActive,
              },
              {
                "bg-transparent text-primary hover:bg-primary/15 hover:no-underline w-full":
                  !isActive,
              }
            )}
          >
            {label}
          </Button>
        )}
      </NavLink>
    </li>
  );
};

const Header = () => {
  return (
    <header className="md:rounded-t-3xl bg-background sticky top-0 border-b py-3 px-3 lg:px-8 flex justify-center items-center">
      <Logo className="mx-auto lg:absolute lg:left-8" />
      <nav className="hidden lg:block mx-auto">
        <ul className="flex gap-5">
          {nav.map((item) => (
            <NavItem key={item.route} route={item.route} label={item.label} />
          ))}
        </ul>
      </nav>
      <div className="hidden lg:flex ml-auto space-x-3 absolute right-12">
        <Theme />
        <NavLink to="/home/login">
          {({ isActive }) => (
            <Button
              className={classNames(
                "text-lg md:text-base lg:text-sm",
                {
                  "bg-foreground text-background hover:bg-foreground/80 hover:no-underline":
                    isActive,
                },
                {
                  "bg-primary/10 text-primary hover:no-underline hover:bg-secondary hover:text-foreground":
                    !isActive,
                }
              )}
            >
              Connexion
            </Button>
          )}
        </NavLink>
        <NavLink to="/home/register">
          {({ isActive }) => (
            <Button
              className={classNames(
                "text-lg md:text-base lg:text-sm",
                {
                  "bg-foreground text-background hover:bg-foreground/80 hover:no-underline":
                    isActive,
                },
                {
                  "bg-primary text-background hover:no-underline hover:bg-primary/80":
                    !isActive,
                }
              )}
            >
              Inscription
            </Button>
          )}
        </NavLink>
      </div>

      <Sheet className="lg:hidden p-6">
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 bg-transparent lg:hidden"
          >
            <Menu />
            <span className="sr-only">Menu de navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <Logo className="mb-8" />
          <div className="h-[1px] bg-border mb-4"></div>
          <nav>
            <ul className="grid gap-3 text-lg font-medium">
              {nav.map((item) => (
                <NavItem
                  key={item.route}
                  route={item.route}
                  label={item.label}
                />
              ))}
              <div className="h-[1px] bg-border mb-4"></div>
              <NavLink to="/home/login">
                {({ isActive }) => (
                  <Button
                    className={classNames(
                      "w-full text-lg md:text-base lg:text-sm",
                      {
                        "bg-foreground text-background hover:bg-foreground/80 hover:no-underline":
                          isActive,
                      },
                      {
                        "bg-primary/10 text-primary hover:no-underline hover:bg-secondary hover:text-foreground":
                          !isActive,
                      }
                    )}
                  >
                    Connexion
                  </Button>
                )}
              </NavLink>
              <NavLink to="/home/register">
                {({ isActive }) => (
                  <Button
                    className={classNames(
                      "w-full text-lg md:text-base lg:text-sm",
                      {
                        "bg-foreground text-background hover:bg-foreground/80 hover:no-underline":
                          isActive,
                      },
                      {
                        "bg-primary text-background hover:no-underline hover:bg-primary/80":
                          !isActive,
                      }
                    )}
                  >
                    Inscription
                  </Button>
                )}
              </NavLink>
            </ul>
          </nav>
          <div className="absolute bottom-4 right-4">
            <Theme className="size-8" />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
