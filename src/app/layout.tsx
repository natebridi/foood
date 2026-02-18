import type { Metadata } from "next";
import "./recipes.css";

export const metadata: Metadata = {
  title: "Foood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hammersmith+One&family=Playfair+Display:wght@700&family=Vollkorn:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
