import { useEffect } from "react";

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const centerY = height / 2;
  const lineLength = 50;
  const gap = 10;

  const points = [
    [centerX, height, centerX, height - lineLength, false],
    [
      centerX,
      height - lineLength - gap,
      centerX,
      height - lineLength * 2 - gap,
      false,
    ],
  ];

  useEffect(() => {
    const canvas = document.getElementById("bonsai-canvas");
    const ctx = canvas.getContext("2d");

    points.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      ctx.lineTo(point[2], point[3]);
      ctx.lineWidth = 2;
      ctx.shadowBlur = point[4] ? 4 : 0;
      ctx.lineCap = "round";
      ctx.shadowColor = "blue";
      ctx.strokeStyle = "white";
      ctx.stroke();
    });
  }, []);

  return (
    <canvas
      className="w-screen h-screen bg-neutral-800"
      id="bonsai-canvas"
      width={width}
      height={height}
    ></canvas>
  );
}
