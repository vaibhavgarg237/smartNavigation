console.log("starting...");

let tilesList;
let buttonList;
let previousMaxOverlappedArea = 0;
let previousHighlightedElement = null;

const highlightObj = (cursorX, cursorY, currCursorSide, objList) => {
  const cursorX1 = cursorX;
  const cursorY1 = cursorY;
  const cursorX2 = cursorX + currCursorSide;
  const cursorY2 = cursorY + currCursorSide;

  let maxOverlappedArea = 0;
  let elementToBeHighlighted = null;

  //singularObjElement -> original object(tile/button), maxOverlappedArea -> overlapping area
  for (let i = 0; i < objList.length; i++) {
    const singularObjElement = objList[i];
    if (singularObjElement === undefined) continue;

    const boundingBox = singularObjElement.getBoundingClientRect(); 
    const rx1 = boundingBox.left;
    const ry1 = boundingBox.top;
    const rx2 = boundingBox.right;
    const ry2 = boundingBox.bottom;

    const overlappedX1 = Math.max(rx1, cursorX1);
    const overlappedY1 = Math.max(ry1, cursorY1);
    const overlappedX2 = Math.min(rx2, cursorX2);
    const overlappedY2 = Math.min(ry2, cursorY2);

    if (overlappedX2 - overlappedX1 > 0 && overlappedY2 - overlappedY1 > 0) {
      const currOverlappedArea = (overlappedX2 - overlappedX1) * (overlappedY2 - overlappedY1);
      if (currOverlappedArea > maxOverlappedArea) {
        maxOverlappedArea = currOverlappedArea;
        elementToBeHighlighted = singularObjElement;
      }
    }
  }

  if (previousMaxOverlappedArea !== 0) {
    previousHighlightedElement.style.boxShadow = "";
  }

  if (maxOverlappedArea !== 0 && maxOverlappedArea > 0.2 * currCursorSide * currCursorSide) {
    elementToBeHighlighted.style.boxShadow = "rgba(176, 226, 90, 0.5) 0 0px 150px 50px, rgb(164 255 7 / 70%) 0px -15px 50px -10px inset";
    elementToBeHighlighted.style.borderRadius = "10px";
    previousMaxOverlappedArea = maxOverlappedArea;
    previousHighlightedElement = elementToBeHighlighted;
  }
};

const isItRegion2 = (cursorX, cursorY, currCursorSide, objList) => {
    if (objList[0] == undefined || objList[1] == undefined) return false;
    const cursorX1 = cursorX;
    const cursorY1 = cursorY;
    const cursorX2 = cursorX + currCursorSide;
    const cursorY2 = cursorY + currCursorSide;

    const rx1 = objList[1].getBoundingClientRect().x + objList[1].getBoundingClientRect().width; //small box
    const ry1 = objList[0].getBoundingClientRect().y; //big box
    const rx2 = objList[0].getBoundingClientRect().right;
    const ry2 = objList[0].getBoundingClientRect().bottom;

    const overlappedX1 = Math.max(rx1, cursorX1);
    const overlappedY1 = Math.max(ry1, cursorY1);
    const overlappedX2 = Math.min(rx2, cursorX2);
    const overlappedY2 = Math.min(ry2, cursorY2);

  // console.log({cursorX1, cursorY1, cursorX2, cursorY2}, {rx1, ry1, rx2, ry2}, {overlappedX1, overlappedY1, overlappedX2, overlappedY2},objList)

    if (overlappedX2 - overlappedX1 > 0 && overlappedY2 - overlappedY1 > 0) {
      // console.log("overlapped")
        const currOverlappedArea = (overlappedX2 - overlappedX1) * (overlappedY2 - overlappedY1);
        if (currOverlappedArea > 0.75 * currCursorSide * currCursorSide) {
        // console.log("found region",currOverlappedArea, currCursorSide * currCursorSide, singularObjElement.className);
          return true;
        }
        return false;
    }
    return false;
};

const clamp = (value, min, max) => {
    if (value < min) return min;
    else if (value > max) return max;
    else return value;
};

const updateCursorSize = (side) => {
    const cursorStyle = document.getElementById("mouse-pointer").style;
    cursorStyle.width = side;
    cursorStyle.height = side;
};
const updateCursorPositon = (x, y) => {
    const cursorStyle = document.getElementById("mouse-pointer").style;
    cursorStyle.left = `${x}px`;
    cursorStyle.top = `${y}px`;
};
const MIN_CURSOR_SIDE = 50;

window.onload = function () {
  if (document.getElementById("mouse-pointer") === null) {
    const mousePointer = document.createElement("div");
    mousePointer.setAttribute("id", "mouse-pointer");
    document.body.appendChild(mousePointer);
  }

  if (document.getElementById("mouse-pointer") !== null) {
    let factorChangeSize_Wheel = 1;
    let currCursorSide = MIN_CURSOR_SIDE;
    updateCursorSize(`${currCursorSide}px`);

    let cursorX = 0, cursorY = 0;
    let SENSITIVITY = 1;
    let region2 = false;

    tilesList = document.getElementsByClassName("ytLrTileRendererHost");

    document.addEventListener("mousemove", (event) => {

      region2 = isItRegion2(cursorX, cursorY, currCursorSide,[document.getElementsByClassName("ytVirtualListContainer")[0],document.getElementsByTagName("ytlr-guide-response")[0]]);
      // console.log(region2)

      if (!MANUAL_MODE_ENABLED) {
        if (region2) currCursorSide = 4.5 * MIN_CURSOR_SIDE * factorChangeSize_Wheel;
        else currCursorSide = MIN_CURSOR_SIDE * factorChangeSize_Wheel;
      }
      updateCursorSize(`${currCursorSide}px`);

      const dx = event.movementX;
      const dy = event.movementY;
      let speedConstant = (SENSITIVITY * currCursorSide) / MIN_CURSOR_SIDE; //region2: 4.5,region1: 1
      if(region2) speedConstant = 2;
      else speedConstant = 1; 
      cursorX += dx * speedConstant;
      cursorY += dy * speedConstant;

      cursorX = clamp(cursorX, 0, window.innerWidth - currCursorSide / 2);
      cursorY = clamp(cursorY, 0, window.innerHeight - currCursorSide / 2);
      updateCursorPositon(cursorX, cursorY);

    //   console.log("CursorX: ", cursorX, "CursorY: ", cursorY);
      if (region2) {
        highlightObj( cursorX, cursorY, currCursorSide, tilesList);
      } else {
        buttonList = [ ...document.getElementsByClassName("ytLrButtonHighlighted"), document.getElementsByClassName("ytLrTextBoxFocusable ytLrTextBoxAnimateWidth ytLrTextBoxHost")[0], document.getElementsByClassName("ytLrSearchVoiceHost")[0] ];
        highlightObj( cursorX, cursorY, currCursorSide, buttonList);
      }
    });

    document.addEventListener("click", (event) => {
      document.body.requestPointerLock();
    });

    document.addEventListener("keypress", (event) => {
      if (event.key >= 1 && event.key <= 9) {
        SENSITIVITY = event.key;
      } 
      console.log("Sensitivity: ", SENSITIVITY);
    });

    // let CURR_SIDE = 500;
    let MANUAL_MODE_ENABLED = false;
    document.addEventListener("wheel", (event) => {
      MANUAL_MODE_ENABLED = true;
      event.deltaY <= 0 ? (factorChangeSize_Wheel *= 1.05) : (factorChangeSize_Wheel *= 0.95);

      region2 = isItRegion2(cursorX, cursorY, currCursorSide,[document.getElementsByClassName("ytVirtualListContainer")[0],document.getElementsByTagName("ytlr-guide-response")[0],]);
      if (region2)  currCursorSide = 4.5 * MIN_CURSOR_SIDE * factorChangeSize_Wheel;
      else  currCursorSide = MIN_CURSOR_SIDE * factorChangeSize_Wheel;
      updateCursorSize(`${currCursorSide}px`);

      cursorX = clamp(event.pageX - currCursorSide/2, 0, window.innerWidth - currCursorSide / 2);
      cursorY = clamp(event.pageY - currCursorSide/2, 0, window.innerHeight - currCursorSide / 2);
      updateCursorPositon(cursorX, cursorY);
    });
  }
};
