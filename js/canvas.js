let canvasHeight = 1200;
let canvasWidth = 800;
const pixelPerUnitLength = 50;
const spance=20;
let lastToolId = "pencil";
let currentToolId = "pencil";
let currentLineWidth = {id: "line2px", width: 2};
let lastLineWidth = {id: "line2px", width: 2};
let currentEraserWidth = {id: "eraser10px", width: 10};
let lastEraserWidth = {id: "eraser10px", width: 10};
let canvas;
let ctx;
let beginPoint = {x: 0, y: 0};
let lastPoint = {x: 0, y: 0};
let points = [];
let drawFlag = false;
let canvasAllOps = [];
let currentColor = {id:"black", value: "#000000"};
let lastColor = {id:"black", value: "#000000"};
let scaleRate = {x: 1, y: 1};
let context = null;

// 画坐标轴
function drawCoordinateAxis() {
    let currentStyle = ctx.strokeStyle;
    let currentLineWidth = ctx.lineWidth;
    let currentFIllStyle = ctx.fillStyle;
    ctx.strokeStyle="#777777";
    ctx.fillStyle = "#777777";
    ctx.lineWidth = 2;
    ctx.setLineDash([5]);
    // 绘制Y轴
    ctx.beginPath();
    ctx.moveTo(canvasWidth/2,spance);
    ctx.lineTo(canvasWidth/2,canvasHeight-spance);
    ctx.stroke();
    //2.绘制X轴
    ctx.beginPath();
    ctx.moveTo(spance,canvasHeight/2);
    ctx.lineTo(canvasWidth-spance,canvasHeight/2);
    ctx.stroke();
    //3.绘制X轴的箭头
    ctx.moveTo(canvasWidth-spance,canvasHeight/2-5);
    ctx.lineTo(canvasWidth-spance,canvasHeight/2+5);
    ctx.lineTo(canvasWidth-spance+10,canvasHeight/2);
    ctx.closePath();
    ctx.fill();
    //绘制Y轴箭头
    ctx.moveTo(canvasWidth/2-5,spance);
    ctx.lineTo(canvasWidth/2+5,spance);
    ctx.lineTo(canvasWidth/2,spance-10);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = currentLineWidth;
    ctx.strokeStyle = currentStyle;
    ctx.fillStyle = currentFIllStyle;
    ctx.setLineDash([]);
}
// 画坐标刻度
function drawCoordinateScale() {
    let currentStyle = ctx.strokeStyle;
    let currentLineWidth = ctx.lineWidth;
    let currentFIllStyle = ctx.fillStyle;
    ctx.strokeStyle="#aaa";
    ctx.fillStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    // x坐标
    for(let i = canvasWidth/2+pixelPerUnitLength/scaleRate.x; i < canvasWidth-spance; i += pixelPerUnitLength/scaleRate.x){
        ctx.moveTo(i, spance);
        ctx.lineTo(i, canvasHeight-spance);
    }
    for(let i = canvasWidth/2-pixelPerUnitLength/scaleRate.x; i > spance; i -= pixelPerUnitLength/scaleRate.x){
        ctx.moveTo(i, spance);
        ctx.lineTo(i, canvasHeight-spance);
    }
    // y坐标
    for(let i = canvasHeight/2+pixelPerUnitLength/scaleRate.y; i < canvasHeight-spance; i += pixelPerUnitLength/scaleRate.y){
        ctx.moveTo(spance, i);
        ctx.lineTo(canvasWidth-spance, i);
    }
    for(let i = canvasHeight/2-pixelPerUnitLength/scaleRate.y; i > spance; i -= pixelPerUnitLength/scaleRate.y){
        ctx.moveTo(spance, i);
        ctx.lineTo(canvasWidth-spance, i);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = currentLineWidth;
    ctx.strokeStyle = currentStyle;
    ctx.fillStyle = currentFIllStyle;
    ctx.setLineDash([]);
}

function setSelectImg(lastID, currentID) { //设置选中、未选中图片颜色
    document.getElementById(lastID).src = "../images/" + lastID + ".png";
    document.getElementById(currentID).src = "../images/" + currentID + "_select.png";
}

function onClickPen(e){  // "../images/eraser_select.png"
    canvas.height = canvas.height;
    reDrawCanvas();
    currentToolId = e.id;
    setSelectImg(lastToolId, currentToolId);
    lastToolId = currentToolId;
}
function onClickLineWidth(e) {
    canvas.height = canvas.height;
    reDrawCanvas();
    switch (e.id){
        case "line2px": currentLineWidth = {id:"line2px", width: 2}; break;
        case "line4px": currentLineWidth = {id:"line4px", width: 4}; break;
        case "line8px": currentLineWidth = {id:"line8px", width: 8}; break;
        case "line12px": currentLineWidth = {id:"line12px", width: 12}; break;
        default: currentLineWidth = {id: "line2px", width: 2}; break;
    }
    setSelectImg(lastLineWidth.id, currentLineWidth.id);
    lastLineWidth = currentLineWidth;
    ctx.lineWidth = currentLineWidth.width;
}
function onClickEraserWidth(e) {
    canvas.height = canvas.height;
    reDrawCanvas();
    switch (e.id){
        case "eraser10px": currentEraserWidth = {id:"eraser10px", width: 10}; break;
        case "eraser30px": currentEraserWidth = {id:"eraser30px", width: 30}; break;
        case "eraser50px": currentEraserWidth = {id:"eraser50px", width: 50}; break;
        case "eraser80px": currentEraserWidth = {id:"eraser80px", width: 80}; break;
        default: currentEraserWidth = {id: "eraser10px", width: 10}; break;
    }
    setSelectImg(lastEraserWidth.id, currentEraserWidth.id);
    lastEraserWidth = currentEraserWidth;
}
function onClickColor(e) {
    canvas.height = canvas.height;
    reDrawCanvas();
    switch (e.id) {
        case "black": currentColor = {id:"black", value: "#000000"}; break;
        case "red": currentColor = {id:"red", value: "#ff0000"}; break;
        case "blue": currentColor = {id:"blue", value: "#0000ff"}; break;
        case "yellow": currentColor = {id:"yellow", value: "#ffff00"}; break;
        case "purple": currentColor = {id:"purple", value: "#9900ff"}; break;
        case "green": currentColor = {id:"green", value: "#009900"}; break;
        case "orange": currentColor = {id:"orange", value: "#ff9900"}; break;
        case "darkBlue": currentColor = {id:"darkBlue", value: "#000099"}; break;
        case "brown": currentColor = {id:"brown", value: "#663300"}; break;
        case "wineRed": currentColor = {id:"wineRed", value: "#8b0000"}; break;
        case "golden": currentColor = {id:"golden", value: "#ffd700"}; break;
        case "pink": currentColor = {id:"pink", value: "#ffc8cb"}; break;
    }
    document.getElementById(e.id).parentNode.className = "colorSelectLiSelect";
    document.getElementById(e.id).className = "toolsImgSelect";
    document.getElementById(e.id).width = 12;
    document.getElementById(e.id).height = 12;
    document.getElementById(lastColor.id).parentNode.className = "colorSelectLi";
    document.getElementById(lastColor.id).width = 15;
    document.getElementById(lastColor.id).height = 15;
    document.getElementById(lastColor.id).className = "toolsImg";
    lastColor = currentColor;
    ctx.strokeStyle = currentColor.value;
}

// 铅笔
function pencilMouseStart(e){
    drawFlag = true;
    let currentPoint = getPoint(e);
    points.push(currentPoint);
    beginPoint = currentPoint;
}
function pencilDraw(e){  //铅笔
    if(!drawFlag) return;
    let currentPoint = getPoint(e);
    points.push(currentPoint);

    if(points.length > 3){
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        };
        drawCurve(beginPoint, controlPoint, endPoint);
        beginPoint = endPoint;
    }
}
function pencilMouseEnd(e){
    if(!drawFlag) return;
    if(!drawFlag) return;
    let currentPoint = getPoint(e);
    points.push(currentPoint);
    if(points.length > 3){
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = lastTwoPoints[1];
        drawCurve(beginPoint, controlPoint, endPoint);
    }
    ctx.lineWidth = currentLineWidth.width;
    beginPoint = null;
    drawFlag = false;
    points = [];
}

// 钢笔
function penDraw(e) {
    if(!drawFlag) return;
    let currentPoint = getPoint(e);
    points.push(currentPoint);

    if(points.length > 3){
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        };
        let distance = getDistance(beginPoint, endPoint);
        let added = currentLineWidth.width / (distance + 0.3);
        ctx.lineWidth = currentLineWidth.width + added;
        drawCurve(beginPoint, controlPoint, endPoint, false);
        beginPoint = endPoint;
    }
}

// 橡皮擦
function eraserStart(e){
    drawFlag = true;
    beginPoint = getPoint(e);
    lastPoint = beginPoint;

}
function eraserDraw(e) {
    beginPoint = getPoint(e);
    let endPoint = {x: beginPoint.x+currentEraserWidth.width/2, y: beginPoint.y+currentEraserWidth.width/2};
    if(!drawFlag){ //鼠标移动，未按下
        canvas.height = canvas.height;
        reDrawCanvas();
        drawEraser(beginPoint, currentEraserWidth.width/2);
        let currentLineWidth = ctx.lineWidth;
        ctx.lineWidth = 2;
        drawRect(beginPoint, endPoint);
        ctx.lineWidth = currentLineWidth;
    }
    else{ // 鼠标按下移动
        canvas.height = canvas.height;
        reDrawCanvas();
        let xGap = beginPoint.x - lastPoint.x;
        let yGap = beginPoint.y - lastPoint.y;
        if(Math.abs(xGap) > currentEraserWidth.width || Math.abs(yGap) > currentEraserWidth.width){  // x轴或y轴向上位移超过橡皮擦宽度
            let biggerGap = Math.abs(xGap) > Math.abs(yGap) ? xGap : yGap;
            let times = Math.abs(biggerGap) / currentEraserWidth.width;
            let startPoint = {x: 0, y: 0};
            for(let i = 0; i < times; i++){
                startPoint.x = lastPoint.x + xGap / times * i;
                startPoint.y = lastPoint.y + yGap / times * i;
                // console.log(i, startPoint);
                // fill_Rect(startPoint, endPoint, "#ffffff");
                drawEraser(startPoint, currentEraserWidth.width/2);
                canvasAllOps.push({
                    type: "Eraser",
                    lineWidth: ctx.lineWidth,
                    color: currentColor,
                    beginPoint: startPoint,
                    eraserWidth: currentEraserWidth
                });
            }
        }else {
            drawEraser(beginPoint, currentEraserWidth.width/2);
            canvasAllOps.push({
                type: "Eraser",
                lineWidth: ctx.lineWidth,
                color: currentColor,
                beginPoint: beginPoint,
                eraserWidth: currentEraserWidth
            });
        }
        ctx.lineWidth = 2;
        drawRect(beginPoint, endPoint);
        ctx.lineWidth = currentLineWidth.width;
    }
    lastPoint = beginPoint;
}
function eraserEnd(e) {
    if(!drawFlag) return;
    drawFlag = false;
    beginPoint = getPoint(e);
    if(beginPoint.x === lastPoint.x && beginPoint.y === lastPoint.y){  // 鼠标未移动
        let endPoint = {x: beginPoint.x+currentEraserWidth.width/2, y: beginPoint.y+currentEraserWidth.width/2};
        drawEraser(beginPoint, currentEraserWidth.width/2);
        ctx.lineWidth = 2;
        drawRect(beginPoint, endPoint);
        ctx.lineWidth = currentLineWidth.width;
        canvasAllOps.push({
            type: "Eraser",
            lineWidth: ctx.lineWidth,
            color: currentColor,
            beginPoint: beginPoint,
            eraserWidth: currentEraserWidth
        });
    }
}


// 直线工具
function straightLineStart(e) {
    beginPoint = getPoint(e);
    lastPoint = beginPoint;
    drawFlag = true;
}
function straightLineMove(e){
    if(!drawFlag) return;
    lastPoint = getPoint(e);
    canvas.height = canvas.height;
    reDrawCanvas();
    drawLine(beginPoint, lastPoint);

}
function straightLineEnd(e) {
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Line",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        endPoint: lastPoint
    });
}

// 圆形工具
function circleStart(e) {
    beginPoint = getPoint(e);
    lastPoint = beginPoint;
    drawFlag = true;
}
function circleDraw(e) {
    if(!drawFlag) return;
    lastPoint = getPoint(e);
    canvas.height = canvas.height;
    reDrawCanvas();
    drawCircle(beginPoint, lastPoint);
}
function circleEnd(e){
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Circle",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        endPoint: lastPoint
    });
}

// 三角形工具
function triangleStart(e) {
    beginPoint = getPoint(e);
    lastPoint = beginPoint;
    drawFlag = true;
}
function triangleDraw(e) {
    if(!drawFlag) return;
    lastPoint = getPoint(e);
    canvas.height = canvas.height;
    reDrawCanvas();
    console.log("redraw finish");
    drawTriangle(beginPoint, lastPoint);
}
function triangleEnd(e) {
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Triangle",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        endPoint: lastPoint
    });
}

// 矩形工具
function rectStart(e) {
    beginPoint = getPoint(e);
    lastPoint = beginPoint;
    drawFlag = true;
}
function rectDraw(e) {
    if(!drawFlag) return;
    lastPoint = getPoint(e);
    canvas.height = canvas.height;
    reDrawCanvas();
    drawRect(beginPoint, lastPoint);
}
function rectEnd(e) {
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Rect",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        endPoint: lastPoint
    });
}

// 星形工具
function starStart(e){
    beginPoint = getPoint(e);
    lastPoint = beginPoint;
    drawFlag = true;
}
function starDraw(e){
    if(!drawFlag) return;
    lastPoint = getPoint(e);
    canvas.height = canvas.height;
    reDrawCanvas();
    drawStar(beginPoint, lastPoint);
}

function starEnd(e){
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Star",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        endPoint: lastPoint
    });
}

// 绘制二次贝塞尔曲线，传入参数：
// beginPoint 起始点
// controlPoint 控制点
// endPoint 结束点
function drawCurve(beginPoint, controlPoint, endPoint, isReDraw){
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
    if(isReDraw) return;
    canvasAllOps.push({
        type: "Curve",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        beginPoint: beginPoint,
        controlPoint: controlPoint,
        endPoint: endPoint
    });
}
function drawLine(beginPoint, endPoint){
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
}
function drawCircle(beginPoint, endPoint) {
    ctx.beginPath();
    ctx.arc(beginPoint.x, beginPoint.y, getDistance(beginPoint, endPoint), 0, 2*Math.PI, true);
    ctx.stroke();
    ctx.closePath();
}
function drawEraser(centerPoint, halfWidth) {
    ctx.beginPath();
    ctx.clearRect(centerPoint.x-halfWidth, centerPoint.y-halfWidth, halfWidth*2, halfWidth*2);
    ctx.stroke();
    ctx.closePath();
}
function drawRect(beginPoint, endPoint) {
    ctx.beginPath();
    let st = {x: 0, y: 0};
    if(endPoint.y < beginPoint.y) {
        if (endPoint.x > beginPoint.x) {
            st.x = beginPoint.x - (endPoint.x - beginPoint.x);
            st.y = endPoint.y;
            ctx.rect(st.x, st.y, 2 * (endPoint.x - beginPoint.x), 2 * (beginPoint.y - endPoint.y));
        } else {
            st.x = endPoint.x;
            st.y = endPoint.y;
            ctx.rect(st.x, st.y, 2 * (beginPoint.x - endPoint.x), 2 * (beginPoint.y - endPoint.y));
        }
    }
    else{
        if(endPoint.y > beginPoint.y) {
            st.x = beginPoint.x - (endPoint.x - beginPoint.x);
            st.y = beginPoint.y - (endPoint.y - beginPoint.y);
            ctx.rect(st.x, st.y, 2 * (endPoint.x - beginPoint.x), 2 * (endPoint.y - beginPoint.y));
        }
        else{
            st.x = endPoint.x;
            st.y = beginPoint.y - (endPoint.y - beginPoint.y);
            ctx.rect(st.x, st.y, 2*(beginPoint.x-endPoint.x), endPoint.y-st.y);
        }
    }
    ctx.stroke();
    ctx.closePath();
}
function fill_Rect(beginPoint, endPoint, fillColor) {
    let currentStyle = ctx.fillStyle;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    let st = {x: 0, y: 0};
    if(endPoint.y < beginPoint.y) {
        if (endPoint.x > beginPoint.x) {
            st.x = beginPoint.x - (endPoint.x - beginPoint.x);
            st.y = endPoint.y;
            ctx.fillRect(st.x, st.y, 2 * (endPoint.x - beginPoint.x), 2 * (beginPoint.y - endPoint.y));
        } else {
            st.x = endPoint.x;
            st.y = endPoint.y;
            ctx.fillRect(st.x, st.y, 2 * (beginPoint.x - endPoint.x), 2 * (beginPoint.y - endPoint.y));
        }
    }
    else{
        if(endPoint.y > beginPoint.y) {
            st.x = beginPoint.x - (endPoint.x - beginPoint.x);
            st.y = beginPoint.y - (endPoint.y - beginPoint.y);
            ctx.fillRect(st.x, st.y, 2 * (endPoint.x - beginPoint.x), 2 * (endPoint.y - beginPoint.y));
        }
        else{
            st.x = endPoint.x;
            st.y = beginPoint.y - (endPoint.y - beginPoint.y);
            ctx.fillRect(st.x, st.y, 2*(beginPoint.x-endPoint.x), endPoint.y-st.y);
        }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = currentStyle;
}
function fill_LongRect(beginPoint, endPoint, fillColor) {
    let currentFillStyle = ctx.fillStyle;
    let currentLineStyle = ctx.strokeStyle;
    const halfWidth = currentEraserWidth.width/2;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.strokeStyle = fillColor;

    let a = {x: 0, y: 0}, b = {x: 0, y: 0}, c = {x: 0, y: 0}, d = {x: 0, y: 0};
    if(beginPoint.y === endPoint.y){
        let rightPoint, leftPoint;
        if(beginPoint.x > endPoint.x) {
            rightPoint = beginPoint;
            leftPoint = endPoint;
        }else{
            rightPoint = endPoint;
            leftPoint = beginPoint;
        }
        a = {x: rightPoint.x + halfWidth, y: rightPoint.y - halfWidth};
        b = {x: rightPoint.x + halfWidth, y: rightPoint.y + halfWidth};
        c = {x: leftPoint.x - halfWidth, y: leftPoint.y + halfWidth};
        d = {x: leftPoint.x - halfWidth, y: leftPoint.y - halfWidth};
    }
    else {
        let rightPoint, leftPoint;
        let alpha = Math.atan((endPoint.y - beginPoint.y) / (beginPoint.x - endPoint.x));
        if(beginPoint.x > endPoint.x){
            rightPoint = beginPoint;
            leftPoint = endPoint;
        }else {
            rightPoint = endPoint;
            leftPoint = beginPoint;
        }
        a = {
            x: rightPoint.x + halfWidth * ((1 + 1 / Math.tan(alpha)) * Math.cos(alpha) - 1 / Math.sin(alpha)),
            y: rightPoint.y - halfWidth * (1 + 1 / Math.tan(alpha)) * Math.tan(alpha)
        };
        b = {
            x: rightPoint.x + halfWidth * ((1 + 1 / Math.tan(alpha)) * Math.cos(alpha) - 1 / Math.sin(alpha)),
            y: rightPoint.y + halfWidth * (1 + 1 / Math.tan(alpha)) * Math.tan(alpha)
        };
        c = {
            x: leftPoint.x - halfWidth * ((1 + 1 / Math.tan(alpha)) * Math.cos(alpha) - 1 / Math.sin(alpha)),
            y: leftPoint.y + halfWidth * (1 + 1 / Math.tan(alpha)) * Math.tan(alpha)
        };
        d = {
            x: leftPoint.x - halfWidth * ((1 + 1 / Math.tan(alpha)) * Math.cos(alpha) - 1 / Math.sin(alpha)),
            y: leftPoint.y - halfWidth * (1 + 1 / Math.tan(alpha)) * Math.tan(alpha)
        };
    }
    // ctx.fillRect(beginPoint.x, beginPoint.y, endPoint.x-beginPoint.x, height);
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.lineTo(a.x, a.y);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = currentFillStyle;
    ctx.strokeStyle = currentLineStyle;
}
function drawTriangle(beginPoint, endPoint) {
    let l = getDistance(beginPoint, endPoint) * Math.sqrt(3);
    let a = {x: 0, y: 0}, b = {x: 0, y: 0}, c = {x: 0, y: 0};
    if(beginPoint.y === endPoint.y){
        a = {x: endPoint.x, y: endPoint.y};
        b = {x: beginPoint.x-getDistance(beginPoint, endPoint)/2, y: endPoint.y-l/2};
        c = {x: beginPoint.x-getDistance(beginPoint, endPoint)/2, y: endPoint.y+l/2};
    }
    else {
        let alpha = Math.atan((beginPoint.y - endPoint.y) / (endPoint.x - beginPoint.x)); // 弧度制
        let e = {x: beginPoint.x-(endPoint.x-beginPoint.x)/2, y: beginPoint.y+(beginPoint.y-endPoint.y)/2};
        a = {x: endPoint.x, y: endPoint.y};
        b.x = e.x - l/2 * Math.sin(alpha);
        b.y = e.y - l/2 * Math.cos(alpha);
        c.x = e.x + l/2 * Math.sin(alpha);
        c.y = e.y + l/2 * Math.cos(alpha);
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(a.x, a.y);
    ctx.stroke();
    ctx.closePath();
}
function drawStar(beginPoint, endPoint){
    ctx.beginPath();
    let R = getDistance(beginPoint, endPoint);
    let r = R/2;
    let x;
    let y;
    for (let i = 0; i < 5; i++){
        // 外围凸出的每个点坐标
        x = Math.cos((18 + 72*i) / 180 * Math.PI) * R+beginPoint.x
        y = -Math.sin((18 + 72*i) / 180 * Math.PI) * R+beginPoint.y // canvas中y轴的正向方向与直角坐标系相反
        ctx.lineTo(x, y)
        // 外围凹下去的每个点坐标
        x = Math.cos((54 + 72*i) / 180 * Math.PI) * r+beginPoint.x
        y = -Math.sin((54 + 72*i) / 180 * Math.PI) * r+beginPoint.y // canvas中y轴的正向方向与直角坐标系相反
        ctx.lineTo(x, y)

    }
    ctx.moveTo(x, y);
    ctx.lineTo(Math.cos(18/180 * Math.PI) * R+beginPoint.x,-Math.sin(18/ 180 * Math.PI) * R+beginPoint.y );
    ctx.stroke();
    ctx.closePath();
}

function reDrawCanvas(){
    for(let i = 0; i < canvasAllOps.length; i++){
        let oneOp = canvasAllOps[i];
        ctx.lineWidth = oneOp.lineWidth;
        ctx.strokeStyle = oneOp.color.value;
        switch (oneOp.type){
            case "Curve": drawCurve(oneOp.beginPoint, oneOp.controlPoint, oneOp.endPoint, true); break;
            case "Line": drawLine(oneOp.beginPoint, oneOp.endPoint); break;
            case "Circle": drawCircle(oneOp.beginPoint, oneOp.endPoint); break;
            case "Rect": drawRect(oneOp.beginPoint, oneOp.endPoint); break;
            case "Triangle": drawTriangle(oneOp.beginPoint, oneOp.endPoint); break;
            case "Star": drawStar(oneOp.beginPoint, oneOp.endPoint); break;
            case "Eraser": drawEraser(oneOp.beginPoint, oneOp.eraserWidth.width/2); break;
        }
    }
    drawCoordinateAxis();
    drawCoordinateScale();
    ctx.lineWidth = currentLineWidth.width;
    ctx.strokeStyle = currentColor.value;
}

function getPoint(e){
    return{
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
}
function getDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

window.onload = function (){
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
    ctx.lineWidth = currentLineWidth.width;
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    canvas.addEventListener("mousedown", function (e){
        switch (currentToolId) {
            case "pencil": pencilMouseStart(e);break; //铅笔
            case "pen": pencilMouseStart(e); break;
            case "eraser": eraserStart(e); break;
            case "straightLine": straightLineStart(e); break;
            case "circle": circleStart(e); break;
            case "rectangle": rectStart(e); break;
            case "triangle": triangleStart(e); break;
            case "star": starStart(e); break;
            case "rhomboid": break;
        }
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        switch (currentToolId) {
            case "pencil": pencilDraw(e); break;
            case "pen": penDraw(e); break;
            case "eraser": eraserDraw(e); break;
            case "straightLine": straightLineMove(e); break;
            case "circle": circleDraw(e); break;
            case "rectangle": rectDraw(e); break;
            case "triangle": triangleDraw(e); break;
            case "star": starDraw(e); break;
            case "rhomboid": break;
        }
    }, false);
    canvas.addEventListener("mouseup", function (e){
        switch (currentToolId) {
            case "pencil": pencilMouseEnd(e); break;
            case "pen": pencilMouseEnd(e); break;
            case "eraser": eraserEnd(e); break;
            case "straightLine": straightLineEnd(e); break;
            case "circle": circleEnd(e); break;
            case "rectangle": rectEnd(e); break;
            case "triangle": triangleEnd(e); break;
            case "star": starEnd(e); break;
            case "rhomboid": break;
        }
    }, false);
    canvas.addEventListener("mouseleave", function (e){
        switch (currentToolId){
            case "pencil": pencilMouseEnd(e); break;
            case "pen": pencilMouseEnd(e); break;
            case "eraser": eraserEnd(e); break;
            case "straightLine": straightLineEnd(e); break;
            case "circle": circleEnd(e); break;
            case "rectangle": rectEnd(e); break;
            case "triangle": triangleEnd(e); break;
            case "star": starEnd(e); break;
            case "rhomboid": break;
        }
    }, false);
    document.getElementById("clearBtn").addEventListener("click", function (){
        canvas.height = canvas.height;
        drawCoordinateAxis();
        drawCoordinateScale();
    }, false);
    drawCoordinateAxis();
    drawCoordinateScale();
}

function selectEraserBox(isHide) {
    if(isHide){
        $("#eraserSelectBorder").hide();
        $("#eraserSelectTitle").hide();
        $("#eraserText").hide();
        $("#eraserSelectUl").hide();
        $("#10pxLi").hide();
        $("#20pxLi").hide();
        $("#30pxLi").hide();
        $("#50pxLi").hide();

        $("#lineWidthSelectBorder").show();
        $("#lineWidthSelectTitle").show();
        $("#lineWidthText").show();
        $("#lineWidthSelectUl").show();
        $("#2pxLi").show();
        $("#4pxLi").show();
        $("#8pxLi").show();
        $("#12pxLi").show();
    }
    else{
        $("#lineWidthSelectBorder").hide();
        $("#lineWidthSelectTitle").hide();
        $("#lineWidthText").hide();
        $("#lineWidthSelectUl").hide();
        $("#2pxLi").hide();
        $("#4pxLi").hide();
        $("#8pxLi").hide();
        $("#12pxLi").hide();

        $("#eraserSelectBorder").show();
        $("#eraserSelectTitle").show();
        $("#eraserText").show();
        $("#eraserSelectUl").show();
        $("#10pxLi").show();
        $("#20pxLi").show();
        $("#30pxLi").show();
        $("#50pxLi").show();
    }

}

$(document).ready(function(){
    selectEraserBox(true);

    $("#eraser").click(function(){
        selectEraserBox(false);
    });
    $("#pencil").click(function(){
        selectEraserBox(true);
    });
    $("#pen").click(function(){
        selectEraserBox(true);
    });
    $("#straightLine").click(function(){
        selectEraserBox(true);
    });
    $("#circle").click(function(){
        selectEraserBox(true);
    });
    $("#triangle").click(function(){
        selectEraserBox(true);
    });
    $("#rectangle").click(function(){
        selectEraserBox(true);
    });
    $("#star").click(function(){
        selectEraserBox(true);
    });
});
