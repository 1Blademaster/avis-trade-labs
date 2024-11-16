import { useEffect } from "react";

const up = 0;
const right = 45;
const left = -45;

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const centerY = height / 2;
  const lineLength = 50;
  const gap = 10;
  const startingPoint = [centerX, height];

  let points = [
    // Starting row
    [up, -1, true, "s"],
    [left, "s", false, "s1"],
    [right, "s", false, "s2"],
    // 2nd row
    [left, "s1", false, "2r1"],
    [right, "s1", false, "2r2"],
    [up, "s2", false, "2r3"],
    // 3rd row
    [left, "2r1", false, "3r1"],
    [right, "2r1", false, "3r2"],
    [up, "2r2", false, "3r3"],
    [right, "2r3", false, "3r4"],
    // 4th row
    [right, "3r1", false, "4r1", true],
    [left, "3r2", false, "4r2", true],
    [right, "3r2", false, "4r3"],
    [right, "3r3", false, "4r4", true],
    [left, "3r4", false, "4r5", true],
    [right, "3r4", false, "4r6"],
    // 5th row
    [up, "4r2", false, "5r1"],
    [left, "4r3", false, "5r2"],
    [right, "4r3", false, "5r3"],
  ];

  let references = {};

  useEffect(() => {
    const canvas = document.getElementById("bonsai-canvas");
    const ctx = canvas.getContext("2d");

    points.forEach((point) => {
      // Get variables from point
      let passedAngle = point[0];
      let referencePoint = point[1];
      let highlighted = point[2];
      let label = point[3];
      let touching = point[4] ? point[4] : false;

      // Get what line we're starting from
      let xRef;
      let yRef;
      let shouldBeBigger;
      try {
        if (referencePoint == -1) {
          xRef = startingPoint[0];
          yRef = startingPoint[1];
          shouldBeBigger = false;
        } else {
          xRef = references[referencePoint][1];
          yRef = references[referencePoint][3];
          shouldBeBigger = references[referencePoint][4];
        }
      } catch {
        console.log(
          "Failed on line: " + label + "trying to reference " + referencePoint
        );
        console.log(references);
      }

      // Find length and difference in x and y
      let lineLengthVaried = touching ? lineLength - gap : lineLength;
      lineLengthVaried = shouldBeBigger
        ? lineLengthVaried + gap
        : lineLengthVaried;
      let angle = passedAngle + 90;
      let xDiff = lineLengthVaried / Math.tan((angle * Math.PI) / 180);
      let yDiff = lineLengthVaried;

      // Find starting and endpoints
      let xStart =
        xRef - (passedAngle < 0 ? gap : 0) + (passedAngle > 0 ? gap : 0);
      let yStart = yRef - gap;
      let xEnd = xStart - xDiff;
      let yEnd = yStart - yDiff - gap;

      // [xStart, xEnd, yStart, yEnd, touching]
      references[label] = [
        xStart,
        touching ? xEnd - gap : xEnd,
        yStart,
        yEnd,
        touching,
      ];

      // Check for intersections
      for (let i = 0; i < Object.keys(references).length; i++) {
        let secondLine = references[Object.keys(references)[i]];
        if (
          willCross(
            xStart,
            yStart,
            xEnd,
            yEnd,
            secondLine[0],
            secondLine[2],
            secondLine[1],
            secondLine[3]
          ) &&
          label != Object.keys(references)[i]
        ) {
          console.log(
            "THIS LINE WILL CROSS " +
              label +
              " WITH " +
              Object.keys(references)[i]
          );
        }
      }

      // Draw line
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

function willCross(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
  let d1x = p1x - p0x;
  let d1y = p1y - p0y;
  let d2x = p3x - p2x;
  let d2y = p3y - p2y;
  let d = d1x * d2y - d2x * d1y;
  let px;
  let py;
  let s;
  let t;

  if (d) {
    px = p0x - p2x;
    py = p0y - p2y;

    s = (d1x * py - d1y * px) / d;
    if (s >= 0 && s <= 1) {
      t = (d2x * py - d2y * px) / d;
      if (t >= 0 && t <= 1) {
        return { x: p0x + t * d1x, y: p0y + t * d1y };
      }
    }
  }
  return null;
}
