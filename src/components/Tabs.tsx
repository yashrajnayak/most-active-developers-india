
import { useState, useEffect } from 'react';
import { TabOption, TabType } from '@/types';
import { cn } from '@/lib/utils';

interface TabsProps {
  options: TabOption[];
  onChange: (value: TabType) => void;
  defaultValue: TabType;
}

const Tabs = ({ options, onChange, defaultValue }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>(defaultValue);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  
  const handleTabClick = (tab: TabType, index: number) => {
    setSelectedTab(tab);
    onChange(tab);
    updateIndicator(index);
  };
  
  const updateIndicator = (index: number) => {
    const tabElements = document.querySelectorAll('.tab-item');
    if (tabElements && tabElements[index]) {
      const tabElement = tabElements[index] as HTMLElement;
      setIndicatorStyle({
        width: `${tabElement.offsetWidth}px`,
        transform: `translateX(${tabElement.offsetLeft}px)`
      });
    }
  };
  
  // Update when defaultValue changes
  useEffect(() => {
    setSelectedTab(defaultValue);
    const index = options.findIndex(option => option.id === defaultValue);
    if (index !== -1) {
      setTimeout(() => updateIndicator(index), 100);
    }
  }, [defaultValue, options]);
  
  useEffect(() => {
    // Set initial indicator position
    const index = options.findIndex(option => option.id === selectedTab);
    if (index !== -1) {
      setTimeout(() => updateIndicator(index), 100);
    }
    
    // Update on window resize
    const handleResize = () => {
      const currentIndex = options.findIndex(option => option.id === selectedTab);
      if (currentIndex !== -1) {
        updateIndicator(currentIndex);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options, selectedTab]);
  
  return (
    <div className="relative mb-6">
      <div className="flex rounded-full p-1 bg-secondary mx-auto max-w-md">
        {options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleTabClick(option.id, index)}
            className={cn(
              "tab-item relative rounded-full px-5 py-2 text-sm font-medium transition-all z-10 flex-1",
              selectedTab === option.id 
                ? "text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
        <div 
          className="absolute left-0 bottom-1 top-1 rounded-full bg-primary transition-all duration-300 ease-in-out z-0"
          style={indicatorStyle}
        />
      </div>
    </div>
  );
};

export default Tabs;
