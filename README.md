# Most Active Developers India

A modern web application that showcases the most active GitHub developers from India, presented in a beautiful, responsive UI inspired by minimalist design principles.

![App Screenshot](/public/app-screenshot.jpeg)

## Features

- **Automated Data Updates**: 
  - Daily updates via GitHub Actions fetching top 50 developers per category
  - Quick preview updates available through manual workflow dispatch (top 5 per category)
- **Dark Mode Support**: Beautiful UI that adapts to your preferred theme
- **Comprehensive Developer Profiles**: Displays GitHub avatars, usernames, full names, bios, locations, follower counts, and total stars across all public repositories
- **Multiple Ranking Categories**: Browse developers by Commits, Contributions, or All activity
- **Responsive Design**: Optimized for all device sizes with a premium, minimalist UI
- **Performance Optimized**: Pre-fetched and cached data, efficient rendering, and smooth animations

## Technology Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: For type-safe code
- **TanStack Query**: For data fetching and state management
- **Tailwind CSS**: For responsive, utility-first styling
- **GitHub Actions**: For automating daily data updates
- **GitHub Pages**: For hosting the application

## Setup and Deployment

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- GitHub account

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/most-active-developers-india.git
   cd most-active-developers-india
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

### GitHub Pages Deployment

1. Set up GitHub Pages in your repository:
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "GitHub Actions" as the source
   - Select the appropriate branch (usually `main`)

2. Add the GitHub Token as a repository secret:
   - Go to your repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Add a new repository secret named `MOST_ACTIVE_INDIA` with your GitHub personal access token
   - Your token should have at least `public_repo` and `read:user` scopes

3. Initial data generation:
   - Manually trigger the "Fetch GitHub User Data" workflow from the Actions tab
   - This will generate the initial data file with top 5 developers per category
   - The full data (top 50 per category) will be updated automatically at midnight UTC

4. Deploy the app:
   - Push your changes to the GitHub repository
   - GitHub Actions will build and deploy your application to GitHub Pages

5. Access your deployed application at:
   ```
   https://yourusername.github.io/most-active-developers-india/
   ```

## Data Updates

The application uses GitHub Actions to fetch and update the data in two ways:

1. **Daily Updates (Cron Job)**:
   - Runs at midnight UTC
   - Fetches top 50 developers from each category
   - Updates the data file in the repository

2. **Manual Updates (Workflow Dispatch)**:
   - Can be triggered from the Actions tab
   - Fetches top 5 developers from each category
   - Useful for quick testing and preview

This dual approach ensures both comprehensive data coverage and quick testing capabilities without hitting API rate limits.

## API Rate Limits

The application respects GitHub API rate limits by:
- Using authentication tokens for higher rate limits
- Adding delays between API calls
- Limiting the number of users fetched based on the update type

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [committers.top](https://committers.top/) for providing the ranking data
- [GitHub API](https://docs.github.com/en/rest) for user and repository information
- [Octodex](https://octodex.github.com/) for the Yogitocat app icon

---

This project was developed to showcase the incredible talent and contributions of developers from India to the global open-source community.
