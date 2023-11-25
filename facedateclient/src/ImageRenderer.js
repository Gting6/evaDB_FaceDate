import React, { useEffect, useRef } from "react";

const ImageRenderer = ({ imageArray }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && imageArray) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Assuming imageArray is a 3D array with pixel data (e.g., RGBA values)
      const [width, height, channels] = [
        imageArray.length,
        imageArray[0].length,
        imageArray[0][0].length,
      ];

      const windowWidth = window.innerWidth / 2;
      const windowHeight = window.innerHeight / 2;

      // Calculate scale factors for resizing while maintaining aspect ratio
      const scaleX = windowWidth / width;
      const scaleY = windowHeight / height;
      const scale = Math.min(scaleX, scaleY);

      const newWidth = width * scale;
      const newHeight = height * scale;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Loop through the 3D array and draw pixels
      ctx.clearRect(0, 0, newWidth, newHeight);

      // Draw the resized image
      for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
          const originalX = Math.floor(x / scale);
          const originalY = Math.floor(y / scale);

          const [r, g, b] = imageArray[originalX][originalY];
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [imageArray]);

  return <canvas style={{ margin: 10 }} ref={canvasRef} />;
};

export default ImageRenderer;
