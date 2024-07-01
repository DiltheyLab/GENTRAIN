import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Menu, Package2, Share2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background z-50 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link to="#" className="flex items-center gap-2 text-md font-semibold md:text-base">
          <Share2 className="h-6 w-6 text-primary" />
          <span className="not-sr-only text-primary text-xl">Gentrain</span>
        </Link>
        <Link to="#" className="text-foreground transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Daten
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Hilfe/FAQ
        </Link>
        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Kontakt
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Gentrain</span>
            </Link>
            <Link to="#" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">
              Daten
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">
              Hilfe/FAQ
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">
              Kontakt
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 ml-auto md:gap-2 lg:gap-4">
        <Button variant="outline" className="gap-2 flex items-center">
          Daten herunterladen
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
