import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CatalogProvider } from './context/CatalogContext';
import Home from './pages/Home';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CatalogProvider>
    </BrowserRouter>
  );
}
