# 🖥️ Online Code Editor  

An interactive **web-based code editor** built with **Next.js, React 19, and Monaco Editor**, featuring real-time collaboration, authentication, and a modern UI.

## LIVE PREVIEW
[Live View](https://re-code-ditor.vercel.app/)

## 🚀 Features  

- ✨ **Code Editing** – Integrated [Monaco Editor](https://microsoft.github.io/monaco-editor/), the same editor behind VS Code.  
- 🔑 **Authentication** – User login and session management powered by [Clerk](https://clerk.com/).  
- 📡 **Backend & State** – Real-time database and API handling with [Convex](https://convex.dev/) and global state using [Zustand](https://github.com/pmndrs/zustand).  
- 🎨 **UI & Animations** – Clean design with [TailwindCSS](https://tailwindcss.com/), icons from [Lucide React](https://lucide.dev/), and animations via [Framer Motion](https://www.framer.com/motion/).  
- 🔔 **Notifications** – Toast alerts with [react-hot-toast](https://react-hot-toast.com/).  
- 📩 **Webhooks & Messaging** – Managed using [Svix](https://www.svix.com/).  

## 📂 Tech Stack  

- **Framework**: [Next.js 15](https://nextjs.org/)  
- **Frontend**: React 19, TailwindCSS 4, Framer Motion  
- **Editor**: Monaco Editor  
- **Auth**: Clerk  
- **State Management**: Zustand  
- **Backend/Realtime**: Convex  
- **Icons**: Lucide React  

## ⚡ Getting Started  

### 1. Clone the repository  
```bash
git clone https://github.com/PrathameshPowar-dan/ReCodeDitor.git
cd PrathameshPowar-dan/ReCodeDitor
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Set up environment variables  
Create a `.env.local` file and add necessary API keys (Clerk, Convex, Svix, etc.):  
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
CONVEX_DEPLOYMENT=your_key_here
SVIX_API_KEY=your_key_here
```

### 4. Run the development server  
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.  

### 5. Build for production  
```bash
npm run build
npm start
```

## 🧹 Linting  
```bash
npm run lint
```

## 🤝 Contributing  
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to improve.  

## 📜 License  
This project is licensed under the MIT License.  
