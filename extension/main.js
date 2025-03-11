console.log("starting...");

const setMousePointerSize = (side) => {
    document.getElementById("mouse-pointer").style.width = side;
    document.getElementById("mouse-pointer").style.height = side;
};

let tilesList;
let buttonList;
let previousMaxOverlappedArea = 0;
let previousHighlightedElement = null;

const highlightObj = (pageX, pageY, CURSOR_SIDE, objList) => {
    const cursorX1 = pageX - CURSOR_SIDE / 2;
    const cursorY1 = pageY - CURSOR_SIDE / 2;
    const cursorX2 = pageX + CURSOR_SIDE / 2;
    const cursorY2 = pageY + CURSOR_SIDE / 2;

    let maxOverlappedArea = 0;
    let elementToBeHighlighted = null;

    //singularObjElement -> original object(tile/button), maxOverlappedArea -> overlapping area
    for (let i = 0; i < objList.length; i++) {
        const singularObjElement = objList[i];
        if (singularObjElement === undefined) continue;
        const rx1 = singularObjElement.getBoundingClientRect().x;
        const ry1 = singularObjElement.getBoundingClientRect().y;
        const rx2 = rx1 + singularObjElement.getBoundingClientRect().width;
        const ry2 = ry1 + singularObjElement.getBoundingClientRect().height;

        const X1_ = Math.max(rx1, cursorX1);
        const Y1_ = Math.max(ry1, cursorY1);
        const X2_ = Math.min(rx2, cursorX2);
        const Y2_ = Math.min(ry2, cursorY2);

        if ((X2_ - X1_) > 0 && (Y2_ - Y1_) > 0) {
            const currOverlappedArea = (X2_ - X1_) * (Y2_ - Y1_);
            if (currOverlappedArea > maxOverlappedArea) {
                maxOverlappedArea = currOverlappedArea;
                elementToBeHighlighted = singularObjElement;
            }
        }
        // console.log("VG Max overlapped: ", maxOverlappedArea, "Div area: ", (ry2-ry1)*(rx2-rx1));
    }

    if (previousMaxOverlappedArea !== 0) {
        previousHighlightedElement.style.boxShadow = "";
    }

    if ( maxOverlappedArea !== 0 && maxOverlappedArea > 0.2 * CURSOR_SIDE * CURSOR_SIDE) {
        elementToBeHighlighted.style.boxShadow = "rgba(176, 226, 90, 0.5) 0 0px 150px 50px, rgb(164 255 7 / 70%) 0px -15px 50px -10px inset";
        elementToBeHighlighted.style.borderRadius = "10px";
        previousMaxOverlappedArea = maxOverlappedArea;
        previousHighlightedElement = elementToBeHighlighted;
    }
};

//document.getElementsByClassName("ytLrSectionListRendererHost")[0] => here make it by default bigger
window.onload = function () {
    if (document.getElementById("mouse-pointer") === null) {
        const mousePointer = document.createElement("div");
        mousePointer.setAttribute("id", "mouse-pointer");
        document.body.appendChild(mousePointer);
    }

    if (document.getElementById("mouse-pointer") !== null) {
        const minSize = 50;
        let factorChange = 1;
        let CURSOR_SIDE = 3 * minSize;
        // let INITIAL_SIZE = 50;
        // let lastCursorPositionXY = [0, 0];
        setMousePointerSize(`${CURSOR_SIDE}px`);

        let pointerX = 0, pointerY = 0;
        let oldPointer = [0, 0];
        let SENSITIVITY = 1;

        const pointerStyle = document.getElementById("mouse-pointer").style;

        tilesList = document.getElementsByClassName("ytLrTileRendererHost");

        document.addEventListener("mousemove", (event) => {
            const region2 = event.target.closest(".ytVirtualListContainer") != null && event.target.closest(".ytlr-guide-response") == null;

            if(!MANUAL_MODE){
                if (region2) CURSOR_SIDE = 3 * minSize * factorChange;
                else CURSOR_SIDE = minSize * factorChange;
            }
            
            setMousePointerSize(`${CURSOR_SIDE}px`);

            const currPointer = [event.pageX - CURSOR_SIDE / 2, event.pageY - CURSOR_SIDE / 2];
            const delta = [currPointer[0] - pointerX, currPointer[1] - pointerY];
            //   console.log(CURSOR_SIDE);

            //   const speedShareOfSize = (1+CURSOR_SIDE/100);
            let speedShareOfSize = SENSITIVITY*CURSOR_SIDE/1000;
            // if (region2) speedShareOfSize = 2;
            // else speedShareOfSize = 20;

            pointerX = currPointer[0] - delta[0] + delta[0] * speedShareOfSize;
            pointerY = currPointer[1] - delta[1] + delta[1] * speedShareOfSize;
            pointerStyle.left = `${pointerX}px`;
            pointerStyle.top = `${pointerY}px`;
            oldPointer = currPointer;

            // console.log(`CURSOR_SIDE:${CURSOR_SIDE}, factor:${speedShareOfSize},event.pageX:${event.pageX},pointerX:${pointerX},currPointer:${currPointer[0]},delta:${delta[0]}, VisualDelta:${pointerX-currPointer[0]}`);

            // lastCursorPositionXY = [event.pageX, event.pageY];

            if (region2) {
                highlightObj(pointerX+CURSOR_SIDE/2, pointerY+CURSOR_SIDE/2, CURSOR_SIDE, tilesList);
            } else {
                // console.log(region2,event.target.closest(".ytVirtualListContainer"),event.target.closest(".ytr-guide-response"));
                buttonList = [...document.getElementsByClassName("ytLrButtonHighlighted"), document.getElementsByClassName("ytLrTextBoxFocusable ytLrTextBoxAnimateWidth ytLrTextBoxHost")[0],document.getElementsByClassName("ytLrSearchVoiceHost")[0],];
                highlightObj(pointerX+CURSOR_SIDE/2, pointerY+CURSOR_SIDE/2, CURSOR_SIDE, buttonList);
            }
        });

        let CURSOR_VISIBLE = false;
        document.addEventListener("keypress",(event)=>{
            if(event.key >= 1 && event.key <= 9){
                SENSITIVITY = event.key;
            }
            else if(event.key == "m"){
                CURSOR_VISIBLE=!CURSOR_VISIBLE;
                document.body.style.cursor = CURSOR_VISIBLE? "default": "none";
            }
            console.log("Sensitivity: ",SENSITIVITY);
        });

        let CURR_SIDE = 500;
        let MANUAL_MODE = false;
        document.addEventListener("wheel", (event) => {
          MANUAL_MODE = true;
          event.deltaY <= 0 ? (factorChange *= 1.05) : (factorChange *= 0.95);

          const region2 =
            event.target.closest(".ytVirtualListContainer") != null &&
            event.target.closest(".ytr-guide-response") == null;
          if (region2) {
            CURR_SIDE = 3 * minSize * factorChange;
          } else {
            CURR_SIDE = minSize * factorChange;
          }
          setMousePointerSize(`${CURR_SIDE}px`);
          pointerX = event.pageX - CURR_SIDE / 2;
          pointerY = event.pageY - CURR_SIDE / 2;
          pointerStyle.left = `${pointerX}px`;
          pointerStyle.top = `${pointerY}px`;
          // lastCursorPositionXY = [event.pageX, event.pageY];
        });
    }
};
