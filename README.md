# 🚀 WhatsApp AI SaaS Bot

A high-performance, multi-user WhatsApp automation engine with integrated AI rewriting, group scraping, and automatic status viewing. Built for scalability (500+ users) using Node.js and MongoDB.

---

## ✨ Key Features

- **🤖 AI Text Rewriter:** Integrated with Hugging Face AI to paraphrase and professionalize messages on the fly using the `!rewrite` command.
- **📊 Group Lead Extractor:** Export group member names, phone numbers, and admin status directly to a CSV file from your browser.
- **👻 Ghost Mode (Auto-Status):** Automatically view contacts' status updates the moment they are posted without opening the app.
- **☁️ Multi-User Remote Auth:** Sessions are stored in MongoDB, allowing for persistent logins across server restarts.
- **🖥️ Live Dashboard:** Real-time QR code generation and connection monitoring via Socket.io.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **WhatsApp Engine:** [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- **Database:** MongoDB (Session storage)
- **Real-time:** Socket.io
- **AI:** Hugging Face Inference API
- **Frontend:** Bootstrap 5, Javascript

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v16 or higher
- **MongoDB:** A local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URL
- **Hugging Face Token:** Get your free API key at [huggingface.co](https://huggingface.co/settings/tokens)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/my-bot.git](https://github.com/YOUR_USERNAME/my-bot.git)
   cd my-bot
   
   After cloning the repository, navigate into the project folder and immediately run npm install
   to download all necessary libraries, then create a .env file in the root directory to securely
   store your MONGODB_URI and HF_TOKEN credentials. Once your environment is set up, initialize the bot by
   running node server.js, open your browser to http://localhost:3000 to view the live dashboard,
    and finally, scan the generated QR code with your WhatsApp app to link your account and
    activate the AI features and group extraction tools.
   
