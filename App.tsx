
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Community from './pages/Community';
import AiMentor from './pages/AiMentor';
import Resources from './pages/Resources';
import Support from './pages/Support';
import Admin from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home onNavigate={setCurrentPage} />;
      case Page.About: return <About />;
      case Page.Ministries: return <Ministries />;
      case Page.Community: return <Community />;
      case Page.AiMentor: return <AiMentor />;
      case Page.Resources: return <Resources />;
      case Page.Support: return <Support />;
      case Page.Admin: return <Admin />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
