import { useState, useEffect } from 'react';
import { useLocation } from 'react-router'; // Import useLocation
import ChatPot from '../Components/ChatPot';
import CreateForm from '../Components/CreateForm';
import Loading from '../Components/Loading';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // Get current location

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Trigger when pathname changes

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <Loading />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ opacity: 0, y: 0 }}
          >
            
            <motion.div
              initial={{ opacity: 0, y:0}}
              animate={{ 
                opacity: 1,
                y: 0,
                transition: { 
                  delay: 0.7,
                  duration:0.4,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
            >
                <Navbar activePage={'Create'} />
              <CreateForm />
              <ChatPot />
            </motion.div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}