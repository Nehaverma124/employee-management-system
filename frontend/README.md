# Employee Ledger — Frontend

A plain HTML/CSS/JavaScript frontend for the Employee Management REST API. No frameworks, no build step.

## What's new in this version
- **Login page** (`login.html`) with a mouse-tracking 3D tilt card and a soft blurred-blob background
- **Dark / light mode toggle** (sun/moon button, top right) — persists across visits via `localStorage` and respects your system preference on first visit
- **3D depth styling** — layered shadows, a subtle tilt-on-hover effect on the data table, raised buttons with pressed states, and a tilting login card

## ⚠️ Honest note on the login page
This is a **cosmetic, client-side-only** login screen. Any non-empty username and password will let you in — it is **not connected to real authentication**. It's there to make the project look and feel like a complete internal tool, and to give you something to talk about in an interview ("I added a login gate, but scoped out real auth since the assignment was about the CRUD API").

If you want **real authentication** later (recommended before this ever goes near production, or if you want to add "Spring Security" to your resume skills), the natural next step is:
- Add Spring Security + JWT to the backend
- Replace the mock check in `login.js` with a real `POST /api/auth/login` call
Ask me if you want to build that next — it's a genuinely valuable resume addition.

## Files
```
employee-frontend/
├── login.html        # sign-in screen (3D tilt card)
├── login.js           # mock auth + tilt interaction
├── index.html         # main dashboard
├── script.js            # talks to the API, handles CRUD + dashboard tilt
├── theme.js              # dark/light mode toggle, shared by both pages
├── auth.js                 # session gate + sign-out (dashboard only)
├── style.css                 # all styling, theme variables, 3D effects


## Step 1 - Backend requirement (already set up in this repo)
   CORS is configured in the backend at
   `src/main/java/com/neha/employeemanagement/config/CorsConfig.java`,
   which allows this frontend to call the API.


## Step 2 — Run the backend
Console should show `Tomcat started on port(s): 8080`.

## Step 3 — Open the frontend
Double-click **`login.html`** (not `index.html` directly — you'll be redirected to login first anyway if you try).
- Enter any username and password → **Sign in**
- You'll land on the dashboard

## Step 4 — Try dark mode
Click the sun/moon icon top-right on either page. It remembers your choice next time you open the app.

## Step 5 — Use the dashboard
Same as before: **+ New Entry**, **Edit**, **Delete**, department/salary filters, live API status dot. **Sign out** returns you to the login page.

## Troubleshooting

**Redirected to login.html in a loop / can't reach dashboard:**
→ Make sure you're opening files from the same folder (don't move `login.html` without the others) and that your browser allows `sessionStorage` (private/incognito mode sometimes restricts it — use a normal window).

**"API unreachable" dot on the dashboard:**
→ You skipped the CORS step above, or the backend isn't running.

**Dark mode doesn't stick between visits:**
→ Some browsers clear `localStorage` in private/incognito mode by design — this is expected there.


