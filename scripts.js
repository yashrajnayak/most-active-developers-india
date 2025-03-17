// State
let githubData = null;
let activeTab = 'user';
let profilesMap = {};

// DOM Elements
const header = document.getElementById('app-header');
const updateDateElement = document.getElementById('update-date');
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const tabItems = document.querySelectorAll('.tab-item');
const tabIndicator = document.querySelector('.tab-indicator');
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const emptyContainer = document.getElementById('empty-container');
const usersContainer = document.getElementById('users-container');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollHandler();
  initTabsHandler();
  fetchGitHubData();
});

// Theme handling
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  }
  
  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

// Scroll handler for header
function initScrollHandler() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Tabs handling
function initTabsHandler() {
  // Set initial tab indicator position
  setTimeout(updateTabIndicator, 100);
  
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabType = tab.dataset.tab;
      setActiveTab(tabType);
    });
  });
  
  // Update indicator on window resize
  window.addEventListener('resize', updateTabIndicator);
}

function setActiveTab(tabType) {
  activeTab = tabType;
  
  // Update active tab styling
  tabItems.forEach(tab => {
    if (tab.dataset.tab === tabType) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  updateTabIndicator();
  renderUsers();
}

function updateTabIndicator() {
  const activeTabElement = document.querySelector(`.tab-item.active`);
  
  if (activeTabElement) {
    const tabWidth = activeTabElement.offsetWidth;
    const tabLeft = activeTabElement.offsetLeft;
    
    tabIndicator.style.width = `${tabWidth}px`;
    tabIndicator.style.transform = `translateX(${tabLeft}px)`;
  }
}

// Data fetching
async function fetchGitHubData() {
  showLoading();
  
  try {
    const response = await fetch('./data/github-data.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    githubData = await response.json();
    
    // Process the data and populate the profilesMap
    processGitHubData();
    
    // Update the last updated date
    if (githubData.date) {
      updateDateElement.textContent = `Data as of ${formatDate(githubData.date)}`;
    }
    
    renderUsers();
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    showError(error.message || 'Failed to load user data. Please try refreshing the page or check back later.');
  }
}

function processGitHubData() {
  if (!githubData) return;
  
  const allUsers = [
    ...githubData.user,
    ...githubData.user_public,
    ...githubData.user_private,
  ];
  
  // Filter out duplicates based on login
  const uniqueUsers = allUsers.filter((user, index, self) => 
    index === self.findIndex(u => u.login === user.login)
  );
  
  // Create profiles map
  profilesMap = {};
  uniqueUsers.forEach(user => {
    if (user.profile) {
      profilesMap[user.login] = {
        login: user.login,
        name: user.profile.name,
        avatar_url: user.profile.avatar_url || user.avatar,
        html_url: user.profile.html_url || user.url,
        bio: user.profile.bio,
        location: user.profile.location,
        followers: user.profile.followers,
        total_stars: user.profile.total_stars || 0,
        rank: 0 // Default rank that will be overridden by category-specific rank
      };
    }
  });
}

// Rendering
function renderUsers() {
  if (!githubData) return;
  
  const users = getUsersByCategory(activeTab);
  
  if (users.length === 0) {
    showEmpty();
    return;
  }
  
  // Hide loading and error states
  hideLoading();
  hideError();
  hideEmpty();
  
  // Clear previous content
  usersContainer.innerHTML = '';
  
  // Create and append user cards
  users.forEach((user, index) => {
    const userCard = createUserCard(user, index);
    usersContainer.appendChild(userCard);
  });
}

function getUsersByCategory(category) {
  if (!githubData) return [];
  
  return githubData[category]
    .map(userEntry => ({
      ...profilesMap[userEntry.login], // Spread profile data first
      ...userEntry, // Then spread category entry to ensure rank is from the category
    }))
    .filter(user => !!profilesMap[user.login]);
}

function createUserCard(user, index) {
  const card = document.createElement('div');
  card.className = 'user-card fade-in';
  card.style.animationDelay = `${index * 100}ms`;
  
  const locationHtml = user.location 
    ? `
      <div class="user-location">
        <span class="location-badge">
          📍 ${escapeHtml(user.location)}
        </span>
      </div>
    ` 
    : '';
  
  const bioHtml = user.bio 
    ? `<p class="bio-text">${escapeHtml(user.bio)}</p>` 
    : '';
  
  card.innerHTML = `
    <div class="user-card-content">
      <div class="user-header">
        <div class="avatar-container">
          <span class="rank-badge">${user.rank}</span>
          <img 
            src="${user.avatar_url}" 
            alt="${escapeHtml(user.login)}"
            class="avatar"
            loading="lazy"
          />
        </div>
        
        <div class="user-info">
          <div class="user-name-container">
            <h3 class="user-name">
              ${escapeHtml(user.name || user.login)}
            </h3>
            <a 
              href="${user.html_url}"
              target="_blank"
              rel="noopener noreferrer"
              class="external-link"
              aria-label="Visit ${escapeHtml(user.login)}'s GitHub profile"
            >
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
          
          <a 
            href="${user.html_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="user-login"
          >
            @${escapeHtml(user.login)}
          </a>
          
          <div class="user-bio">
            ${bioHtml}
          </div>
        </div>
      </div>

      <div class="user-stats">
        ${locationHtml}
        
        <div class="stat">
          <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="stat-value">
            ${formatNumber(user.followers)}
          </span>
          <span class="stat-label">
            followers
          </span>
        </div>
        
        <div class="stat">
          <svg class="stat-icon star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span class="stat-value">
            ${formatNumber(user.total_stars)}
          </span>
          <span class="stat-label">
            stars
          </span>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Loading state
function showLoading() {
  loadingContainer.innerHTML = '';
  loadingContainer.classList.remove('hidden');
  errorContainer.classList.add('hidden');
  emptyContainer.classList.add('hidden');
  usersContainer.classList.add('hidden');
  
  // Create skeleton cards
  for (let i = 0; i < 8; i++) {
    const skeletonCard = createSkeletonCard();
    loadingContainer.appendChild(skeletonCard);
  }
}

function hideLoading() {
  loadingContainer.classList.add('hidden');
  usersContainer.classList.remove('hidden');
}

function createSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'user-card';
  
  card.innerHTML = `
    <div class="user-card-content">
      <div class="user-header">
        <div class="skeleton skeleton-avatar"></div>
        <div class="user-info" style="width: 100%">
          <div class="skeleton skeleton-title" style="width: 75%; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text" style="width: 50%; margin-bottom: 0.5rem;"></div>
          <div class="skeleton skeleton-text" style="width: 85%;"></div>
        </div>
      </div>
      <div class="user-stats" style="margin-top: 1rem;">
        <div class="skeleton skeleton-text" style="width: 33%;"></div>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div class="skeleton skeleton-text" style="width: 25%;"></div>
          <div class="skeleton skeleton-text" style="width: 25%;"></div>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Error state
function showError(message) {
  hideLoading();
  errorContainer.classList.remove('hidden');
  emptyContainer.classList.add('hidden');
  usersContainer.classList.add('hidden');
  
  errorMessage.textContent = message;
}

function hideError() {
  errorContainer.classList.add('hidden');
}

// Empty state
function showEmpty() {
  hideLoading();
  hideError();
  emptyContainer.classList.remove('hidden');
  usersContainer.classList.add('hidden');
}

function hideEmpty() {
  emptyContainer.classList.add('hidden');
}

// Utility functions
function formatNumber(num) {
  if (!num && num !== 0) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  const suffix = getDaySuffix(day);
  
  return `${day}${suffix} ${month} ${year}`;
}

function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
