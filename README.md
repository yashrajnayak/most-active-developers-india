# Most Active Developers India

A modern web application that showcases the most active GitHub developers from India, featuring a beautiful, responsive UI built with modern web technologies.

![App Screenshot](/public/app-screenshot.jpeg)

## Features

- **Real-time Data Updates** 🔄 
  - Daily updates via GitHub Actions fetching top 50 developers per category
  - Quick preview updates through manual workflow dispatch (top 6 per category)
- **Modern UI/UX** 🎨:
  - System-aware dark/light mode with smooth transitions
  - Staggered animations and smooth loading states
  - Responsive design optimized for all devices
- **Rich Developer Profiles** 👤
  - GitHub avatars and rank indicators
  - Full names, usernames, and verified locations
  - Comprehensive bio sections
  - Total repository stars and follower counts
  - Direct GitHub profile links
- **Multiple Ranking Categories** 🏆
  - Commits (Total commit contributions)
  - Contributions (Public repository contributions)
  - All (Combined public and private activity)
- **Performance Optimized** ⚡
  - Static site generation for fast loading
  - Optimized image loading with lazy load
  - Smart data caching and state management

## 🛠️ Technology Stack

- **Frontend Framework** ⚛️
  - [React](https://react.dev/) - UI library
  - [Vite](https://vitejs.dev/) - Build tool and dev server
  - [TypeScript](https://www.typescriptlang.org/) - Type safety
  - [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager

- **Styling & Components** 🎯
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - Accessible component system
  - [Lucide Icons](https://lucide.dev/) - Beautiful icons

- **Data & State Management** 📊
  - GitHub API for user data
  - Custom hooks for state management
  - Local storage for theme persistence

- **Infrastructure** 🏗️
  - GitHub Actions for automated workflows
  - GitHub Pages for hosting
  - GitHub API for data fetching

## 🔄 Data Update

The application uses a GitHub Actions workflow:
   - Runs daily at 09:46 UTC (15:16 IST)
   - Fetches top 50 developers per category
   - Updates the `github-data.json` file
   - Can be triggered manually to fetch top 6 developers per category

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [committers.top](https://committers.top/) for the ranking data
- [GitHub API](https://docs.github.com/en/rest) for developer information
- [Octodex](https://octodex.github.com/) for the app icon

---

Built with ♥️ to celebrate India's developers and their contributions to open source.
