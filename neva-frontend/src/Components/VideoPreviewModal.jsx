import { FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoPreviewModal({
  open,
  videoUrl,
  onClose,
  onDownload,
}) {
  // We remove the "if (!open) return null" here because AnimatePresence 
  // needs to see the children to animate their exit.

  let mobileVideoUrl = videoUrl;

  return (
    <AnimatePresence>
      {open && (
        /* Backdrop */
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Fade out backdrop
          transition={{ duration: 0.3 }}
        >
          {/* Modal Container */}
          <motion.div
            className="bg-gray-950 rounded-4xl p-8 w-full max-w-4xl relative flex flex-col md:flex-row gap-6 border border-gray-800"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ 
              scale: 0.8, 
              opacity: 0, 
              y: 100, 
              rotateX: 10,
              transition: { duration: 0.3, ease: "easeIn" } 
            }} // "Drop and shrink" exit effect
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-0.5  bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-all z-10"
              aria-label="Close modal"
            >
              <FaTimes size={18} />
            </button>

            {/* Video Section */}
            <motion.div
              className="flex-[1.5]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }} // Slide left on exit
            >
              <div className="w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-gray-800">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500 italic">Processing video...</div>
                )}
              </div>
            </motion.div>

            {/* Side Panel (QR & Actions) */}
            <motion.div
              className="flex-1 flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }} // Slide right on exit
            >
              <div className="bg-gray-900 w-full p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                <p className="mb-4 text-sm font-medium text-gray-400">
                  Scan to share
                </p>
                <div className="bg-white p-3 rounded-xl shadow-white/5 shadow-xl">
                  <QRCode value={mobileVideoUrl || ""} size={140} />
                </div>
              </div>

              <motion.button
                onClick={onDownload}
                disabled={!videoUrl}
                className="w-full py-4 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex justify-center items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Download Video
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}