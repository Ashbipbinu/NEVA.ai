import { FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";

export default function VideoPreviewModal({
  open,
  videoUrl,
  onClose,
  onDownload,
}) {
  if (!open) return null;

  let mobileVideoUrl = videoUrl;
  console.log(videoUrl)
  if (videoUrl) {
    // Replace localhost or 127.0.0.1 with your PC's local IP
    const localIP = "192.168.1.240"; // <-- replace with your PC's actual IP
    mobileVideoUrl = videoUrl
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-gray-950 rounded-2xl p-6 w-3xl h-100 relative flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        {/* Video Section */}
        <div className="w-full p-3">
          <div className="w-full bg-gray-900 rounded-2xl shadow-lg p-4 flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full rounded-xl max-h-100 object-contain"
              />
            ) : (
              <div className="w-full h-62 flex items-center justify-center text-gray-400">
                Video will appear here
              </div>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-1/2 p-3">
          <div className="w-full bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center">
            {videoUrl ? (
              <>
                <p className="mb-3 text-sm text-gray-300">
                  Scan to view / download video
                </p>
                <div className="bg-white p-3 rounded-xl">
                  <QRCode value={mobileVideoUrl} size={160} />
                </div>
              </>
            ) : (
              <div className="w-full h-62 flex items-center justify-center text-gray-400">
                QR code will appear here
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={!videoUrl}
          className="w-1/2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 font-semibold transition flex justify-center items-center absolute bottom-5 left-[25%]"
        >
          Download
        </button>
      </div>
    </div>
  );
}
