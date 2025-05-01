# 🎬 YouTube Clone Project 🚀

## ✨ Overview

Hey there! 👋 This project is a YouTube clone built with all the cool stuff: Next.js, TypeScript, and more! 🤩 It's got the core YouTube vibes, like video uploads, streaming, and secure user logins.

Check it out live on Vercel: [https://youtube-clone-eta-lyart-26.vercel.app/](https://youtube-clone-eta-lyart-26.vercel.app/) 🚀

## 🛠️ Technologies Used

*   **Next.js:** ⚛️ The React framework for building super-fast web apps.
*   **TypeScript:** ⌨️ Makes JavaScript safer and easier to manage.
*   **TRPC:** 📡 End-to-end typesafe APIs
*   **Drizzle ORM:** 💧 A modern, typesafe ORM for talking to the database.
*   **Upstash:** ⚡ Redis database for quick data access.
*   **Mux:** 📹 Handles all the video streaming magic.
*   **Tailwind CSS:** 🎨 For making the app look pretty.
*   **Zod:** ✅ Validates your data to keep things clean.
*   **Clerk:** 🔑 Handles user accounts and authentication.
*   **QStash:** ✉️ A reliable way to send messages in the background.
*   **OpenAI:** 🧠 Adds some AI smarts to the project.

## 🌟 Features

*   **🔑 User Authentication:** Secure logins with Clerk.
*   **⬆️ Video Uploading:** Upload your own videos to Mux.
*   **▶️ Video Streaming:** Watch videos in high quality.
*   **💾 Database Integration:** Stores all the video info in Upstash.
*   **🔄 Real-time Updates:** Keeps everything fresh with WebSockets or SSE.
*   **📱 Responsive Design:** Works great on phones, tablets, and desktops!

## ⚙️ Environment Variables

You'll need these in your `.env.local` file:

*   `UPSTASH_WORKFLOW_URL`: Upstash workflow URL
*   `QSTASH_CURRENT_SIGNING_KEY`: QStash current signing key
*   `QSTASH_NEXT_SIGNING_KEY`: QStash next signing key
*   `OPENAI_API_KEY`: OpenAI API key
*   `NEXT_PUBLIC_APP_URL`: Your app's URL

## 🚀 Getting Started

1.  **Clone the repo:**

    ```bash
    git clone <repository_url>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure `.env.local`:**

    Add the environment variables listed above.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open your browser:**

    Go to `http://localhost:3000` 🎉

## 🤝 Contributing

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/<your_github_username>/<your_repo_name>/issues)

We'd love your help! 🐛 Report bugs or suggest new features.

## 📜 License

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is under the [MIT License](LICENSE).