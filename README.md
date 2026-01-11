# Signlys 🖊️

> **Free Online PDF Signature Editor** - Add digital signatures to your PDF documents in seconds.

Signlys is a modern, privacy-focused web application that allows you to sign PDF documents directly in your browser. No registration required, no data uploaded to servers - everything happens locally on your device.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

- **📝 Multiple Signature Methods**

  - Draw signatures with mouse or touchscreen
  - Upload signature images (PNG/JPG)
  - Type text signatures

- **📄 Multi-Page Support**

  - Add signatures to multiple pages
  - Copy signatures across all pages with one click
  - Navigate through PDF pages easily

- **🎨 Modern UI/UX**

  - Clean, intuitive interface
  - Dark mode support with next-themes
  - Fully responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions

- **🔒 Privacy & Security**

  - 100% client-side processing
  - No data uploaded to servers
  - Works offline after initial load
  - Open source and transparent

- **⚡ Performance**
  - Built with Next.js 16 and React 19
  - Fast PDF rendering with react-pdf
  - Optimized for modern browsers

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rifqiagniamubarok/pdf-editor.git
cd signlys
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

### Core Technologies

- **[Next.js 16.1.1](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19.2.3](https://reactjs.org/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI & Styling

- **[NextUI](https://nextui.org/)** - Modern React UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Beautiful and customizable icons
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support
- **[Inter Font](https://fonts.google.com/specimen/Inter)** - Modern typography

### PDF & Signature Features

- **[pdf-lib](https://pdf-lib.js.org/)** - Create and modify PDF documents
- **[react-pdf](https://github.com/wojtekmaj/react-pdf)** - Display PDFs in React
- **[react-signature-canvas](https://github.com/agilgur5/react-signature-canvas)** - Capture signatures
- **[react-dnd](https://react-dnd.github.io/react-dnd/)** - Drag-and-drop functionality

## 📖 Usage

### Basic Workflow

1. **Upload PDF**: Click "Start Signing Now" or drag-and-drop your PDF file
2. **Create Signature**:
   - Click "Add Signature" button
   - Choose to draw or upload your signature
   - Save your signature
3. **Position Signature**:
   - Drag and drop signature to desired location
   - Resize if needed
   - Copy to multiple pages if required
4. **Download**: Click "Download" to save your signed PDF

### Keyboard Shortcuts

- `Delete` / `Backspace` - Remove selected signature
- `Esc` - Close modals

## 🎨 Customization

The app uses a custom color scheme defined in [tailwind.config.ts](tailwind.config.ts):

- **Primary Colors**: Blue tones (`#1E3A8A` light, `#3B82F6` dark)
- **Secondary Colors**: Green tones (`#10B981` light, `#34D399` dark)
- **Tertiary Colors**: Gray backgrounds (`#F1F5F9` light, `#111827` dark)

You can customize these colors by editing the Tailwind configuration file.

## 🏗️ Project Structure

```
signlys/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Landing page
│   │   ├── editor/
│   │   │   └── page.tsx        # PDF editor page
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── PdfEditor/
│       │   ├── index.tsx       # Main PDF editor component
│       │   ├── SignModal.tsx   # Signature creation modal
│       │   ├── SidebarEditor.tsx
│       │   ├── DraggableSignature.tsx
│       │   ├── DropArea.tsx
│       │   └── DropFile.tsx
│       └── partial/
│           ├── ButtonNigtmode.tsx  # Dark mode toggle
│           └── MobileVersion.tsx
├── public/
│   └── pdf.worker.mjs          # PDF.js worker
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rifqi Agnia Mubarok**

- GitHub: [@rifqiagniamubarok](https://github.com/rifqiagniamubarok)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [NextUI](https://nextui.org/)
- Icons from [Lucide](https://lucide.dev/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/) and [react-pdf](https://github.com/wojtekmaj/react-pdf)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
