import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const INDIA_RANK_URL = 'https://committers.top/rank_only/india.json';
const GITHUB_API_URL = 'https://api.github.com';

// Get the directory name using ES modules pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'github-data.json');

// GitHub Token for API access
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const IS_WORKFLOW_DISPATCH = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch';
const USERS_LIMIT = IS_WORKFLOW_DISPATCH ? 6 : 50;

const headers = GITHUB_TOKEN 
  ? { 'Authorization': `token ${GITHUB_TOKEN}` } 
  : {};

async function fetchUserProfile(username) {
  try {
    // Fetch basic profile
    const profileResponse = await fetch(`${GITHUB_API_URL}/users/${username}`, { headers });
    
    if (!profileResponse.ok) {
      console.error(`Failed to fetch profile for ${username}: ${profileResponse.status}`);
      return null;
    }
    
    const profile = await profileResponse.json();
    
    // Fetch repos to calculate total stars
    const totalStars = await fetchTotalStars(username);
    
    return {
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url,
      bio: profile.bio,
      location: profile.location,
      followers: profile.followers,
      total_stars: totalStars
    };
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error.message);
    return null;
  }
}

async function fetchTotalStars(username) {
  let page = 1;
  let totalStars = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const reposResponse = await fetch(
        `${GITHUB_API_URL}/users/${username}/repos?per_page=100&page=${page}`,
        { headers }
      );
      
      if (!reposResponse.ok) {
        console.error(`Failed to fetch repos for ${username}: ${reposResponse.status}`);
        break;
      }
      
      const repos = await reposResponse.json();
      
      if (repos.length === 0) {
        hasMore = false;
      } else {
        totalStars += repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        page++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error fetching repos for ${username}:`, error.message);
      break;
    }
  }
  
  return totalStars;
}

async function main() {
  try {
    console.log('Fetching ranking data from committers.top...');
    console.log(`Will fetch ${USERS_LIMIT} users per category (${IS_WORKFLOW_DISPATCH ? 'manual trigger' : 'cron job'})`);
    
    const response = await fetch(INDIA_RANK_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ranking data: ${response.status}`);
    }
    
    const rawData = await response.json();

    // Limit and deduplicate usernames
    const limitArray = (arr) => (arr || []).slice(0, USERS_LIMIT);
    
    const usernames = new Set([
      ...limitArray(rawData.user),
      ...limitArray(rawData.user_public),
      ...limitArray(rawData.user_private)
    ]);

    console.log(`Found ${usernames.size} unique users across all categories`);

    // Create a map to store GitHub profiles
    const profilesMap = new Map();

    // Fetch GitHub profiles for all unique users
    for (const [index, username] of [...usernames].entries()) {
      console.log(`[${index + 1}/${usernames.size}] Fetching data for ${username}...`);
      
      const profile = await fetchUserProfile(username);
      if (profile) {
        profilesMap.set(username, profile);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Process each category using the profiles map
    const processCategory = (users, categoryName) => {
      const limitedUsers = limitArray(users);
      console.log(`Processing ${limitedUsers.length} users in ${categoryName}...`);
      
      // Create a map of username to their original rank in this category
      const rankMap = new Map(users.map((username, idx) => [username, idx + 1]));
      
      return limitedUsers.map(username => ({
        rank: rankMap.get(username), // Use the original rank from the category
        login: username,
        profile: profilesMap.get(username) || null
      }));
    };

    const githubData = {
      date: new Date().toISOString(),
      user: processCategory(rawData.user || [], 'user'),
      user_public: processCategory(rawData.user_public || [], 'user_public'),
      user_private: processCategory(rawData.user_private || [], 'user_private'),
      orgs: rawData.org || []
    };
    
    // Ensure the output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the data to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(githubData, null, 2));
    console.log(`Data successfully written to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error in fetching GitHub data:', error);
    process.exit(1);
  }
}

main();
