import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/", active: true },
  { label: "Our Seva", href: "#seva", hasDropdown: true },
  { label: "Media Centre", href: "#media", hasDropdown: true },
  { label: "About Us", href: "#about", hasDropdown: true },
  { label: "Contact Us", href: "#contact" },
  { label: "Contribute", href: "#contribute" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">ॐ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display">
                <span className="text-saffron font-bold">Save</span>
                <span className="text-foreground">Deities</span>
              </span>
              <span className="text-xs text-muted-foreground font-body">देवाः संतुः हविर्भुजाः</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  item.active
                    ? "bg-saffron text-primary-foreground rounded-full"
                    : "text-foreground hover:text-saffron"
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${
                  item.active ? "text-saffron bg-saffron/10" : "text-foreground hover:text-saffron"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Contribute Side Button */}
      <a
        href="#contribute"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 bg-saffron text-primary-foreground py-4 px-2 writing-mode-vertical-rl rotate-180 font-semibold text-sm uppercase tracking-wider hover:bg-saffron-dark transition-colors z-40"
        style={{ writingMode: "vertical-rl" }}
      >
        ✻ Contribute
      </a>
    </header>
  );
};

export default Header;
