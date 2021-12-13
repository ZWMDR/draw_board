let canvasHeight = 0;
let canvasWidth = 0;
const pixelPerUnitLength = 50;
const spance=20;
let lastToolId = "pencil";
let currentToolId = "pencil";
let currentLineWidth = {id: "line2px", width: 2};
let lastLineWidth = {id: "line2px", width: 2};
let currentEraserWidth = {id: "eraser10px", width: 10};
let lastEraserWidth = {id: "eraser10px", width: 10};
let canvas, backCanvas, coordCanvas;
let ctx, backCtx, coordCtx;
let beginPoint = {x: 0, y: 0};
let lastPoint = {x: 0, y: 0};
let points = [];
let drawFlag = false;
let canvasAllOps = [];
let currentColor = {id:"black", value: "#000000"};
let lastColor = {id:"black", value: "#000000"};
let scaleRate = {x: 1, y: 1};
let canvasCenter = {x: 0, y: 0};
let canvasOffset = {x: 0, y: 0};
let currentLineStyle = {id: "solid", dashes: []};
let lastLineStyle = {id: "solid", dashes: []};
let lineTypeBox = false;


// 画坐标轴
function drawCoordinateAxis() {
    backCtx.strokeStyle="#777777";
    backCtx.fillStyle = "#777777";
    backCtx.lineWidth = 2;
    backCtx.setLineDash([5]);
    // 绘制Y轴
    backCtx.beginPath();
    backCtx.moveTo(canvasWidth/2,spance);
    backCtx.lineTo(canvasWidth/2,canvasHeight-spance);
    backCtx.stroke();
    // 绘制X轴
    backCtx.beginPath();
    backCtx.moveTo(spance,canvasHeight/2);
    backCtx.lineTo(canvasWidth-spance,canvasHeight/2);
    backCtx.stroke();
    // 绘制X轴的箭头
    backCtx.moveTo(canvasWidth-spance,canvasHeight/2-5);
    backCtx.lineTo(canvasWidth-spance,canvasHeight/2+5);
    backCtx.lineTo(canvasWidth-spance+10,canvasHeight/2);
    backCtx.closePath();
    backCtx.fill();
    // 绘制Y轴箭头
    backCtx.moveTo(canvasWidth/2-5,spance);
    backCtx.lineTo(canvasWidth/2+5,spance);
    backCtx.lineTo(canvasWidth/2,spance-10);
    backCtx.closePath();
    backCtx.fill();

    backCtx.lineWidth = 1;
    backCtx.setLineDash([]);
    backCtx.font = "italic 20px Times New Roman";
    backCtx.strokeStyle = "#4d0099";
    backCtx.textAlign = "center";
    backCtx.strokeText("x", canvasWidth-spance-10, canvasHeight/2-10);
    backCtx.strokeText("y", canvasWidth/2+10, spance+10);
}
// 画坐标刻度
function drawCoordinateScale() {
    backCtx.strokeStyle="#aaa";
    backCtx.lineWidth = 1;
    backCtx.setLineDash([5, 10]);
    backCtx.beginPath();
    // x坐标
    for(let i = canvasWidth/2+pixelPerUnitLength/scaleRate.x; i < canvasWidth-spance; i += pixelPerUnitLength/scaleRate.x){
        backCtx.moveTo(i, spance);
        backCtx.lineTo(i, canvasHeight-spance);
    }
    for(let i = canvasWidth/2-pixelPerUnitLength/scaleRate.x; i > spance; i -= pixelPerUnitLength/scaleRate.x){
        backCtx.moveTo(i, spance);
        backCtx.lineTo(i, canvasHeight-spance);
    }
    // y坐标
    for(let i = canvasHeight/2+pixelPerUnitLength/scaleRate.y; i < canvasHeight-spance; i += pixelPerUnitLength/scaleRate.y){
        backCtx.moveTo(spance, i);
        backCtx.lineTo(canvasWidth-spance, i);
    }
    for(let i = canvasHeight/2-pixelPerUnitLength/scaleRate.y; i > spance; i -= pixelPerUnitLength/scaleRate.y){
        backCtx.moveTo(spance, i);
        backCtx.lineTo(canvasWidth-spance, i);
    }
    backCtx.stroke();
    backCtx.closePath();
    backCtx.setLineDash([]);
}
// function writeCoordinateNote() {
//     backCtx.lineWidth = 1;
//     backCtx.setLineDash([]);
//     backCtx.font = "italic 20px Times New Roman";
//     backCtx.strokeStyle = "#4d0099";
//     backCtx.textAlign = "center";
//     backCtx.strokeStyle="#999";
//     for(let i = canvasWidth/2+pixelPerUnitLength/scaleRate.x; i < canvasWidth-spance; i += pixelPerUnitLength/scaleRate.x){
//         backCtx.strokeText("x", canvasWidth-spance-10, canvasHeight/2-10);
//     }
//     for(let i = canvasWidth/2-pixelPerUnitLength/scaleRate.x; i > spance; i -= pixelPerUnitLength/scaleRate.x){
//         backCtx.moveTo(i, spance);
//         backCtx.lineTo(i, canvasHeight-spance);
//     }
//     // y坐标
//     for(let i = canvasHeight/2+pixelPerUnitLength/scaleRate.y; i < canvasHeight-spance; i += pixelPerUnitLength/scaleRate.y){
//         backCtx.moveTo(spance, i);
//         backCtx.lineTo(canvasWidth-spance, i);
//     }
//     for(let i = canvasHeight/2-pixelPerUnitLength/scaleRate.y; i > spance; i -= pixelPerUnitLength/scaleRate.y){
//         backCtx.moveTo(spance, i);
//         backCtx.lineTo(canvasWidth-spance, i);
//     }
//
// }
// 鼠标显示横纵坐标
function mouseCoordinateRuler(currentPoint) {
    let xCoord = ((currentPoint.x - canvasWidth/2) / pixelPerUnitLength * scaleRate.x).toFixed(1);
    let yCoord = ((canvasHeight/2 - currentPoint.y) / pixelPerUnitLength * scaleRate.y).toFixed(1);
    mouseCoordinateAxis(xCoord, yCoord, currentPoint);
    if(drawFlag){
        $("#coordinateHintBox").hide();
        return;
    }
    $("#coordinateHintBox").show();
    let pageCoord = canvas2PageCoordinate(currentPoint);
    $("#coordinateHintBox").css("left", (pageCoord.x-35)+"px");
    $("#coordinateHintBox").css("top", (pageCoord.y-30)+"px");
    $("#coordinateHintSpan").text(xCoord + "," + yCoord);
}
// 在坐标轴上标度横纵坐标
function mouseCoordinateAxis(xCoord, yCoord, currentPoint) {
    coordCanvas.height = coordCanvas.height;
    coordCtx.lineWidth = 0.7;
    coordCtx.strokeStyle = "#4d0099";
    coordCtx.setLineDash([5, 15]);
    coordCtx.beginPath();
    coordCtx.moveTo(currentPoint.x, currentPoint.y);
    coordCtx.lineTo(currentPoint.x, canvasHeight/2);
    coordCtx.moveTo(currentPoint.x, currentPoint.y);
    coordCtx.lineTo(canvasWidth/2, currentPoint.y);
    coordCtx.stroke();
    coordCtx.closePath();

    coordCtx.lineWidth = 0.7;
    coordCtx.setLineDash([]);
    coordCtx.font = "italic 14px Times New Roman";
    coordCtx.strokeStyle = "#4d0099";
    coordCtx.textAlign = "center";
    coordCtx.strokeText(xCoord, currentPoint.x, canvasHeight/2-10);
    coordCtx.strokeText(yCoord, canvasWidth/2+10, currentPoint.y);
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
    switch (currentToolId) {
        case "pencil":{
            selectLineTypeBox(false, 90, 150);
            break;
        }
        case "pen":{
            selectLineTypeBox(false, 90, 185);
            break;
        }
        case "eraser":{
            selectLineTypeBox(true, 0, 0);
            break;
        }
        case "circle":{
            selectLineTypeBox(false, 90, 245);
            break;
        }
        case "straightLine":{
            selectLineTypeBox(false, 90, 210);
            break;
        }
        case "triangle":{
            selectLineTypeBox(false, 90, 290);
            break;
        }
        case "rectangle":{
            selectLineTypeBox(false, 90, 325);
            break;
        }
        case "star":{
            selectLineTypeBox(false, 90, 360);
            break;
        }
        case "rhomboid":{
            selectLineTypeBox(false, 90, 395);
            points = [];
            break;
        }
    }
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
function onClickLineStyle(e) {
    switch (e.id){
        case "solid": currentLineStyle = {id: "solid", dashes: []}; break;
        case "dashes_2_2": currentLineStyle = {id: "dashes_2_2", dashes: [2,2]}; break;
        case "dashes_5_5": currentLineStyle = {id: "dashes_5_5", dashes: [5,5]}; break;
        case "dashes_5_10": currentLineStyle = {id: "dashes_5_10", dashes: [5,10]}; break;
    }
    // document.getElementById(e.id).parentNode.className = "colorSelectLiSelect";
    // document.getElementById(e.id).className = "toolsImgSelect";
    // document.getElementById(e.id).width = 12;
    // document.getElementById(e.id).height = 12;
    // document.getElementById(lastLineStyle.id).parentNode.className = "colorSelectLi";
    // document.getElementById(lastLineStyle.id).width = 15;
    // document.getElementById(lastLineStyle.id).height = 15;
    // document.getElementById(lastLineStyle.id).className = "toolsImg";
    setSelectImg(lastLineStyle.id, currentLineStyle.id);
    ctx.setLineDash(currentLineStyle.dashes);
    lastLineStyle = currentLineStyle;
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
        drawCurve(beginPoint, controlPoint, endPoint, false);
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
        drawCurve(beginPoint, controlPoint, endPoint, false);
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
    ctx.setLineDash([]);
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
                    beginPoint: canvasPoint2BasePoint(startPoint),
                    eraserWidth: currentEraserWidth
                });
            }
        }else {
            drawEraser(beginPoint, currentEraserWidth.width/2);
            canvasAllOps.push({
                type: "Eraser",
                scaleRate: scaleRate,
                lineWidth: ctx.lineWidth,
                beginPoint: canvasPoint2BasePoint(beginPoint),
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
            scaleRate: scaleRate,
            lineWidth: ctx.lineWidth,
            beginPoint: canvasPoint2BasePoint(beginPoint),
            eraserWidth: canvasPoint2BasePoint(currentEraserWidth)
        });
    }
    ctx.setLineDash(currentLineStyle.dashes);
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
        scaleRate: scaleRate,
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        endPoint: canvasPoint2BasePoint(lastPoint)
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
        scaleRate: scaleRate,
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        endPoint: canvasPoint2BasePoint(lastPoint)
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
    drawTriangle(beginPoint, lastPoint);
}
function triangleEnd(e) {
    if(!drawFlag) return;
    drawFlag = false;
    if(lastPoint.x === beginPoint.x && lastPoint.y === beginPoint.y) return;
    canvasAllOps.push({
        type: "Triangle",
        scaleRate: scaleRate,
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        endPoint: canvasPoint2BasePoint(lastPoint)
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
        scaleRate: scaleRate,
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        endPoint: canvasPoint2BasePoint(lastPoint)
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
        scaleRate: scaleRate,
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        endPoint: canvasPoint2BasePoint(lastPoint)
    });
}

// 任意四边形
function rhomboidStart(e) {
    drawFlag = true;
}
function rhomboidDraw(e) {
    // if(!drawFlag) return;
    if(points.length > 0) {
        canvas.height = canvas.height;
        reDrawCanvas();
        reDrawRhomboid(points, true, {x: 1, y: 1});
        let currentPoint = getPoint(e);
        drawLine(points[points.length-1], currentPoint);
    }
}
function rhomboidEnd(e){
    if(!drawFlag) return;
    let currentPoint = getPoint(e);
    if (points.length > 2 && getDistance(points[0], currentPoint) < currentLineWidth.width + 5) {
        points.push(points[0]);
        rhomboidFinish();
        return;
    }
    fillCircle(currentPoint, currentLineWidth.width / 2 + 2, currentColor.value);
    points.push(currentPoint);
    drawFlag = false;
}
function rhomboidFinish(){
    drawFlag = false;
    for(let i = 0; i < points.length; i++)
        points[i] = canvasPoint2BasePoint(points[i]);

    canvasAllOps.push({
        type: "Rhomboid",
        lineWidth: ctx.lineWidth,
        color: currentColor,
        lineStyle: currentLineStyle,
        points: points
    });
    rhomboidCancel(true, 0);
}
function rhomboidCancel(isFinish, e){
    // console.log("cancel");
    if(!isFinish){
        let currentPoint = getPoint(e);
        if(currentPoint.x > 0 && currentPoint.x < canvas.width && currentPoint.y > 0 && currentPoint.y < canvas.height)
            return;
    }
    points = [];
    drawFlag = false;
    canvas.height = canvas.height;
    reDrawCanvas();
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
        lineStyle: currentLineStyle,
        beginPoint: canvasPoint2BasePoint(beginPoint),
        controlPoint: canvasPoint2BasePoint(controlPoint),
        endPoint: canvasPoint2BasePoint(endPoint)
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
function fillCircle(beginPoint, radius, fillColor) {
    ctx.beginPath();
    ctx.arc(beginPoint.x, beginPoint.y, radius, 0, 2*Math.PI, true);
    ctx.fillStyle = fillColor;
    ctx.fill();
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

    fillCircle(a, currentLineWidth.width/2, currentColor.value);
    fillCircle(b, currentLineWidth.width/2, currentColor.value);
    fillCircle(c, currentLineWidth.width/2, currentColor.value);

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

function reDrawRhomboid(points, isDrawing){
    let length = points.length;
    // if(length > 1) {
    //     for (let i = 0; i < length - 1; i++) {
    //         drawLine(canvasPointConvert(points[i], scale), canvasPointConvert(points[i+1], scale));
    //     }
    // }
    // if(isDrawing) {
    //     for (let i = 0; i < length; i++) {
    //         fillCircle(points[i], currentLineWidth.width / 2 + 2, currentColor.value);
    //     }
    // }else {
    //     drawLine(canvasPointConvert(points[length-1], scale), canvasPointConvert(points[0], scale));
    // }
    if(isDrawing){
        if(length > 1) {
            for (let i = 0; i < length - 1; i++) {
                drawLine(points[i], points[i+1]);
            }
            for (let i = 0; i < length; i++) {
                fillCircle(points[i], currentLineWidth.width / 2 + 2, currentColor.value);
            }
        }
    }else{ // isReDraw
        if(length > 1) {
            for (let i = 0; i < length - 1; i++) {
                drawLine(canvasPointConvert(points[i]), canvasPointConvert(points[i+1]));
                fillCircle(points[i], currentLineWidth.width/2, currentColor.value);
            }
            drawLine(canvasPointConvert(points[length-1]), canvasPointConvert(points[0]));
        }
    }
}

function reDrawCanvas(){
    for(let i = 0; i < canvasAllOps.length; i++){
        let oneOp = canvasAllOps[i];
        switch (oneOp.type){
            case "Curve": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawCurve(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.controlPoint), canvasPointConvert(oneOp.endPoint), true);
                break;
            }
            case "Line": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x / oneOp.scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawLine(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.endPoint));
                break;
            }
            case "Circle": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x / oneOp.scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawCircle(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.endPoint));
                break;
            }
            case "Rect": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x / oneOp.scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawRect(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.endPoint));
                break;
            }
            case "Triangle": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x / oneOp.scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawTriangle(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.endPoint));
                break;
            }
            case "Star": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x / oneOp.scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawStar(canvasPointConvert(oneOp.beginPoint), canvasPointConvert(oneOp.endPoint));
                break;
            }
            case "Rhomboid": {
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                reDrawRhomboid(oneOp.points, false);
                break;
            }
            case "Eraser": {
                drawEraser(oneOp.beginPoint, oneOp.eraserWidth.width/2);
                break;
            }
            case "function":{
                ctx.lineWidth = oneOp.lineWidth / scaleRate.x;
                ctx.strokeStyle = oneOp.color.value;
                ctx.setLineDash(oneOp.lineStyle.dashes);
                drawFormula(oneOp.expressStr, oneOp.startX, oneOp.endX, oneOp.sep);
                break;
            }
        }
    }
    ctx.lineWidth = currentLineWidth.width;
    ctx.strokeStyle = currentColor.value;
    ctx.setLineDash(currentLineStyle.dashes);
}

function getPoint(e){
    return{
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    };
}
function canvas2PageCoordinate(currentPoint) {
    return {
        x: currentPoint.x + canvas.offsetLeft,
        y: currentPoint.y + canvas.offsetTop
    };
}
function axis2PageCoordinate(axisPoint) {
    return{
        x: canvasCenter.x + axisPoint.x / scaleRate.x * pixelPerUnitLength,
        y: canvasCenter.y - axisPoint.y / scaleRate.y * pixelPerUnitLength
    };

}
function getDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

window.onload = function (){
    canvas = document.getElementById("mainCanvas");
    backCanvas = document.getElementById("backCanvas");
    coordCanvas = document.getElementById("coordCanvas");
    ctx = canvas.getContext("2d");
    backCtx = backCanvas.getContext("2d");
    coordCtx = coordCanvas.getContext("2d");
    ctx.lineWidth = currentLineWidth.width;
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    canvasCenter.x = canvasWidth / 2;
    canvasCenter.y = canvasHeight / 2;
    canvas.addEventListener("mousedown", function (e){ // 鼠标按下
        selectLineTypeBox(true, 0, 0);
        switch (currentToolId) {
            case "pencil":
                pencilMouseStart(e);
                break; //铅笔
            case "pen":
                pencilMouseStart(e);
                break;
            case "eraser":
                eraserStart(e);
                break;
            case "straightLine":
                straightLineStart(e);
                break;
            case "circle":
                circleStart(e);
                break;
            case "rectangle":
                rectStart(e);
                break;
            case "triangle":
                triangleStart(e);
                break;
            case "star":
                starStart(e);
                break;
            case "rhomboid":
                rhomboidStart(e);
                break;
        }
    }, false);
    canvas.addEventListener("mousemove", function (e) { // 鼠标移动
        switch (currentToolId) {
            case "pencil":
                pencilDraw(e);
                break;
            case "pen":
                penDraw(e);
                break;
            case "eraser":
                eraserDraw(e);
                break;
            case "straightLine":
                straightLineMove(e);
                break;
            case "circle":
                circleDraw(e);
                break;
            case "rectangle":
                rectDraw(e);
                break;
            case "triangle":
                triangleDraw(e);
                break;
            case "star":
                starDraw(e);
                break;
            case "rhomboid":
                rhomboidDraw(e);
                break;
        }
        mouseCoordinateRuler(getPoint(e));
    }, false);
    canvas.addEventListener("mouseup", function (e){ // 鼠标抬起
        switch (currentToolId) {
            case "pencil":
                pencilMouseEnd(e);
                break;
            case "pen":
                pencilMouseEnd(e);
                break;
            case "eraser":
                eraserEnd(e);
                break;
            case "straightLine":
                straightLineEnd(e);
                break;
            case "circle":
                circleEnd(e);
                break;
            case "rectangle":
                rectEnd(e);
                break;
            case "triangle":
                triangleEnd(e);
                break;
            case "star":
                starEnd(e);
                break;
            case "rhomboid":
                rhomboidEnd(e);
                break;
        }
    }, false);
    canvas.addEventListener("mouseleave", function (e){ // 鼠标离开画布
        switch (currentToolId){
            case "pencil":
                pencilMouseEnd(e);
                break;
            case "pen":
                pencilMouseEnd(e);
                break;
            case "eraser":
                eraserEnd(e);
                break;
            case "straightLine":
                straightLineEnd(e);
                break;
            case "circle":
                circleEnd(e);
                break;
            case "rectangle":
                rectEnd(e);
                break;
            case "triangle":
                triangleEnd(e);
                break;
            case "star":
                starEnd(e);
                break;
            case "rhomboid":
                rhomboidCancel(false, e);
                break;
        }
        $("#coordinateHintBox").hide();
        coordCanvas.height = coordCanvas.height;
    }, false);
    document.getElementById("clearBtn").addEventListener("click", function (){
        canvas.height = canvas.height;
        canvasAllOps = [];
        ctx.lineWidth = currentLineWidth.width;
        ctx.strokeStyle = currentColor.value;
    }, false);

    // 缩放按钮组件
    document.getElementById("zoomIn").addEventListener("mousemove", function (){
        document.getElementById("zoomIn").src = "../images/zoomIn_select.png";
    }, false);
    document.getElementById("zoomIn").addEventListener("mouseleave", function (){
        document.getElementById("zoomIn").src = "../images/zoomIn.png";
    }, false);
    document.getElementById("zoomIn").addEventListener("click", function (){
        setCanvasScaleRate(true);
    }, false);

    document.getElementById("zoomOut").addEventListener("mousemove", function (){
        document.getElementById("zoomOut").src = "../images/zoomOut_select.png";
    }, false);
    document.getElementById("zoomOut").addEventListener("mouseleave", function (){
        document.getElementById("zoomOut").src = "../images/zoomOut.png";
    }, false);
    document.getElementById("zoomOut").addEventListener("click", function (){
        setCanvasScaleRate(false);
    }, false);
    setRateText(scaleRate);

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
function selectLineTypeBox(isHide, left, top) {
    $("#lineTypeSelectBox").css("left",left+"px");
    $("#lineTypeSelectBox").css("top",top+"px");
    if(isHide){ // 隐藏
        if(!lineTypeBox) return;
        $("#lineTypeSelectBox").hide();
        lineTypeBox = false;
    }else{ // 显示
        if(lineTypeBox) return;
        $("#lineTypeSelectBox").show();
        lineTypeBox = true;
        // console.log("show");
    }
}

$(document).ready(function(){
    selectEraserBox(true);
    $("#lineTypeSelectBox").hide();
    $("#coordinateHintBox").hide();

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

    $("#formulaConfirmBtn").click(function (){
        let formula = $("#formulaInput").val();
        let startX = $("#startXInput").val();
        let endX = $("#endXInput").val();
        formula = formula.replace(/\s*/g,"");
        if(escape(formula).indexOf("%u") >= 0){
            alert("请勿输入包含中文字符的公式！");
            return;
        }
        if(formula.indexOf("{") >= 0 || formula.indexOf("}") >= 0){
            alert("请使用圆括号代替花括号！");
            return;
        }
        if(formula.indexOf("[") >= 0 || formula.indexOf("]") >= 0){
            alert("请使用圆括号代替方括号！");
            return;
        }
        try{
            startX = Number(startX);
            endX = Number(endX);
        }catch (e){
            alert("x轴范围处请勿输入其它字符！");
        }
        parseNormalFormula(formula, startX, endX, 0.02);
    })
});

function parseNormalFormula(formula = "sin(x)+cos(x)", startX = -10, endX = 10, sep = 0.02){
    let formulaSplit = execMathExpress(formula);
    if(checkFormulaCharacter(formulaSplit)){
        let expressStr = evalMathExpress(formulaSplit).join("");
        try {
            drawFormula(expressStr, startX, endX, sep);
            canvasAllOps.push({
                type: "function",
                scaleRate: scaleRate,
                lineWidth: ctx.lineWidth,
                color: currentColor,
                lineStyle: currentLineStyle,
                expressStr: expressStr,
                startX: startX,
                endX: endX,
                sep: sep
            });
        }
        catch (e) {
            console.log(e);
            alert("输入公式存在格式错误，请检查拼写!");
        }
    }
    else alert("输入公式存在不可解析的字符或不支持的初等函数，请检查拼写格式！");
}

function drawFormula(expressStr, startX, endX, sep) {
    let x = startX;
    let startPoint = {x: x, y: eval(expressStr)};
    let axisPoint = startPoint;
    for(x = startX+sep; x < endX; x+=sep) {
        axisPoint = {x: x, y: eval(expressStr)};
        drawLine(axis2PageCoordinate(startPoint), axis2PageCoordinate(axisPoint));
        startPoint = axisPoint;
    }
    drawLine(axis2PageCoordinate(axisPoint), axis2PageCoordinate({x: endX, y: eval(expressStr)}));
}

function setRateText(scaleRate){
    $("#rateText").text((1/scaleRate.x).toFixed(2));
    // $("#rateY").text(scaleRate.y.toFixed(2));
}
function setCanvasScaleRate(isZoomIn){
    let lastScaleRate = scaleRate;
    if(isZoomIn){ //放大
        if(scaleRate.y > 0.25) {scaleRate.x -= 0.25; scaleRate.y -= 0.25;}
        else{alert("已达最大缩放比例！");}
    }else{ // 缩小
        if(scaleRate.x < 3) {scaleRate.x += 0.25; scaleRate.y += 0.25;}
        else{alert("已达最小缩放比例！");}
    }
    backCanvas.height = backCanvas.height;
    canvas.height = canvas.height;

    drawCoordinateAxis();
    drawCoordinateScale();
    reDrawCanvas();

    setRateText(scaleRate);
}
function updateCanvasCenter(offSet) {
    canvasCenter.x = canvasWidth/2 + offSet.x;
    canvasCenter.y = canvasHeight/2 + offSet.y;
}
function canvasPointConvert(point) {
    return {
        x: canvasCenter.x + (point.x - canvasCenter.x) / scaleRate.x,
        y: canvasCenter.y + (point.y - canvasCenter.y) / scaleRate.y
    };
}
function canvasPoint2BasePoint(point) {
    return{
        x: canvasCenter.x + (point.x - canvasCenter.x) * scaleRate.x,
        y: canvasCenter.y + (point.y - canvasCenter.y) * scaleRate.y
    }
}
