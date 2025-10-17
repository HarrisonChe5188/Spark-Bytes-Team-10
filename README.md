# Spark!Bytes

## Prerequisites
Ensure the following dependencies are installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/en/download/) and npm (bundled with Node.js)
- [Git](https://git-scm.com/downloads)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/HarrisonChe5188/Spark-Bytes-Team-10.git
cd Spark-Bytes-Team-10
```

### 2. Backend Setup (FastAPI)
```bash
cd server
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup (Next.js)
```bash
cd client
npm install
```

## Usage

### Start the Backend
```bash
cd server
source venv/bin/activate   # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```
The backend will be available at http://localhost:8000.

### Start the Frontend
```bash
cd client
npm run dev
```
The frontend will be available at http://localhost:3000.