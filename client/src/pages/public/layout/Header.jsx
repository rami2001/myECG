import { Menu } from "lucide-react";

import Logo from "@/components/icons/Logo";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="overflow-y-hidden sticky top-0 left-0 border-b py-3 px-3 lg:px-8 flex justify-center items-center backdrop-blur-md">
      <Logo className="mx-auto lg:absolute lg:left-8" />
      <nav className="hidden lg:block mx-auto">
        <ul className="flex gap-5">
          <li>
            <Button
              variant="link"
              className="hover:bg-primary/15 hover:text-primary hover:no-underline min-w-[10ch]"
            >
              Accueil
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              className="hover:bg-primary/15 hover:text-primary hover:no-underline min-w-[10ch]"
            >
              A propos
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              className="hover:bg-primary/15 hover:text-primary hover:no-underline min-w-[10ch]"
            >
              API
            </Button>
          </li>
        </ul>
      </nav>
      <div className="hidden lg:flex ml-auto space-x-3 absolute right-12">
        <Button
          variant="link"
          className="bg-primary/10 text-foreground hover:no-underline hover:bg-secondary hover:text-primary"
        >
          Connexion
        </Button>
        <Button
          variant="link"
          className="bg-primary text-background hover:no-underline hover:bg-primary/80"
        >
          Inscription
        </Button>
      </div>

      <Sheet className="lg:hidden p-6">
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 bg-transparent lg:hidden"
          >
            <Menu className="stroke-primary" />
            <span className="sr-only">Menu de navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <Logo className="mb-8" />
          <div className="h-[1px] bg-border mb-4"></div>
          <nav>
            <ul className="grid gap-3 text-lg font-medium">
              <li>
                <Button
                  variant="link"
                  className="hover:bg-primary/15 hover:text-primary hover:no-underline w-full"
                >
                  Accueil
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="hover:bg-primary/15 hover:text-primary hover:no-underline w-full"
                >
                  A propos
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="hover:bg-primary/15 hover:text-primary hover:no-underline w-full"
                >
                  API
                </Button>
              </li>
              <div className="h-[1px] bg-border mb-4"></div>
              <li>
                <Button
                  variant="link"
                  className="w-full bg-primary/10 text-foreground hover:no-underline hover:bg-secondary hover:text-primary"
                >
                  Connexion
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="w-full text-background bg-primary hover:no-underline hover:bg-primary/90"
                >
                  Inscription
                </Button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
