# Portfolio Website

A modern portfolio website built with HTML, JavaScript, and TailwindCSS.

## Project Structure

```
src/
  assets/          # Media files (images, videos)
    images/        # Image assets (PNG, JPG, etc.)
    videos/        # Video assets (MP4)
  components/      # Reusable UI components
    chat/         # Chat functionality components
    navigation/   # Navigation and menu components
    skills/       # Skills section components
  styles/         # CSS stylesheets
  pages/          # HTML pages (index, contact, etc.)
  utils/          # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.template` to `.env` and configure environment variables
4. Build TailwindCSS:
   ```bash
   npm run build:css
   ```
5. Open `src/pages/index.html` in your browser

## Features

- 📱 Responsive design for all devices
- 💬 Interactive chat functionality
- 🎯 Dynamic navigation with animations
- 💪 Skills showcase section
- 📂 Portfolio projects display
- 📝 Contact form
- 🎨 Modern UI with TailwindCSS
- 🎥 Engaging video elements

## Technologies

- HTML5
- JavaScript (ES6+)
- TailwindCSS
- CSS3

## Project Organization

- All media assets are organized in dedicated folders
- Components are modular and reusable
- Styles are separated into component-specific and global files
- Clear separation of concerns with dedicated directories
- Environment variables for sensitive data

## Development

- Use TailwindCSS for styling
- Follow component-based architecture
- Keep JavaScript modules small and focused
- Maintain clean separation of concerns
- Document any new features or changes

## License

MIT License - feel free to use this project as a template for your portfolio!
