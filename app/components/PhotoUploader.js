"use client";
import { useState, useRef } from "react";

export default function PhotoUploader() {
  const [image, setImage] = useState(null);
  const [customTimestamp, setCustomTimestamp] = useState("");
  const [position, setPosition] = useState("right"); // 'left' or 'right'
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTimestamp = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Determine timestamp and position
      const timestamp = customTimestamp || new Date().toLocaleString('en-US', { hour12: true });
      ctx.font = "100px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      const textWidth = ctx.measureText(timestamp).width;
      const x = position === "right" ? img.width - textWidth - 20 : 20;
      const y = img.height - 20;

      // Add timestamp
      ctx.strokeText(timestamp, x, y);
      ctx.fillText(timestamp, x, y);
    };
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "photo-with-timestamp.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">offxsagr</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 w-96">
        <label
          htmlFor="upload"
          className="block mb-4 text-center bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          Upload Photo
        </label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {image && (
          <div className="mt-4">
            <canvas ref={canvasRef} className="w-full rounded shadow" />
            <div className="mt-4">
              <label className="block mb-2">Custom Timestamp</label>
              <input
                type="text"
                value={customTimestamp}
                onChange={(e) => setCustomTimestamp(e.target.value)}
                placeholder="Enter a timestamp (optional)"
                className="w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2">Timestamp Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={addTimestamp}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Add Timestamp
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
