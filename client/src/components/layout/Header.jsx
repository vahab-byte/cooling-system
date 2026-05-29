import React, { useState, useEffect, useRef } from "react";
import {
  Wind,
  User,
  Menu,
  X,
  LogOut,
  Phone,
  ChevronDown,
  Wrench,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../ui/Container";

const Header = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [callDropdownOpen, setCallDropdownOpen] = useState(false);
  const callDropdownRef = useRef(null);

  const phones = [
    { label: "Line 1", number: "6353774046", display: "+91 6353 774 046" },
    { label: "Line 2", number: "9726885447", display: "+91 9726 885 447" },
  ];

  // Only homepage has the dark hero — transparent header only there
  const isHomePage = location.pathname === "/";
  const solidHeader = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCallDropdownOpen(false);
  }, [location.pathname]);

  // Close call dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        callDropdownRef.current &&
        !callDropdownRef.current.contains(e.target)
      ) {
        setCallDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          solidHeader
            ? "py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-900/5"
            : "py-6 bg-transparent"
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group z-50">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  solidHeader
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                }`}
              >
                <Wind size={18} />
              </div>
              <span
                className={`text-lg font-black tracking-tight transition-colors duration-300 ${
                  solidHeader ? "text-slate-900" : "text-white"
                }`}
              >
                ArcticFresh<span className="text-blue-500">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? solidHeader
                        ? "text-blue-600 bg-blue-50"
                        : "text-white bg-white/15 backdrop-blur-sm"
                      : solidHeader
                        ? "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Call Now Dropdown */}
              <div className="hidden xl:block relative" ref={callDropdownRef}>
                <button
                  onClick={() => setCallDropdownOpen(!callDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    solidHeader
                      ? "bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                      : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <Phone size={12} />
                  Call Now
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${callDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {callDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 w-52 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Select a number to call
                        </p>
                      </div>
                      {phones.map((p) => (
                        <a
                          key={p.number}
                          href={`tel:+91${p.number}`}
                          onClick={() => setCallDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                            <Phone
                              size={13}
                              className="text-blue-600 group-hover:text-white transition-colors"
                            />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {p.label}
                            </div>
                            <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                              {p.display}
                            </div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!authLoading &&
                (user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        solidHeader
                          ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <User size={14} />
                      Dashboard
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          solidHeader
                            ? "text-purple-600 hover:bg-purple-50"
                            : "text-purple-300 hover:text-purple-200 hover:bg-purple-500/20"
                        }`}
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === "technician" && (
                      <Link
                        to="/technician"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          solidHeader
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
                        }`}
                      >
                        <Wrench size={14} /> Tech Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        solidHeader
                          ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          : "text-white/50 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        solidHeader
                          ? "text-slate-500 hover:text-slate-900"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/services"
                      className="px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-blue-500/50"
                    >
                      Book Service
                    </Link>
                  </div>
                ))}
              {authLoading && (
                <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-xl" />
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 z-50 ${
                mobileMenuOpen
                  ? "bg-slate-900 text-white"
                  : solidHeader
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-white/10 text-white backdrop-blur-sm"
              }`}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 lg:hidden flex flex-col shadow-2xl shadow-black/20"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Wind size={16} className="text-white" />
                  </div>
                  <span className="font-black text-slate-900">
                    ArcticFresh<span className="text-blue-500">.</span>
                  </span>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        isActive(link.path)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {link.name}
                      {isActive(link.path) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-100 space-y-3">
                {/* Both phone numbers */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">
                    Call Us
                  </p>
                  {phones.map((p) => (
                    <a
                      key={p.number}
                      href={`tel:+91${p.number}`}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Phone
                          size={12}
                          className="text-blue-600 group-hover:text-white transition-colors"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          {p.label}
                        </div>
                        <div className="text-sm font-bold">{p.display}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      <User size={14} /> Dashboard
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-purple-200 text-purple-600 font-bold text-sm hover:bg-purple-50 transition-all"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === "technician" && (
                      <Link
                        to="/technician"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-amber-200 text-amber-600 font-bold text-sm hover:bg-amber-50 transition-all"
                      >
                        <Wrench size={14} /> Tech Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      Login / Sign Up
                    </Link>
                    <Link
                      to="/services"
                      className="flex items-center justify-center w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all shadow-md shadow-blue-500/30"
                    >
                      Book Service Now
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
