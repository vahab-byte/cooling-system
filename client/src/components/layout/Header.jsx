import React, { useState, useEffect } from 'react';
import { Wind, LogIn, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Container from '../ui/Container';

const Header = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'py-4 bg-white border-b border-neutral-100 shadow-sharp' : 'py-8 bg-transparent'
    }`}>
      <Container>
        <nav className="flex items-center justify-between h-10">
          
          {/* Minimal Logo */}
          <Link to="/" className="flex items-center gap-3 z-50 group">
            <div className={`w-8 h-8 flex items-center justify-center transition-all duration-500 rounded-lg group-hover:bg-black group-hover:text-white ${
              isScrolled ? 'text-black' : 'text-black'
            }`}>
               <Wind size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-black flex items-baseline">
              ArcticFresh<span className="w-1 h-1 bg-primary rounded-full ml-1" />
            </span>
          </Link>

          {/* Minimal Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
                  location.pathname === link.path 
                  ? 'text-black' 
                  : 'text-neutral-400 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {!authLoading && (
              user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-primary transition-colors group">
                    <User size={14} className="group-hover:scale-110 transition-transform" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout} 
                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-red-500 transition-colors group"
                  >
                    <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">
                    Login / Sign up
                  </Link>
                  <Button variant="outline" className="text-[10px] py-2 px-6 rounded-xl" onClick={() => window.location.href = '/services'}>
                    Get Started
                  </Button>
                </div>
              )
            )}
            {authLoading && (
              <div className="w-20 h-4 bg-neutral-100 animate-pulse rounded-full" />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-black"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </Container>

      {/* Minimal Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[280px] bg-white z-[100] lg:hidden p-8 flex flex-col pt-24 shadow-2xl"
            >
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`text-2xl font-medium tracking-tight ${
                      location.pathname === link.path ? 'text-black' : 'text-neutral-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {user ? (
                   <Button variant="outline" onClick={logout} className="w-full">
                     Sign Out
                   </Button>
                ) : (
                  <>
                    <Link to="/login" className="text-center text-sm font-medium text-neutral-500 py-2">
                      Login / Sign up
                    </Link>
                    <Button className="w-full" onClick={() => window.location.href = '/services'}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
