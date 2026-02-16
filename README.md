# Assistant Prompt 

<div align="center">
<br/>
<!-- <img src="public/vite.svg" width="120px" alt="Logo"> -->
<br/>

![GitHub stars](https://img.shields.io/github/stars/pr-elhajji/assistant-prompt?style=social)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://pr-elhajji.github.io/assistant-prompt/)

![GitHub forks](https://img.shields.io/github/forks/pr-elhajji/assistant-prompt?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/pr-elhajji/assistant-prompt?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/pr-elhajji/assistant-prompt)
![GitHub last commit](https://img.shields.io/github/last-commit/pr-elhajji/assistant-prompt)

</div>
<br>
A powerful, interactive web application for generating high-quality AI prompts using pedagogical methods (RCT, CRAFT, CONTEXTE-V, etc.).

[**✨ Try the Live Demo Here**](https://pr-elhajji.github.io/assistant-prompt/)
<div align="left">

## 🚀 Features

- **Multi-Method Support**: Generate prompts using standard frameworks like RCT, CRAFT, RTF, and more.
- **Dynamic Forms**: Interactive forms that adapt to your selected method and inputs.
- **AI Assistant Integration**:
    - ✨ **Magic Wand**: Use AI to auto-complete or improve specific fields.
    - ⚙️ **Multi-Provider**: Connect to **Ollama** (Local), **OpenAI** (GPT), or **Google Gemini**.
    - 🌡️ **Temperature Control**: Adjust creativity levels.
- **Internationalization (i18n)**: Fully translated into **English**, **French**, and **Arabic** (with RTL support).
- **Prompt Management**:
    - 💾 Save and manage your favorite prompts locally.
    - 📋 One-click copy to clipboard.
- **Extensible Data**: Roles, contexts, and tasks are loaded from a Markdown file (`data.md`), making it easy to update content without coding.

## 🛠️ Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/pr-elhajji/assistant-prompt.git
   cd assistant-prompt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the URL shown in your terminal).

## 🤖 AI Configuration

To use the AI features, click the **Settings** (⚙️) icon in the header.

### 1. Ollama (Local AI) - Recommended
- **Install Ollama**: [Download here](https://ollama.com/)
- **Pull a model**: `ollama pull llama3` (or mistral, phi3, etc.)
- **Start Server**: You must start Ollama with CORS enabled:
  ```bash
  OLLAMA_ORIGINS="*" ollama serve
  ```
- **In App Settings**:
  - Provider: **Ollama**
  - URL: `http://localhost:11434`
  - Model: Click **"Fetch Models"** to select from your installed models.

### 2. OpenAI
- **API Key**: Required (starts with `sk-...`).
- **Model**: `gpt-3.5-turbo`, `gpt-4`, etc.

### 3. Google Gemini
- **API Key**: Required (from AI Studio).
- **Model**: `gemini-pro`.

## 🏗️ Project Structure

```
src/
├── components/       # UI Components (Header, DynamicForm, Modals...)
├── hooks/            # Custom React Hooks (useMarkdownData)
├── services/         # API Services (aiService.js)
├── utils/            # Helper functions (parsers, generators)
├── config/           # Form configuration (methods.js)
├── App.jsx           # Main Application Component
└── main.jsx          # Entry Point
public/
├── data/             # data.md (Content Source)
└── locales/          # Translation files (en/fr/ar)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

This project uses [GitHub Pages](https://pages.github.com/) for hosting.

To deploy a new version:

1.  Make sure your changes are committed.
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    This will automatically build the project and push the `dist` folder to the `gh-pages` branch.

## 👏 Credits

Created by [El Hajji](https://github.com/pr-elhajji) - Let's make Prompting even more amazing together! 💪
Based on pedagogical prompt engineering methods
