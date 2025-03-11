
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  updateDate: string;
}

const Header = ({ updateDate }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full py-4 transition-all duration-300 ${
      scrolled ? 'glass shadow-elevation-1' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {updateDate && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                Data as of {formatDate(updateDate)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="rounded-full"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
