import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryProvider } from "@/components/common/QueryProvider";

export const metadata = {
  title: "AlgoVerify",
  description: "CV Verification App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div>{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
}
