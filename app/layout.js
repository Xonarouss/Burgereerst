import "./globals.css";

export const metadata = {
  title: "BurgerEerst.nl",
  description: "BurgerEerst.nl",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
