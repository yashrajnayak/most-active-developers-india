import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-100 mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Project by <a 
              href="https://github.com/yashrajnayak" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Yashraj Nayak
            </a>
          </p>
          
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
      <div className="container text-center flex flex-col gap-4 items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          Data sourced from <a href="https://committers.top/india" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">committers.top/india</a> by <a href="https://github.com/ashkulz" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">ashkulz</a>. This project is not affiliated with GitHub.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
