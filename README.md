# ScholarKnights

**ScholarKnights** is a full-stack platform built to help UCF students find, join, and manage group study sessions. The app supports real-time filtering, session management, and account-based access across both web and mobile platforms.

The project was built as part of a software engineering course and was deployed live with full authentication, course filtering, and group creation/joining functionality.

---

## Core Tech Stack

- **Frontend (Web):** React.js, TypeScript, Vite, TailwindCSS
- **Mobile App:** Flutter, Dart
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Deployment:** Vercel (Frontend), DigitalOcean (Backend/API), MongoDB Atlas

---

## Live Links

- Web App: [https://scholarknights.com](https://scholarknights.com)
- Mobile App: (APK build available on request)
- GitHub Repo: [https://github.com/kalypso2/scholar-knights](https://github.com/kalypso2/scholar-knights)

---

## Key Features

- User registration and login with email verification
- Create, search, and join study sessions by course, tags, and time
- Role-based session controls (owner vs. member)
- Password reset, pending invites, session details view
- Responsive UI (mobile-first for web, dedicated Flutter app for mobile)
- Backend validation, RESTful APIs, and JWT-based authentication

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Dart/Flutter (for mobile build)

### Setup

#### Web
```bash
git clone https://github.com/kalypso2/scholar-knights.git
cd scholar-knights/web
npm install
npm run dev
```
### Tools Used

Postman (API testing)

Figma (UI planning)

Trello (project tracking)

GitHub Projects (milestone tracking)

## Notes

Uses MongoDB Atlas with user-course associations

Role-based access control for session ownership

Clean REST API separation for easier mobile/web integration

Hosted backend at https://scholarknights.com/api/
