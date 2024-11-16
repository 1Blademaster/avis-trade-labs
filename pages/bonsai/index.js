import { useEffect } from "react";

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const centerY = height / 2;
  const lineLength = 50;
  const gap = 10;
  const startingPoint = [centerX, height];

  const points = [
    [0, -1, 0, true],
    [45, 0, 1, false],
    [-45, 0, 1, false],
    [-45, 2, 2, false],
    [45, 2, 2, false],
  ];

  let references = [];

  useEffect(() => {
    const canvas = document.getElementById("bonsai-canvas");
    const ctx = canvas.getContext("2d");

    points.forEach((point) => {
      let passedAngle = point[0];
      let referencePoint = point[1];
      let row = point[2];
      let highlighted = point[3];

      let angle = passedAngle + 90;
      let xDiff = Math.cos((angle * Math.PI) / 180) * lineLength;
      let yDiff = Math.sin((angle * Math.PI) / 180) * lineLength;

      let xRef;
      let yRef;
      if (referencePoint == -1) {
        xRef = startingPoint[0];
        yRef = startingPoint[1];
      } else {
        xRef = references[referencePoint][0];
        yRef = references[referencePoint][1];
      }

      let xStart =
        xRef - (passedAngle < 0 ? gap : 0) + (passedAngle > 0 ? gap : 0);
      let yStart = yRef - gap;

      let xEnd = xStart - xDiff;
      let yEnd = yStart - yDiff - gap;

      references.push([xEnd, yEnd]);

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.lineWidth = 4;
      ctx.shadowBlur = highlighted ? 10 : 0;
      ctx.lineCap = "round";
      ctx.shadowColor = "blue";
      ctx.strokeStyle = highlighted ? "white" : "gray";
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
