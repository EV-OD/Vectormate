# VectorMate

VectorMate is a modern, web-based vector design tool built with Next.js, React, and WebAssembly. It provides a powerful and intuitive interface for creating and editing vector graphics directly in the browser.

## ✨ Features

- **Modern UI**: A clean and intuitive user interface built with ShadCN UI and Tailwind CSS.
- **High-Performance Canvas**: Core rendering logic is powered by a C++ module compiled to WebAssembly (WASM) for near-native performance.
- **Familiar Tools**: Includes standard vector editing tools like Pen, Rectangle, Ellipse, and more.
- **Layers & Properties**: Easy-to-use panels for managing layers and inspecting object properties.
- **AI-Powered (soon!)**: Integrated with Google's Genkit for future AI-assisted design features.

## 🚀 Getting Started

This is a Next.js project. To get started, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start by editing the main editor component located at `src/components/vectormate-editor.tsx`.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Core Logic**: C++ compiled to [WebAssembly (WASM)](https://webassembly.org/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
