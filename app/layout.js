import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import "./globals.css";

import { dbConnect } from "@/services/mongo";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eventry - Make simple your event.",
  description: "A event management website.",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
