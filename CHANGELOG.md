# NeuroLearn - Changelog

> All development Happening on `pre-hackathon-setup` branch
> `master` branch untouched until hackathon starts.

---

## Initial API setup (Students and parents API)

### DataBase
- Created `students` table with: `id, scholar_no, name, class, section`
- Created `parents` table with FOREIGN KEY to `students(scholar_no)`
- Auto-schema execution on server start.
- Foreign Key constraints + `ON DELETE CASCADE`

### API Endpoints
- `GET /api/students` list all students
- `POST /api/students` create student
- `GET /api/parents` list all parents
- `POST /api/parents` create parent (validates if student exists)

### Dev Experience
- one command setup `npm install && npm run dev`
- Auto-created SQLite DB at `/db/neurolearn.sqlite`
- Modular structure: routes -> controllers -> db
- Error handling: early returns, proper status codes

### Documentation
- `docs/API_setup.md` setup guide and endpoints
- Clear folder structure documented

### Testing
- Tested via curl:
    - Student creation: success
    - parents creation: success (with student exist validation)


