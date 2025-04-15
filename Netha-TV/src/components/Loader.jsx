import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loader">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
    </motion.div>
  );
};

export default Loader;