import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GitHubUserData, UserProfile, TabType } from '@/types';

// Local data path that respects the base URL in production
const LOCAL_DATA_PATH = import.meta.env.PROD ? '/most-active-developers-india/data/github-data.json' : '/data/github-data.json';

export const useGitHubUsers = () => {
  const [profilesMap, setProfilesMap] = useState<Record<string, UserProfile>>({});

  // Fetch the data from local JSON file
  const { 
    data: rankData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['githubUsers'],
    queryFn: async (): Promise<GitHubUserData> => {
      try {
        const response = await fetch(LOCAL_DATA_PATH);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process the data and populate the profilesMap
        const allUsers = [
          ...data.user,
          ...data.user_public,
          ...data.user_private,
        ];
        
        // Filter out duplicates based on login
        const uniqueUsers = allUsers.filter((user, index, self) => 
          index === self.findIndex(u => u.login === user.login)
        );
        
        // Create profiles map
        const newProfilesMap: Record<string, UserProfile> = {};
        uniqueUsers.forEach(user => {
          if (user.profile) {
            newProfilesMap[user.login] = {
              login: user.login,
              name: user.profile.name,
              avatar_url: user.profile.avatar_url || user.avatar,
              html_url: user.profile.html_url || user.url,
              bio: user.profile.bio,
              location: user.profile.location,
              followers: user.profile.followers,
              total_stars: user.profile.total_stars || 0,
              rank: user.rank
            };
          }
        });
        
        setProfilesMap(newProfilesMap);
        return data;
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
  
  const getUsersByCategory = (category: TabType) => {
    if (!rankData) return [];
    
    return rankData[category].map(user => ({
      ...user,
      ...profilesMap[user.login]
    })).filter(user => !!profilesMap[user.login]);
  };
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return {
    rankData,
    isLoading,
    isError,
    errorMessage,
    getUsersByCategory,
    profilesMap
  };
};
