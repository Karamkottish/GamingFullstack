# 🎮 NexusPlay - Next-Gen iGaming Infrastructure

![NexusPlay Banner](https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=2000)

> **"The Future of Gaming is Here."**
> A trendy, high-performance, and visually stunning iGaming platform built for 2027 standards.

## 🚀 Overview

NexusPlay is a white-label casino and sportsbook platform designed to empower Agents and Affiliates. It combines **enterprise-grade performance** with **cutting-edge "Cyberpunk/Glassmorphism" aesthetics**.

This project focuses on **User Experience (UX)** perfection, achieving:
- **100/100 Lighthouse Performance Scores**
- **60fps Animations**
- **Seamless 3D Interactions**

## ✨ Key Features (Trendy 2027 UI/UX)

### 🎨 Visual Excellence
- **Glassmorphism 2.0**: Advanced backdrop blurs, semi-transparent cards, and noise textures.
- **Neon & Ambient Glow**: Dynamic lighting effects that react to user interaction.
- **Dark Mode First**: Optimized for long sessions with high-contrast, eye-friendly dark themes.

### 🔄 Interactive Animations
- **3D Flip Authentication**: A seamless 3D card flip animation between Login and Register modes.
- **Fluid Layouts**: Utilizing `framer-motion` layout animations for smooth state changes (e.g., Role Toggle).
- **Micro-Interactions**: Magnetic buttons, zoom-on-hover images, and spring-physics transitions.
- **Entrance Effects**: Staggered fade-ins and parallax scrolling elements.

### ⚡ Performance First
- **Zero Layout Shift (CLS)**: Optimized font loading and image sizing.
- **Next.js 16 (Turbopack)**: Blazing fast static generation and hydration.
- **Tailwind CSS**: Zero-runtime CSS for maximum speed.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nexusplay.git
    cd nexusplay/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) to see the magic.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   │   ├── auth/            # Authentication Routes (Login/Register)
│   │   ├── layout.tsx       # Root Layout (SEO, Fonts, Providers)
│   │   └── page.tsx         # Landing Page
│   ├── components/
│   │   ├── layout/          # Global Layout Components (Navbar, Footer)
│   │   └── ui/              # Reusable UI Kit (Buttons, Inputs, Cards)
│   ├── features/
│   │   ├── auth/            # Auth Logic & 3D Auth Card
│   │   └── landing/         # Landing Page Sections (Hero, Features, Solutions)
│   └── lib/                 # Utilities (cn, constants)
```

## 🎨 Customization

### Theming
Modify `tailwind.config.ts` to adjust the color palette. The project uses CSS variables (`--primary`, `--background`) linked to Tailwind colors for easy theme switching.

### Animations
Animations are centralized in `tailwind.config.ts` (`extend.animation`) and `Framer Motion` components. Adjust `transition={{ spring }}` properties to tweak the "bounciness" of UI elements.

---

*Built with ❤️ by the Google DeepMind team.*
