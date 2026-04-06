# Frontend Implementation Details – LevelUp Esports Platform

## 1. Core Architecture & Tech Stack
The frontend is built using a modern, highly performant React architecture focusing heavily on animations and aesthetics. 

* **Framework:** React 19 + Vite for ultra-fast HMR and optimized builds.
* **Styling Framework:** Tailwind CSS v4, utilizing a global configuration with minimal CSS boilerplate while extensively using utility classes and dynamic CSS variables for complex glow and mask effects.
* **Routing:** `react-router-dom` v7. The app utilizes `React.lazy` and `Suspense` for route-based code-splitting, ensuring individual pages (chunks) load only when required. A custom `PageLoader` component spans the navigation transitions.
* **Animation & Visuals:** Deep integration of Framer Motion (assumed via package.json), extensive CSS animations (`keyframes`, transitions), dynamic backdrop-blur properties, overlapping gradients/grids, and complex DOM event mouse tracking. 

## 2. Directory Structure Context
```
/frontend/src/
├── assets/           # Local styling/images 
├── components/       # Reusable layout and UI elements
├── data/             # Mock JSON mapping files mapping fake databases
├── pages/            # Primary Route chunk components
├── index.css         # Global Tailwind v4 import & custom keyframes
└── App.jsx           # Main BrowserRouter, lazy-loads pages
```

## 3. UI/UX Aesthetic and Design Theme
The application adopts an **Esports / Cyberpunk Cyber Cafe** theme.
* **Color Palette:** Dominated by a deep dark background (`bg-dark`) contrasted aggressively by a vibrant Neon Green (`primary`: `#0df259`) and a secondary Purple/Magenta (`secondary`: `#a855f7`).
* **Visual Elements:** Uses floating animated background blurs (glowing orbs), raw glass-morphism (transparent black overlays with backdrop cursors), techy mesh/grid patterns, and uppercase bold fonts.
* **Cursor & Interactivity:** Custom cursor overriding the default mouse pointer natively in certain hero sections to track the user's cursor for a physical spotlight mask effect against hidden text.

## 4. Implemented Pages Breakdown

### `Home.jsx` (Landing Page)
The crown jewel of the display, heavily interactive.
* **Hero Section ("ASCEND TO GOD MODE"):** Removes standard OS cursor, creates a green dot tracking the mouse `clientX/Y`, and utilizes CSS `--mask-x`/`--y` properties to reveal hidden white text masked behind neon text natively on hover.
* **The Tech (Specs Showcase):** Feature-cards with hover-reveals highlighting the High-end PCs, Consoles, and Peripherals used at the arena.
* **Community Feedback:** Testimonial cards mapping arrays, layered with star logic and user avatars. 
* **Contact & Newsletter:** Included embedded `onSubmit` fake-handlers delivering custom success flash notification modals on screen.

### `Tournament.jsx`
Massive standalone engine for managing esports tournaments locally or online.
* **Tabs Engine:** Dynamic toggling between "Upcoming" events and "Past Records".
* **Registration Modal:** Highly customized popup with multiple step forms (Step 1: Captain Info -> Step 2: Team Roster + Game IDs), form validations, and 'Terms agreed' checkboxes.
* **Match Bracket Fixtures:** A horizontal scrollable visual representation of Quarter-Finals -> Semi-Finals -> Grand Final. Visual CSS connector lines denote progression. 
* **Hall of Fame:** Toggleable list of previous champions, displaying MVP stats, highlight text, and specific games logic. 
* **Countdown Clock:** Standard JS `setInterval` mapping mathematical difference between present time and predefined tournament target dates.  

### `Blogs.jsx` & `BlogDetails.jsx`
* A standard CMS-like feed "Intel Hub" mapping the `blogPosts.js` dummy data. Contains filtering logic by gaming categories (e.g. 'Valorant', 'Hardware', 'Events'), dynamic routing matching `/:id`, and a structured read view for articles. 

### `Gallery.jsx`
* Interactive Masonry/Grid system rendering high-quality arena images and event shots using custom `span` Tailwind values (e.g., `lg:col-span-2`) for dynamic sizing grids.

### `About.jsx`
* A static informative narrative page exploring the history, mission, and physical location maps/info for the offline Esports Lounge.

## 5. Reusable Components
* **`Header.jsx` & `Footer.jsx`:** The core navigation persistent across all layouts tracking active routing.
* **`HoverMaskReveal.jsx`:** Advanced logic abstraction for the mask tracking logic utilized to provide the 'spotlight' cursor reveals.
* **`ScrollToTop.jsx`:** Utility using `react-router-dom`'s `useLocation` hook to reset `window.scrollTo(0,0)` every time path URL changes, ensuring smooth scrolling between the lazy-loaded pages. 

## 6. Development Status 
The Frontend layer is comprehensively built. All forms function dynamically (with local React state hooks), all animations fire smoothly without memory constraints, and the design strictly adheres to a premium gaming look-and-feel. **All that is required to bring it live is switching out the local `/data` arrays with true `fetch/axios` async calls to the upcoming Backend API.**
