# 🧠 AI Reports Dashboard

A powerful report management application enhanced with AI capabilities. It enables creating, editing, reordering, and summarizing reports using OpenAI.

---

## ✅ Features

- ✍️ Create and edit reports using the **TinyMCE** rich text editor  
- 🧠 **AI-powered** summary generation using **OpenAI**  
- 🔍 Search and filter through reports  
- 🔀 Drag-and-drop reordering using **dnd-kit**  
- 🗑️ Edit and delete existing reports  
- 🎨 Modern, responsive UI built with **Material UI**

---

## ⚙️ Getting Started

1. Install project dependencies:
   `npm install`

2. Start both the client and the proxy server:
   `npm run dev:all`

- The client will be available at: [http://localhost:3000](http://localhost:3000)  
- The proxy server will be running at: [http://localhost:4000](http://localhost:4000)

---

## 🌐 Proxy Server

To securely communicate with OpenAI, the application uses a local proxy server located in the `/server` directory. This ensures that your OpenAI API key is never exposed on the frontend.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

VITE_TINYMCE_API_KEY=your_tinymce_api_key_here
OPEN_AI_KEY=your_openai_key_here
