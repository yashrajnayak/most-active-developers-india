import { useState } from 'react';
import { useGitHubUsers } from '@/hooks/useGitHubUsers';
import { TabType, TabOption } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tabs from '@/components/Tabs';
import UserCard from '@/components/UserCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Import app icon using Vite's asset handling
import appIcon from '/public/app-icon.png';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('user');
  
  const {
    rankData,
    isLoading,
    isError,
    errorMessage,
    getUsersByCategory,
  } = useGitHubUsers();
  
  const users = getUsersByCategory(activeTab);
  
  const tabOptions: TabOption[] = [
    { id: 'user', label: 'Commits' },
    { id: 'user_public', label: 'Contributions' },
    { id: 'user_private', label: 'All' },
  ];
  
  const handleTabChange = (value: TabType) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header updateDate={rankData?.date || ''} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-40 w-40 md:h-64 md:w-64 rounded-full border-2 border-primary overflow-hidden animate-fade-in">
              <img 
                src={appIcon}
                alt="GitHub Octocat" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 animate-fade-in">
            Most Active Developers 🇮🇳
          </h1>
          <p className="text-center text-muted-foreground mb-8 animate-fade-in animation-delay-200">
            Discover the top contributors from India on GitHub
          </p>
          
          <Tabs 
            options={tabOptions} 
            onChange={handleTabChange}
            defaultValue={activeTab}
          />
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-background rounded-xl overflow-hidden shadow-elevation-1 border border-border p-5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage || "Failed to load user data. Please try refreshing the page or check back later."}
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !isError && users.length === 0 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No data available</AlertTitle>
              <AlertDescription>
                This could be because the data hasn't been fetched yet or there's an issue with the data source.
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !isError && users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={activeTab}>
              {users.map((user, index) => (
                <UserCard key={user.login} user={user} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
