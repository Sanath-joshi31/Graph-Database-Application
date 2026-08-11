import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PathGraph — CognoDB Graph Career Explorer',
  description: 'Discover the shortest path from what you know to what you want to become using openCypher multi-hop graph database traversal.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
