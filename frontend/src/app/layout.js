import './globals.css';

export const metadata = {
  title: 'Fugitive Hunt',
  description: 'Capture the fugitive across cities!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}