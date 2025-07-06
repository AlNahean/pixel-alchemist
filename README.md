# ✨ Pixel Alchemist

Turn your photos into mesmerizing, interactive 3D art with WebGL shaders and AI. This open-source tool uses AI to generate depth and edge maps from your images, then applies stunning visual effects that react to your cursor.

_(Recommendation: Create a short GIF showing the effects and replace the link above. This is crucial for grabbing attention!)_

### Live Demo

<!-- [![Pixel Alchemist Preview](https://raw.githubusercontent.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>/main/.github/assets/pixel-alchemist-preview.gif)](https://pixel-alchemist.vercel.app) -->

[**pixel-alchemist.vercel.app**](https://pixel-alchemist.vercel.app) _(Replace with your deployed URL)_

---

## 🚀 Features

- **Interactive 3D Effects**: GPU-accelerated WebGL shaders create visuals that respond to mouse movement.
- **AI-Powered Analysis**: An AI model (running on the backend) automatically generates high-quality depth maps from your uploaded images.
- **Edge Detection**: A secondary computer vision process creates an edge map for unique "flow" effects.
- **Modern Frontend**: Built with Next.js, React Three Fiber, and TypeScript for a fast, type-safe experience.
- **Drag & Drop Interface**: An intuitive and clean UI for uploading images.
- **Performant Backend**: A lean FastAPI server handles the heavy lifting of image processing.

## 🛠️ Tech Stack

| Area         | Technologies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-000000?style=for-the-badge&logo=three.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Backend**  | ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white) ![HuggingFace](https://img.shields.io/badge/🤗%20Hugging%20Face-yellow?style=for-the-badge) ![OpenCV](https://img.shields.io/badge/OpenCV-27338e?style=for-the-badge&logo=OpenCV)                                                                                                      |

---

## ⚙️ Getting Started & How to Run

Follow these steps to get Pixel Alchemist running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/downloads/) (v3.9 or later) & `pip`
- `git` for cloning the repository

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pixel-alchemist.git
cd pixel-alchemist
```

### 2. Backend Setup (Python)

The backend is responsible for the AI and image processing.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (recommended)
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
.\venv\Scripts\activate

# Install the required Python packages
# Note: This may take a while as it downloads PyTorch and other large libraries.
pip install -r requirements.txt

# Run the FastAPI backend server
uvicorn main:app --reload
```

Your backend is now running at `http://localhost:8000`. The first time it runs, it will download the AI model from Hugging Face, which might take a few minutes.

### 3. Frontend Setup (Next.js)

Open a **new terminal window** for these commands.

```bash
# Navigate back to the project root (if you are in the backend folder)
cd ..

# Install the frontend dependencies
npm install
# or yarn install or pnpm install

# Create a local environment file by copying the example
# On macOS/Linux:
cp .env.example .env.local
# On Windows:
copy .env.example .env.local

# The .env.local file will point to your local backend. No changes are needed
# if you followed the backend setup steps. It should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000/process-image/

# Run the frontend development server
npm run dev
```

### 4. You're All Set!

Open your browser and navigate to [**http://localhost:3000**](http://localhost:3000). You should see the Pixel Alchemist application running!

---

## 🔧 Configuration

- **Image Uploads**: You can disable the image upload feature and run the app in "demo-only" mode by setting `ALLOW_IMAGE_UPLOADING` to `false` in `src/app/page.tsx`.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
