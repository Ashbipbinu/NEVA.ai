import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { FaCamera, FaRedo, FaTimes } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import QRCode from "react-qr-code";
import api from "../Axios/axiosInstance";
import VideoPreviewModal from "./VideoPreviewModal";

export default function WebcamGenerator() {
  const webcamRef = useRef(null);

  const [theme, setTheme] = useState("");
  const [text, setText] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); // Store video URL returned from backend

  // Check for camera permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => {
        setCameraPermission(false);
        toast.error("Camera permission is required!");
      });
  }, []);

  const startCapture = () => {
    if (!cameraPermission) {
      toast.error("Camera permission denied!");
      return;
    }

    if (capturedImage) {
      // Retake
      setCapturedImage(null);
      return;
    }

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error("Failed to capture photo! Check your camera.");
      return;
    }
    setCapturedImage(imageSrc);
  };

  const handleGenerate = async () => {
    // Validation
    if (!capturedImage && !theme) {
      toast.error("Image and theme are required!");
      return;
    }
    if (!capturedImage) {
      toast.error("Please capture a photo first!");
      return;
    }
    if (!theme) {
      toast.error("Please select a theme!");
      return;
    }

    try {
      const payload = {
        img: capturedImage,
        theme: theme,
        opt_txt: text,
      };

      setIsLoading(true);
      const response = await api.post("/generate-video", payload);

      const { video_url } = response.data;
      setVideoUrl(video_url);
      setShowModal(true);
      toast.success("Video generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to call backend API!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Webcam / Captured Image Box */}
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg relative">
          {!capturedImage ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="rounded-xl w-full"
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-xl w-full"
              name="img"
            />
          )}

          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
              <span className="text-6xl font-bold">{countdown}</span>
            </div>
          )}

          <button
            onClick={startCapture}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
            title={capturedImage ? "Retake" : "Capture"}
          >
            {capturedImage ? (
              <FaRedo className="w-6 h-6" />
            ) : (
              <FaCamera className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg space-y-3">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
            name="theme"
          >
            <option value="">Select Theme</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="cinematic">Cinematic</option>
            <option value="fantasy">Fantasy</option>
            <option value="anime">Anime</option>
          </select>

          <input
            type="text"
            placeholder="Optional prompt..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
            name="opt_txt"
          />

          <button
            onClick={handleGenerate}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition flex justify-center items-center"
          >
            {isLoading ? (
              <RingLoader size={17} color="white" speedMultiplier={2} />
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {/* Toast Container */}
        <Toaster position="top-right" />

        <VideoPreviewModal
          open={showModal}
          videoUrl={videoUrl}
          onClose={() => setShowModal(false)}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
