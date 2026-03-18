# Testing Documentation

## Unit Tests
Located in `src/lib/` — tests for core utility modules:
- `testSearch.js` — furniture search functionality
- `testGridSnap.js` — snap-to-grid calculations
- `testHistory.js` — undo/redo history manager
- `testSelection.js` — furniture selection manager

## API Testing
Postman collections located in `/postman/collections/`
Covers all API endpoints:
- Auth (login, register, logout, me)
- Projects (CRUD)
- Templates
- Furniture catalog

## Manual Testing Checklist
- [x] User registration and login
- [x] JWT authentication with HttpOnly cookies
- [x] Dashboard loads projects and templates
- [x] 2D editor — drag, drop, resize, rotate furniture
- [x] 2D editor — snap to grid, collision detection
- [x] 2D editor — undo/redo (Cmd+Z / Cmd+Shift+Z)
- [x] 2D editor — PNG export
- [x] 3D editor — orbit, zoom, furniture visualization
- [x] Shop — browse by category, filter furniture
- [x] Materials — color customization, Configure in 3D
- [x] Templates — create project from template
- [x] Dark mode toggle
- [x] Settings page
- [x] Responsive sidebar collapse
