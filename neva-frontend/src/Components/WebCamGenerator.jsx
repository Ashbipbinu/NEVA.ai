import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { FaCamera, FaRedo, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import api from "../Axios/axiosInstance";
import VideoPreviewModal from "./VideoPreviewModal";
import { motion, AnimatePresence } from "framer-motion";

export default function WebcamGenerator() {
  
  const webcamRef = useRef(null);
  const [theme, setTheme] = useState("");
  const [text, setText] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => toast.error("Camera permission is required!"));
  }, []);

  /* ================= LOGIC HANDLERS ================= */

  const startCountdown = () => {
    if (!cameraPermission) return toast.error("Camera permission denied!");
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0 && prev === 1) {
          clearInterval(interval);
          handleScreenshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleScreenshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setCapturedImage(imageSrc);
    }
  };

  const handleRecapture = () => {
    setCapturedImage(null);
    setCameraReady(false);
    setIsFlipped(false);
  };

  const handleProceed = () => {
    setIsFlipped(true);
  };

  const handleGenerate = async () => {
    if (!capturedImage || !theme) return toast.error("Please select a theme!");
    try {
      setIsLoading(true);
      const response = await api.post("/generate-video", { img: capturedImage, theme, opt_txt: text });
      setVideoUrl(response.data.video_url);
      setShowModal(true);
    } catch {
      toast.error("Generation failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      toast.loading("Preparing download...");
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      // Set a filename (e.g., NEVA_Video_17123456.mp4)
      link.setAttribute("download", `NEVA_AI_Video_${Date.now()}.mp4`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Download started!");
    } catch (error) {
      toast.dismiss();
      toast.error("Download failed. Please try again.");
      console.error("Download error:", error);
    }
  };

  return (
    <motion.div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 overflow-hidden">
      <motion.div className="w-full max-w-md">
        
        <div className="relative w-full h-135" style={{ perspective: "1200px" }}>
          <motion.div
            className="w-full h-full relative"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            
            {/* --- FRONT SIDE: CAMERA & PREVIEW --- */}
            <div 
              className="absolute inset-0 w-full h-full bg-gray-900 rounded-[40px] p-4 shadow-2xl border border-gray-800"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!capturedImage ? (
                    <motion.div 
                      key="camera-mode"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      {!cameraReady && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                          <RingLoader size={45} color="#6366f1" />
                        </div>
                      )}
                      <Webcam
                        key="webcam-component"
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        onUserMedia={() => setCameraReady(true)}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.img 
                      key="preview-mode"
                      src={capturedImage}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                
                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                    <motion.span key={countdown} initial={{ scale: 1.2 }} animate={{ scale: 0.5 }} className="text-9xl font-black">
                      {countdown}
                    </motion.span>
                  </div>
                )}
              </div>
            </div>

            {/* --- BACK SIDE: FORM --- */}
            <div 
              className="absolute inset-0 w-full h-full bg-gray-900 rounded-[40px] p-8 shadow-2xl border border-indigo-500/30 flex flex-col justify-between"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">NEVA.ai</h2>
                  <button onClick={() => setIsFlipped(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <FaArrowLeft className="text-sm" />
                  </button>
                </div>
                <div className="space-y-4">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none"
                  >
                    <option value="">Select Theme</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                  <textarea
                    placeholder="Describe details... (Optional)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 h-50 rounded-2xl bg-gray-800 border border-gray-700 outline-none resize-none"
                  />
                </div>
              </div>
              <motion.button onClick={handleGenerate} whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }} disabled={isLoading} className="w-full py-4 rounded-2xl hover:bg-indigo-500 cursor-pointer bg-indigo-600 font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex justify-center items-center">
                {isLoading ? <RingLoader size={24} color="white" /> : "Generate"}
              </motion.button>
            </div>
          </motion.div>

          {/* --- DYNAMIC BUTTONS --- */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full flex justify-center items-center gap-4 z-50">
            <AnimatePresence mode="wait">
              {!capturedImage ? (
                /* STATE 1: Initial Camera */
                <motion.button
                  key="btn-capture"
                  disabled={ countdown && countdown >= 1}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
                  onClick={startCountdown}
                  className="w-20 h-20 bg-indigo-600 rounded-full border-[6px] border-gray-950 flex items-center justify-center shadow-lg shadow-indigo-500/40"
                >
                  { countdown >=1  ? <RingLoader/> : <FaCamera className="text-xl"/>}
                </motion.button>
              ) : !isFlipped ? (
                /* STATE 2: Captured - Recapture & Proceed */
                <motion.div key="btn-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration : 0.9 }} className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleRecapture}
                    className="px-6 py-4 bg-gray-800 rounded-2xl border border-gray-700 flex items-center gap-2 font-bold"
                  >
                    <FaRedo className="text-sm" /> Recapture
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleProceed}
                    className="px-8 py-4 bg-indigo-600 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/30"
                  >
                    Proceed <FaArrowRight className="text-sm" />
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <Toaster position="top-right" />
        <VideoPreviewModal open={showModal} videoUrl={videoUrl} onClose={() => setShowModal(false)} onDownload={handleDownload}/>
      </motion.div>
    </motion.div>
  );
}