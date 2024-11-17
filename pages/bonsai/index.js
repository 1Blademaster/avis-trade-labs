import { useEffect } from "react";
import { create, all } from "mathjs";

const up = 0;
const right = 45;
const left = -45;

const mathConfig = {
  randomSeed: 50933431.171054244,
};
const math = create(all, mathConfig);

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const lineLength = 20;
  const treeHeight = 25;
  const gap = 7.5;
  const startingPoint = [centerX, height];

  let points = [
    // direction, referenceLabel, isGLowing, label
    // Starting row
    [up, -1, true, "0r0"],
    [left, "0r0", true, "1r0"],
    [right, "0r0", true, "1r1"],
  ];
  let references = {
    // label: [xStart, xEnd, yStart, yEnd, touching]
    "0r0": [960, 960, 1070, 1010, false],
    "1r0": [950, 900, 1000, 940, false],
    "1r1": [970, 1020, 1000, 940, false],
  };

  function generateLines(ctx, maxHeight) {
    let validDirections = [up, left, right];
    let row = 2;
    let angleVariance = 0;

    // Look at each branch that's on the row below, pick a valid branch and place it at random.
    // Tick up row and continue till max
    for (let currentRow = row; currentRow < maxHeight; currentRow++) {
      let previousRow = currentRow - 1;
      let previousKeys = Object.keys(references).filter((x) =>
        x.startsWith(`${previousRow}r`)
      );

      console.log(references);

      console.log("Starting with previous row of " + previousRow);
      let branchId = 0;
      previousKeys.forEach((key) => {
        validDirections.forEach((direction) => {
          let angle =
            direction +
            math.random() * angleVariance -
            math.random() * angleVariance;
          let [canDraw, xStart, xEnd, yStart, yEnd] = testPath(
            angle,
            key,
            `${currentRow}r${branchId}`,
            false
          );

          if (canDraw && math.random() >= 0.45) {
            console.log(
              "Drawing branch of label " +
                `${currentRow}r${branchId} from ${key}`
            );
            references[`${currentRow}r${branchId}`] = [
              xStart,
              xEnd,
              yStart,
              yEnd,
              false,
            ];
            branchId++;

            // Draw line
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.lineWidth = 4;
            ctx.shadowBlur = currentRow < 5 ? 10 : 0;
            ctx.lineCap = "round";
            ctx.shadowColor = "blue";
            ctx.strokeStyle = currentRow < 5 ? "white" : "gray";
            ctx.stroke();
          }
        });
      });
    }
  }

  function testPath(passedAngle, referencePoint, label, touching) {
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
    } catch (exception) {
      console.log(
        "Failed on line: " + label + " trying to reference " + referencePoint
      );
      console.log(references);
      console.log(exception);
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
          "Skipping line " +
            label +
            " as it will cross with " +
            Object.keys(references)[i]
        );
        return [false, null, null, null, null];
      }
    }

    return [true, xStart, xEnd, yStart, yEnd];
  }

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

      // Test to see if we can draw the line
      let [canDraw, xStart, xEnd, yStart, yEnd] = testPath(
        passedAngle,
        referencePoint,
        label,
        touching
      );

      if (canDraw) {
        // [xStart, xEnd, yStart, yEnd, touching]
        references[label] = [
          xStart,
          touching ? xEnd - gap : xEnd,
          yStart,
          yEnd,
          touching,
        ];

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
      }
    });

    generateLines(ctx, treeHeight);
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
