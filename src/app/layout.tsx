import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foood",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Trispace:wght@100..800&family=Playfair+Display:wght@700&family=Vollkorn:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ scrollBehavior: "smooth" }}>{children}</body>
    </html>
  );
}
