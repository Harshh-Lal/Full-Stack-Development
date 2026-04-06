# Product Requirements Document (PRD) – LevelUp Esports Platform

## 1. Project Overview
**Name:** LevelUp (Esports Arena & Tournament Platform)
**Objective:** To build a robust, scalable backend for the LevelUp Esports lounge, facilitating players to explore physical/online gaming events, read gaming blogs, browse event galleries, and seamlessly register for esports tournaments. 
**Current State:** The frontend is fully developed with React, Vite, Tailwind CSS v4, Framer Motion, and 3D Spline elements. The UI features dynamic pages like Home, Blogs, Blog Details, Gallery, About, and Tournament. The backend now needs to be built from scratch to replace the hardcoded frontend data with dynamic content and functional systems.

## 2. In Scope
- **User Authentication / Authorization:** Role-based access (Public User, Registered Player/Captain, Admin). Admin dashboard capabilities (headless or integrated) to manage the platform.
- **Tournament Management:** Create, update, and manage tournaments (games include VALORANT, BGMI, FIFA 25, FREE FIRE, etc.).
- **Registration System:** Secure team/player registration for upcoming tournaments, tracking slots, entry fees, and confirmation emails.
- **Match Brackets:** Dynamic updating of tournament fixtures (Quarter Finals, Semi Finals, Grand Final) and tracking live scores.
- **Hall of Fame & Past Records:** Storing past tournament results, MVPs, and statistics.
- **Blog Engine:** CMS capabilities to publish, edit, and read gaming news/articles.
- **Gallery Engine:** Dynamic loading of arena and tournament event images.

## 3. Technology Stack
### Frontend (Completed)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Animations / 3D:** Framer Motion, `@splinetool/react-spline`
- **Routing:** React Router v7

### Proposed Backend (To Begin)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ORM) - *ideal for document-heavy records like blogs and flexible tournament structures.*
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing.
- **File Upload:** Multer + Cloudinary (or AWS S3) for Blog images and Gallery uploads.
- **Email Service:** Nodemailer / SendGrid for sending registration confirmations to users.

## 4. Architecture & Flow
The application will follow a standard Client-Server Architecture utilizing RESTful JSON APIs.

### High-Level Flow:
1. **Visitor Flow:** Lands on Home -> Browses Tournaments -> Views Blogs / Galleries. (Read-only data fetched from public API endpoints).
2. **Player Registration Flow:** Clicks "Register" on an upcoming tournament -> Submits Captain details, Team members, Game IDs -> Backend validates slot availability -> creates Registration Record -> Sends Confirmation Email -> Updates "Filled Slots" count in the Tournament logic.
3. **Admin Flow:** Logs in via a secure route -> Receives JWT admin token -> Can perform CRUD operations on Tournaments, update bracket match scores, post blogs, and upload gallery images.

## 5. Core Features & Functional Requirements

### A. Tournament Module
- **List Tournaments:** Upcoming (open for registration) vs. Past (Records).
- **Registration Tracking:** Prevent registration if `filled_slots >= max_slots`.
- **Match Brackets System:** Manage teams advancing through Quarter => Semi => Final rounds.

### B. Blogs Module
- **Blog schema:** Requires Title, Slug, Content (Markdown/HTML), Cover Image, Author, Read Time, and Created Date.

### C. Team / Player Module
- Store basic information capturing Game IDs (e.g., Riot ID, BGMI ID) and contact info (Email, Phone) needed for tournament check-ins and announcements.

## 6. Proposed Database Schema (MongoDB / Mongoose)

**`Tournament` Collection**
- `title` (String), `game` (String), `date` (Date), `time` (String)
- `prizePool` (String), `maxSlots` (Number), `filledSlots` (Number)
- `format` (String), `entryFee` (Number/String), `status` (Enum: 'upcoming', 'ongoing', 'completed')
- `rules` ([String]), `bannerImage` (String)

**`Registration` (Team) Collection**
- `tournamentId` (Ref: Tournament)
- `teamName` (String)
- `captainName` (String), `email` (String), `phone` (String)
- `players` ([String]), `gameIds` ([String])
- `paymentStatus` (Enum: 'pending', 'paid')

**`MatchFixture` Collection**
- `tournamentId` (Ref: Tournament)
- `round` (String - eg. 'Quarter Finals')
- `team1` (String), `team2` (String)
- `score1` (Number), `score2` (Number)
- `status` (Enum: 'scheduled', 'live', 'completed')
- `matchDate` (Date)

**`Blog` Collection**
- `title` (String), `content` (String), `author` (String)
- `coverImage` (String), `tags` ([String])

## 7. Next Steps for Backend Development
1. **Initialize Backend Workspace:** Set up `package.json`, install `express`, `mongoose`, `dotenv`, `cors`.
2. **Server & Database Setup:** Create basic `server.js` and connect to MongoDB cluster (e.g. MongoDB Atlas).
3. **Build Models:** Translate the schema above into Mongoose models.
4. **Develop Routing & Controllers:**
   - `GET /api/tournaments` (Fetch list)
   - `POST /api/tournaments/register` (Handle form submission from frontend)
   - `GET /api/blogs`
5. **Form Integration:** Replace frontend mock data states with `useEffect` generic `fetch` or `axios` calls pointing to the new backend.
6. **Authentication & Admin:** Secure endpoints so only authorized personnel can add Tournaments/Blogs.
