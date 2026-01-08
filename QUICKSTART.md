# Quick Start Instructions

## Current Status
✅ Backend server is running on port 8000  
⏳ Docker Desktop is starting...  
❌ Database is not yet available

## Next Steps

### 1. Wait for Docker Desktop to Start
Look for the **Docker whale icon** in your system tray (bottom-right corner). Wait until it stops animating and shows "Docker Desktop is running".

This usually takes **30-60 seconds**.

### 2. Start the Database
Once Docker is ready, run:
```powershell
docker-compose up -d postgres
```

Wait about 10 seconds for PostgreSQL to initialize.

### 3. Restart the Backend
Since the backend is already running but couldn't connect, **stop it** (Ctrl+C in the terminal) and restart:
```powershell
npm start
```

You should now see:
- ✅ "Database schema initialized."
- ✅ "Test merchant exists." (or "seeded")
- ✅ "Server running on port 8000"

### 4. Test the Login

**Option A: Run verification script**
```powershell
node verify_fix.js
```

**Option B: Use browser**
1. Start frontend: `cd frontend && npm run dev`
2. Open the URL shown (usually http://localhost:5173)
3. Login with email: `test@example.com`
4. Password: (anything or leave empty)

---

## Troubleshooting

**If Docker Desktop won't start:**
- Check if it's already running (system tray icon)
- Try restarting your computer
- Ensure Windows virtualization is enabled

**If "docker-compose" command fails:**
- Docker Desktop is still starting, wait a bit longer
- Check the Docker Desktop dashboard for errors
