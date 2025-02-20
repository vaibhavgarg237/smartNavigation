// first rectangle
const r1 = document.getElementsByClassName("thumbnail")[0];
const r1x = r1.getBoundingClientRect().x;
const r1y = r1.getBoundingClientRect().y;
const r1w = r1.getBoundingClientRect().width;
const r1h = r1.getBoundingClientRect().height; 

//continue --------------------
let menuIcon = document.querySelector(".menu-icon");
let sidebar = document.querySelector(".sidebar");
let container = document.querySelector(".container");

// let menuIcon = document.querySelector(".menu-icon")

// menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");    
    
// }


let pointerId = "mouse-pointer";
//Add pointer element to DOM
const initRound = (ptr = "mouse-pointer") => {
  if (document.getElementById(ptr) === null) {
    console.log("init called ", ptr);
    pointerId = ptr;
    const mousePointer = document.createElement("div");
    mousePointer.setAttribute("id", ptr);
    document.body.appendChild(mousePointer);
  }
};
const movePointerRound = ({
  color = "white",
  width = "3.5rem",
  height = "3.5rem",
  transition = "0.1s",
  transitionDuration = "100ms",
  mixBlendMode = "difference",
  zIndex = 100,
  borderRadius = "0px", //9999px for round cursor point
  leftOffset = 30,
  topOffset = 30,
}) => {
  if (document.getElementById(pointerId) !== null) {
    console.log("move called ", color, width, height);
    const pointerStyle = document.getElementById(pointerId).style;
    //Add css
    pointerStyle.backgroundColor = color;
    pointerStyle.width = width;
    pointerStyle.height = height;
    // pointerStyle.transitionDuration = transitionDuration;
    pointerStyle.mixBlendMode = mixBlendMode;
    pointerStyle.zIndex = zIndex;
    pointerStyle.borderRadius = borderRadius;
    pointerStyle.position = "absolute";
    pointerStyle.pointerEvents = "none";

    //Handle mouse events

    document.addEventListener("mousemove", (event) => {
    //   pointerStyle.transition = transition;
      // pointerStyle.transform = "scale(1)";
      pointerStyle.left = `${event.pageX - leftOffset}px`;
      pointerStyle.top = `${event.pageY - topOffset}px`;

      // handling area
      const X1 = Math.max(r1x, event.pageX);
      const Y1 = Math.max(r1y, event.pageY);
      const X2 = Math.min(r1x + r1w, event.pageX + 60);
      const Y2 = Math.min(r1y + r1h, event.pageY + 60);

      console.log("X1", r1x, event.pageX,"Y1",r1y,event.pageY);
      // console.log("area of overlapped rectangle:" ,(X2 - X1) , (Y2 - Y1));
      if ((X2 - X1) * (Y2 - Y1) > 0) {
        // console.log("inside");
        r1.style.boxShadow = "0 0 15px 5px rgba(0, 255, 0, 0.8)";
      } else {
        r1.style.boxShadow = "";
      }
    });

    // document.addEventListener("mouseleave", () => {
    //   pointerStyle.transition = transition;
      // pointerStyle.transform = "scale(0)";
    // });
  }
};

initRound();
movePointerRound({}); 


/* //CHECK BELOW LOGIC
function getIntersection(rect1, rect2) {
  const intersectLeft = Math.max(rect1.x, rect2.x);
  const intersectTop = Math.max(rect1.y, rect2.y);
  const intersectRight = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const intersectBottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

  // Check if there is an intersection
  if (intersectRight > intersectLeft && intersectBottom > intersectTop) {
    return {
      x: intersectLeft,
      y: intersectTop,
      width: intersectRight - intersectLeft,
      height: intersectBottom - intersectTop,
      area: (intersectRight - intersectLeft) * (intersectBottom - intersectTop)
    };
  }
  return null; // No intersection
}

// Example usage:
const cursor = { x: X, y: Y, width: 60, height: 60 };
const box = { x: boxX, y: boxY, width: boxWidth, height: boxHeight };

const overlap = getIntersection(cursor, box);
if (overlap) {
  // Highlight the overlapping segment using overlap coordinates
  console.log("Overlap area:", overlap.area);
}
*/