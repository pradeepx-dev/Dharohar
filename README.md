# Dharohar - Student Project Showcase

![Dharohar Banner](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop)
<!-- Replace with actual banner if available -->

**Dharohar** is a modern, responsive web application designed for students to showcase their academic and personal projects. It serves as a central hub where innovation meets community, allowing users to discover, share, and interact with projects across various domains.

## 🚀 Features

-   **Authentication**: Secure login via Google (Firebase Auth).
-   **Project Management**:
    -   **Create**: Submit new projects with details like title, description, tech stack, and category.
    -   **Update**: Edit existing project details and images.
    -   **Delete**: Remove projects you no longer wish to showcase.
-   **Image Storage**: High-Speed image hosting via ImgBB for project thumbnails and screenshots.
-   **Interactive UI**:
    -   **Favorites**: Like projects to save them to your personal "Favorites" list (updates instantly!).
    -   **Categories**: Browse projects by specific technology or domain.
    -   **Search**: Find projects easily (planned/implemented).
-   **User Profile**: View your submitted projects and favorited items in one place.
-   **Dark Mode**: Fully responsive dark/light mode execution using Tailwind CSS.
-   **Modern Design**: Built with a sleek, glassmorphic aesthetic using Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Backend / Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
-   **Image Storage**: [ImgBB API](https://api.imgbb.com/)
-   **Routing**: [React Router DOM](https://reactrouter.com/) (HashRouter)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) or yarn
-   A basic understanding of React and Firebase.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/dharohar.git
    cd dharohar
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` or `.env.local` file in the root directory and add the following keys. You will need to set up a Firebase Project and an ImgBB account.

    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    # ImgBB Configuration
    VITE_IMGBB_API_KEY=your_imgbb_api_key
    ```
    > **Note**: Get your ImgBB API key from [api.imgbb.com](https://api.imgbb.com/).

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📂 Project Structure

```
dharohar/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Auth/        # Auth guards (ProtectedRoute)
│   │   ├── Layout/      # Navbar, Footer
│   │   └── UI/          # Buttons, Cards, Skeletons
│   ├── context/         # React Context (Auth, Toast)
│   ├── pages/           # Application Pages (Home, Profile, forms)
│   ├── services/        # API services (Firebase, ImgBB)
│   ├── types/           # TS Interfaces (Project, User)
│   ├── App.tsx          # Main Application Component
│   ├── index.css        # Global Styles & Tailwind config
│   └── main.tsx         # Entry point
├── .env.local           # Environment variables (gitignored)
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by Pradeep Kumar Maurya
</div>
