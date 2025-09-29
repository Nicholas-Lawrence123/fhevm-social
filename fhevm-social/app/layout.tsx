import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FHEVM Social - 链上朋友圈",
  description: "基于FHEVM的加密朋友圈应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <MetaMaskProvider>
          <MetaMaskEthersSignerProvider initialMockChains={{ 31337: "http://localhost:8545" }}>
            <InMemoryStorageProvider>
              {children}
            </InMemoryStorageProvider>
          </MetaMaskEthersSignerProvider>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
