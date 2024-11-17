import { create, all } from "mathjs";

const up = 0;
const right = 45;
const left = -45;
const green = "#2ae841";
const red = "red";

export default function Bonsai() {
  const width = 1920;
  const height = 1080;
  const centerX = width / 2;
  const gap = 2;
  const startingPoint = [centerX, height];
  let lastBranchId = "3r-1";
  let treeColor = green;
  let lineWidth = 20;
  let lineLength = 5;
  let treeHeight = 3;
  let firstTimeSkip = true;
  let ctx;
  let points;
  let references;
  let math;

  function newGraph() {
    const canvas = document.getElementById("bonsai-canvas");
    ctx = canvas.getContext("2d");
    initDraw();
    generateLines(ctx, treeHeight);
  }

  function generateNextBranch() {
    ctx.clearRect(0, 0, width, height);
    initDraw();

    treeColor = green;
    let [failedLine, failedOn] = generateLines(ctx, treeHeight);
    if (lastBranchId == failedOn) {
      treeHeight += 1;
      lastBranchId = `${treeHeight}r0`;
    } else {
      if (failedLine) {
        lastBranchId = failedOn;
      }
    }

    if (firstTimeSkip) {
      firstTimeSkip = false;
      generateNextBranch();
    }
  }

  function deleteLastBranch() {
    ctx.clearRect(0, 0, width, height);

    treeColor = red;
    let splitBranch = lastBranchId.split("r");
    if (splitBranch[0] > 2) {
      if (splitBranch[1] == 0) {
        treeHeight -= 1;
        let lastKeys = Object.keys(references).filter((key) =>
          key.startsWith(`${treeHeight}r`)
        );

        let max = 0;
        lastKeys.forEach((key) => {
          let branchId = Number(key.split("r")[1]);
          if (branchId > max) {
            max = branchId;
          }
        });

        lastBranchId = `${treeHeight}r${max}`;
      } else {
        lastBranchId = `${splitBranch[0]}r${splitBranch[1] - 1}`;
      }
    } else {
      firstTimeSkip = true;
    }

    initDraw();
    generateLines(ctx, treeHeight);
  }

  function generateNextLayer() {
    ctx.clearRect(0, 0, width, height);
    treeHeight += 1;
    lastBranchId = `${treeHeight}r0`;
    initDraw();
    generateLines(ctx, treeHeight);
  }

  function deleteLastLayer() {
    ctx.clearRect(0, 0, width, height);
    treeHeight -= 1;
    lastBranchId = `${treeHeight}r0`;
    initDraw();
    generateLines(ctx, treeHeight);
  }

  function updateLineHeight() {
    lineLength = Math.round((height - lineLength - 100) / treeHeight);
  }

  function resetMaths() {
    const mathConfig = {
      randomSeed: 50933431.171054244,
    };
    math = create(all, mathConfig);
  }

  function resetPoints() {
    points = [
      // direction, referenceLabel, isGLowing, label
      // Starting row
      [up, -1, true, "0r0"],
      [left, "0r0", true, "1r0"],
      [right, "0r0", true, "1r1"],
    ];
  }

  function resetReferences() {
    references = {
      // label: [xStart, xEnd, yStart, yEnd, touching]
      "0r0": [960, 960, 1070, 1010, false],
      "1r0": [950, 900, 1000, 940, false],
      "1r1": [970, 1020, 1000, 940, false],
    };
  }

  function renderLine(xStart, xEnd, yStart, yEnd, highlighted) {
    // Draw line
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.lineWidth = lineWidth;
    // ctx.shadowBlur = highlighted ? 2 * lineWidth : 0;
    ctx.lineCap = "round";
    // ctx.shadowColor = "white";
    ctx.strokeStyle = highlighted ? treeColor : "gray";
    ctx.stroke();
  }

  function generateLines(ctx, maxHeight) {
    let validDirections = [up, left, right];
    let row = 2;
    let angleVariance = 0;
    let failed = false;
    let failedOn = "";

    // Look at each branch that's on the row below, pick a valid branch and place it at random.
    // Tick up row and continue till max
    for (let currentRow = row; currentRow <= maxHeight; currentRow++) {
      let previousRow = currentRow - 1;
      let previousKeys = Object.keys(references).filter((x) =>
        x.startsWith(`${previousRow}r`)
      );

      console.debug(references);
      console.debug("Starting with previous row of " + previousRow);

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
            console.debug(
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

            let splitBranch = lastBranchId.split("r");
            let colourCondition =
              currentRow < splitBranch[0] ||
              (currentRow == splitBranch[0] && branchId < splitBranch[1]);
            // console.log(currentRow, branchId);
            if (
              currentRow < splitBranch[0] ||
              (currentRow == splitBranch[0] && branchId <= splitBranch[1])
            ) {
              // Draw line
              renderLine(xStart, xEnd, yStart, yEnd, colourCondition);

              failedOn = `${currentRow}r${branchId}`;
              branchId++;
            } else {
              console.log("Skipped: " + `${currentRow}r${branchId}`);
              failedOn = `${currentRow}r${branchId}`;
              failed = true;
              return;
            }
          }
        });
      });
    }
    return [failed, failedOn];
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
        console.debug(
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

  function initDraw() {
    updateLineHeight();
    resetMaths();
    resetPoints();
    resetReferences();

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
        renderLine(xStart, xEnd, yStart, yEnd, highlighted);
      }
    });
  }

  return (
    <>
      <button onClick={() => newGraph()}>New</button>
      <button onClick={() => generateNextBranch()}>Add</button>
      <button onClick={() => deleteLastBranch()}>Remove</button>
      <canvas
        className="w-4/5 h-min"
        id="bonsai-canvas"
        width={width}
        height={height}
      ></canvas>
    </>
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
