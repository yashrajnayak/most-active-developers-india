import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-100 mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Project by <a href="https://github.com/yashrajnayak" className="font-medium underline underline-offset-4">Yashraj Nayak</a>
            </p>
            <p className="text-muted-foreground text-sm">
              Ranking data sourced from <a href="https://committers.top/india" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">committers.top/india</a> by <a href="https://github.com/ashkulz" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">ashkulz</a>. This project is not affiliated with GitHub.
            </p>
          </div>
          
          <a 
            href="https://github.com/yashrajnayak/most-active-developers-india" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Github size={16} />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
