import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Buztle - Event Management & Volunteer Networking",
  description: "Connect with opportunities, manage events, and build your volunteer network with Buztle.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Buztle - Event Management & Volunteer Networking",
    description: "Connect with opportunities, manage events, and build your volunteer network with Buztle.",
    url: "https://buztle.jayviramgami.site",
    siteName: "Buztle",
    images: [
      {
        url: "https://buztle.jayviramgami.site/logo.png",
        width: 512,
        height: 512,
        alt: "Buztle Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Buztle - Event Management & Volunteer Networking",
    description: "Connect with opportunities, manage events, and build your volunteer network with Buztle.",
    images: ["https://buztle.jayviramgami.site/logo.png"],
  },
};

// Theme initialization script - runs before React hydrates
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
