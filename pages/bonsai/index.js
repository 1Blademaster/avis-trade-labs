import { useEffect } from "react";

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const centerY = height / 2;
  const lineLength = 50;
  const gap = 10;

  const points = [
    [centerX, centerY, 0, 0, true],
    [centerX, centerY, 45, 1, false],
    [centerX, centerY, -45, 1, false],
    [centerX, centerY, -45, 2, false],
  ];

  useEffect(() => {
    const canvas = document.getElementById("bonsai-canvas");
    const ctx = canvas.getContext("2d");

    points.forEach((point) => {
      let angle = point[2] + 90;
      let xDiff = Math.cos((angle * Math.PI) / 180) * lineLength;
      let yDiff = Math.sin((angle * Math.PI) / 180) * lineLength;

      let xStart =
        point[0] -
        (point[2] < 0 ? gap * point[3] : 0) +
        (point[2] > 0 ? gap * point[3] : 0);
      let yStart = point[1] - lineLength * point[3] - gap * point[3];

      let xEnd = xStart - xDiff;
      let yEnd = yStart - yDiff - gap * point[3];

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.lineWidth = 4;
      ctx.shadowBlur = point[4] ? 10 : 0;
      ctx.lineCap = "round";
      ctx.shadowColor = "blue";
      ctx.strokeStyle = point[4] ? "white" : "gray";
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
