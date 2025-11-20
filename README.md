<div align="center">
  <img src="/public/Logo.svg" alt="DustCleaner Logo" width="120" />
  <h1>DustCleaner 🧹</h1>
</div>

**Clean your Solana wallet by converting small token balances (dust) into SOL with one click.**

DustCleaner is a powerful, non-custodial tool designed to help you declutter your Solana wallet. It identifies low-value tokens ("dust") and allows you to swap them for SOL instantly using the best rates from Jupiter Aggregator.

---

## ✨ Features

*   **🚀 Lightning Fast:** Instant batch conversions for multiple tokens.
*   **🛡️ Secure & Non-Custodial:** We never hold your funds. You stay in control.
*   **📈 Best Rates:** Powered by **Jupiter Protocol** for optimal swap routes.
*   **💎 Beautiful UI:** A premium, glassmorphism-inspired interface with dark/light mode aesthetics.
*   **♿ Accessible:** Fully optimized for screen readers and keyboard navigation.
*   **📱 Responsive:** Works seamlessly on desktop and mobile.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
*   **Blockchain:** [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) + [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/dustcleaner.git
    cd dustcleaner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Solana RPC URL (optional but recommended for better performance):
    ```env
    VITE_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 📖 Usage

1.  **Connect Wallet:** Click the "Select Wallet" button in the top right corner to connect your Phantom, Solflare, or other Solana wallets.
2.  **View Tokens:** The app will automatically fetch and display all your tokens, sorting them by value.
3.  **Select Dust:** Check the boxes next to the tokens you want to convert.
4.  **Convert:** Click "Convert to SOL" to initiate the swap. Approve the transaction in your wallet.
5.  **Done!** Your dust is now clean SOL.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the DustCleaner Team.
