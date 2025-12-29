# ⚡ QUICK SETUP - TL;DR Version

**For experienced developers who just need the commands:**

---

## 📋 Prerequisites Check

```bash
python --version   # Need 3.8+
node --version     # Need 14+
npm --version      # Need 6+
```

---

## 🚀 Setup Commands

### 1. Clone & Enter
```bash
git clone https://github.com/Sujay149/agnite-hackathon.git
cd agnite-hackathon
```

### 2. Backend Setup
```bash
# Create venv
cd backend
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your OpenRouter API key

# Start server (from project root)
cd ..
python -m uvicorn main:app --reload --port 8000 --app-dir backend/app
```

### 3. Frontend Setup (New Terminal)
```bash
cd agnite-hackathon/frontend
npm install
npm run dev
```

---

## 🎯 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔑 Get OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up/login
3. Navigate to "Keys"
4. Create new key
5. Copy key (starts with `sk-or-v1-`)
6. Paste into `backend/.env`

---

## ✅ Test It Works

Type in chat:
```
Explain the lockout–tagout (LOTO) procedure in simple terms
```

Should get conceptual explanation with disclaimer ✅

---

## 🆘 Common Fixes

**Port in use?**
```bash
# Backend
uvicorn main:app --reload --port 8001 --app-dir backend/app

# Frontend (auto-switches to 5174)
npm run dev
```

**Module errors?**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**API key issues?**
- Check `.env` exists in `backend/` folder
- No extra spaces around key
- Key starts with `sk-or-v1-`

---

## 📚 Full Documentation

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Testing Guide**: See `QUICK_START.md` and `test_compliance.md`
- **Technical Details**: See `COMPLIANCE_FIXES.md`
- **Evaluation Report**: See `EVALUATION_REPORT.md`

---

**That's it!** 🚀 You're ready to test the judge-safe AI compliance system.
