# Full-Stack Telegram Bot Creator

> **LATEST UPDATE (Bug Fix):** A final bug was found and fixed where protected API routes (like adding a bot) were failing after registration. The authentication middleware has been updated. The code in the latest pull request is now complete and fully functional. Please follow the instructions below.

This project is a full-stack web application that allows users to create and manage their own Telegram bots. Users can register for an account, add bots using their Telegram API tokens, and define custom commands and replies for each bot. The backend is built with Node.js, Express, and MySQL (using Sequelize), while the frontend is a modern React application built with Vite.

---

## Prerequisites

- **Node.js and npm:** Make sure you have a recent version of Node.js installed.
- **MySQL Server:** You need a running MySQL database instance.

---

## How to Run the Application

To run this application, you need to start both the backend and frontend servers.

### 1. Backend Setup

The backend server handles all the API logic and communication with the Telegram API.

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Configure Environment Variables:**
    The backend requires a `.env` file for configuration. Copy the example file:
    ```bash
    cp .env.example .env
    ```
    Now, **edit the `.env` file** with your specific configuration:
    - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: Your MySQL database credentials.
    - `JWT_SECRET`: A long, random string for securing tokens.
    - `WEBHOOK_DOMAIN`: The public URL of your server. For local testing, it's highly recommended to use **ngrok**. Run `ngrok http 5000` and use the provided URL.

3.  **Start the Server in the Background:**
    To run the frontend and backend at the same time, you need to run the backend process in the background. The best way to do this is with `screen`.

    - **Stop any existing server** by pressing `Ctrl+C`.
    - **Start a new `screen` session:**
      ```bash
      screen -S backend
      ```
    - **Inside the screen session, start the server:**
      ```bash
      npm start
      ```
    - **Detach from the session:** Press `Ctrl+A`, then `D`. The backend is now running.

    *(To re-enter the backend session later, use `screen -r backend`)*

### 2. Frontend Setup

The frontend is the user interface you will interact with in your browser.

1.  **Open a NEW terminal window or tab.**
2.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Frontend Server:**
    To make the server accessible from your IP address, use the `--host` flag.
    ```bash
    npm run dev --host
    ```
    The terminal will give you a "Network" URL to open in your browser.

### 3. Testing the Full Application

1.  Open the "Network" URL for the frontend in your browser.
2.  Register for a new account and log in.
3.  On the dashboard, add a new bot using a token from Telegram's **@BotFather**.
4.  Manage the bot's commands, adding a test command like `/hello` with a reply.
5.  Go to Telegram, find your bot, and send it the `/hello` command. It should reply correctly.
