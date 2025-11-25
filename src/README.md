# RallyOS - Multi-Sport Racket League App

A comprehensive mobile-first web application for managing multi-sport racket leagues (Bocce, Pickleball, and Padel). Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Features (27 Screens)
- 🏠 **Home Dashboard** - Quick access to matches, availability, and announcements
- 📅 **Schedule Management** - View upcoming matches with filtering by week/month
- 👥 **Team Management** - Roster, captain tools, and lineup management
- ⭐ **Ratings & Rankings** - Player ratings and skill levels
- 📊 **Standings System** - Modern visual standings with animations
- 🎯 **Availability Management** - Set match availability for players
- 💬 **Team Chat** - Real-time messaging (mock)
- 📸 **Photo Gallery** - Team photos with masonry layout
- 💰 **Dues Payment** - Optional payment system
- 🏆 **Achievements** - Gamified badges and rewards
- 📈 **Personal Stats** - Individual player statistics
- 👤 **Player Directory** - Browse all players
- 🗓️ **Practice Scheduler** - Schedule practice sessions
- 📝 **Feedback System** - Submit feedback
- ⚙️ **Settings** - Profile and preferences
- 🔔 **Notifications** - Stay updated
- 📊 **Analytics Dashboard** - Captain-only analytics

### Additional Features
- 🎾 **Court Booking** - Reserve courts
- ⏳ **Waitlist Management** - Join team waitlists
- 🌤️ **Weather Widget** - Match-day weather
- 🎨 **Onboarding Flow** - Complete user onboarding
- 📊 **Match Detail** - Detailed match information
- 📋 **Division Standings** - Visual standings cards
- 📈 **Team Season Report** - Comprehensive team stats
- 📊 **My Standings** - Personal standings view

### Design System
- **Primary Color**: Deep Blue (#1e40af)
- **Accent Color**: Electric Lime (#a3e635)
- **Typography**: Inter
- **Border Radius**: 16px
- **Mobile-First**: 390px base width, fully responsive

### Recent Enhancements (Just Added!)
- ✨ **Staggered entrance animations** for standings cards
- 🔥 **Win streak badges** with flame icons
- 📊 **Recent form indicators** (W/L boxes)
- 🎊 **Confetti celebration** for #1 ranked teams
- 🔄 **Count-up animations** for statistics
- ⚖️ **Team comparison modal** for side-by-side stats
- 🎯 **Animated progress bars** with smooth easing
- 🎨 **Enhanced hover effects** throughout

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Radix UI primitives
- **Animations**: Motion (formerly Framer Motion)
- **Forms**: React Hook Form
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rally-os
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
/
├── components/           # All React components
│   ├── ui/              # ShadCN UI components
│   ├── onboarding/      # Onboarding flow screens
│   ├── figma/           # Figma-related utilities
│   └── *.tsx            # Feature screens
├── styles/
│   └── globals.css      # Global styles & CSS variables
├── App.tsx              # Main app with routing
├── index.html           # HTML entry point
└── package.json         # Dependencies
```

## Component Architecture

- **AppShell**: Main navigation wrapper with bottom tabs (mobile) and sidebar (desktop)
- **Screen Components**: Individual feature screens
- **UI Components**: Reusable Radix-based ShadCN components
- **Utility Components**: Icons, widgets, cards, tiles

## Role-Based Access

The app supports two roles:
- **Player**: Can view schedules, set availability, check ratings
- **Captain**: Additional access to lineup management, analytics, roster tools

## Mock Data

The app currently uses realistic mock data for demonstration:
- **Clubs**: Merion Bocce Club, Radnor Rollers, Wayne Warriors, etc.
- **Sports**: Bocce, Pickleball, Padel
- **Divisions**: Multiple divisions with realistic team records
- **Players**: Sample rosters with ratings and stats

## Customization

### Design Tokens
Edit `/styles/globals.css` to customize:
- Colors (CSS variables)
- Typography scales
- Spacing system
- Border radius

### Adding Features
1. Create screen component in `/components/`
2. Add screen type to App.tsx
3. Add navigation in AppShell.tsx
4. Wire up routing logic

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting with Vite
- Optimized re-renders
- CSS animations for smooth UI
- Responsive images
- Lazy loading where appropriate

## Future Enhancements

Potential next steps:
- Backend integration (Supabase, Firebase, etc.)
- Real-time chat with WebSockets
- Push notifications
- Progressive Web App (PWA) features
- Advanced analytics
- Multi-language support
- Dark mode toggle
- Calendar export (iCal)

## License

[Your License Here]

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for racket sports enthusiasts
