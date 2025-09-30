import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MobileMenu = () => {
    return (
      <div
        className={`
              fixed top-0 right-0 h-full w-64 bg-base-100 shadow-lg z-20 transform transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
              md:hidden
            `}
      >
        {/* Close Button */}
        <div className="flex justify-between p-4">
          {/* Menu Content */}
          <div className="flex flex-col w-full justify-center p-4 space-y-4">
            <Link href={"/sign-in"}>
              <button className="btn btn-outline rounded-full">Login</button>
            </Link>
            <Link href={"/sign-up"}>
              <button className="btn btn-primary rounded-full">
                Get Started
              </button>
            </Link>
          </div>
          <button
            className="p-2 self-start rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r px-0 vibe-gradient sm:px-6 py-4">
      {isMenuOpen && <MobileMenu />}
      <div className="max-w-7xl px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex justify-center gap-1">
          {/* Mobile Menu Icon (optional) */}
          <div className="md:hidden">
            <button
              className="btn btn-ghost btn-circle"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>

          <img className="size-6 self-center" src={"/Logo.png"} />
          <a href="/">
            <div className="gradient-text text-3xl font-bold">Vibe Invoice</div>
          </a>
        </div>
        {/* Navigation Links (hidden on mobile) */}
        <div className="hidden lg:flex gap-6 gradient-text font-medium">
          <a href="/#how-it-works" className="hover:text-primary/50">
            How it works
          </a>
          <a href="/playground" className="hover:text-primary/50">
            Demo
          </a>
          <a href="/#pricing" className="hover:text-primary/50">
            Pricing
          </a>
          <a href="/#faq" className="hover:text-primary/50">
            FAQs
          </a>
        </div>

        {/* Call to Action */}
        <div className="hidden md:flex gap-2">
          <Link href={"/sign-in"}>
            <button className="btn btn-outline btn-primary rounded-full">
              Login
            </button>
          </Link>
          <Link href={"/sign-up"}>
            <button className="generate-button rounded-full">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
