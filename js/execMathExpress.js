
function execMathExpress(mathExpressStr) {
    let mathExpressStr2Lower = mathExpressStr.toLowerCase();
    let splitDigit = digitSplit(mathExpressStr2Lower);
    // console.log(splitDigit);
    let splitOperator = operatorSplit(splitDigit);
    // console.log(splitOperator);
    let splitFun = functionSplit(splitOperator);
    // console.log(splitFun);
    let splitVariable = variableSplit(splitFun);
    // console.log(splitVariable);
    return splitVariable;
}

// 公式转化为逆波兰式
// function reversePolishConv(mathExpressSplit) {
//     let outPutStack = [];
//     let tempStack = [];
//
//     for(let i = 0; i < mathExpressSplit.length; i++){
//         if(mathExpressSplit[i].type === "number") tempStack.push(mathExpressSplit[i]); // 数字直接压栈
//         else if(mathExpressSplit[i].type === "")
//     }
// }

// 检查公式格式是否正确
function checkFormulaCharacter(mathExpressSplit) {
    for(let i = 0; i < mathExpressSplit.length; i++){
        if(mathExpressSplit[i].type === "string"){ // 输入公式中含有不可解析的字符
            return false;
        }
        // else if(mathExpressSplit[i].type === "function" && i < mathExpressSplit.length -1) {
        //     if (mathExpressSplit[i + 1].type !== "number" || mathExpressSplit[i + 1].type !== "number") {
        //         express += "(";
        //         addParentheses = true;
        //     }
        // }
    }
    return true;
}

// 公式执行
function evalMathExpress(mathExpressSplit) {
    let expressToAdd = [];
    let addParentheses = false;
    // let
    let addFunction = [];
    for(let i = 0; i < mathExpressSplit.length; i++){
        expressToAdd.push(mathExpressSplit[i].value);
        if(addParentheses){
            if(i < mathExpressSplit.length-1 && mathExpressSplit[i].type === "number" && mathExpressSplit[i+1].type === "variable"){}
            else {
                expressToAdd.push(")");
                addParentheses = false;
            }
        }
        if(addFunction.length > 0 && mathExpressSplit[i].type !== "function"){
            if(i < mathExpressSplit.length-1 && mathExpressSplit[i].type === "number" && mathExpressSplit[i+1].type === "variable"){}
            else {
                addFunction.forEach(function (element) {
                    expressToAdd.push(")");
                })
                addFunction = [];
            }
        }
        // else if()

        if(mathExpressSplit[i].type === "number" && i < mathExpressSplit.length -1){ // 数字后面接函数或变量，在中间插入乘号
            if(mathExpressSplit[i+1].type === "function") expressToAdd.push("*");
            else if(mathExpressSplit[i+1].type === "variable") expressToAdd.push("*");
        }
        else if(mathExpressSplit[i].type === "function" && i < mathExpressSplit.length -1){ // 函数后面接数字或变量，在函数后面加括号
            if(mathExpressSplit[i+1].type === "number") {
                expressToAdd.push("(");
                addParentheses = true;
            }
            else if(mathExpressSplit[i+1].type === "variable") {
                expressToAdd.push("(");
                addParentheses = true;
            }
            else if(mathExpressSplit[i+1].type === "function") { // 函数后面接函数
                expressToAdd.push("(");
                addFunction.push(true);
            }
        }
        else if(mathExpressSplit[i].type === "operator" && mathExpressSplit[i].value === "^"){ //处理次方符号
            expressToAdd.pop();
            let last = expressToAdd.pop();
            expressToAdd.push("Math.pow(" + last + ",");
            addParentheses = true;
        }
        else if(mathExpressSplit[i].type === "variable" && i < mathExpressSplit.length -1){
            if(mathExpressSplit[i+1].type === "function") expressToAdd.push("*");
        }
    }
    return expressToAdd;
}

// 正则匹配从字符串中提取出数字
function digitSplit(mathExpressStr){
    let regDigit = /\d+(\.\d+)?/g; //非负浮点数
    // let regNeg = /(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))/g; //负浮点数
    regDigit.lastIndex = 0;
    let digits = mathExpressStr.match(regDigit);
    let mathExpressExtracts = [];
    let startIndex = 0;
    if(digits == null) {
        mathExpressExtracts.push({
            type: "string",
            value: mathExpressStr
        });
        return mathExpressExtracts;
    }

    for(let i = 0; i < digits.length; i++){
        let thisIndex = mathExpressStr.slice(startIndex).indexOf(digits[i]) + startIndex;
        if(thisIndex !== startIndex) mathExpressExtracts.push({
            type: "string",
            value: mathExpressStr.slice(startIndex, thisIndex)
        });
        mathExpressExtracts.push({
            type: "number",
            value: Number(digits[i])
        });
        startIndex = thisIndex + digits[i].length;
    }
    if(startIndex < mathExpressStr.length) mathExpressExtracts.push({
        type: "string",
        value: mathExpressStr.slice(startIndex)
    });
    return mathExpressExtracts;
}

// 正则匹配从字符串中提取出运算符
function operatorSplit(mathExpressSplit) {
    let mathExpressExtracts = [];
    for(let i = 0; i < mathExpressSplit.length; i++){
        let component = mathExpressSplit[i];
        if(component.type === "number") mathExpressExtracts.push(component);
        else if(component.type === "string"){
            let str = component.value;
            let regOp = /[()^*/+-]/g;  // 正则匹配四则运算符号
            let opSplit = str.match(regOp);
            if(opSplit == null) mathExpressExtracts.push(component);
            else{
                let startIndex = 0;
                for(let i = 0; i < opSplit.length; i++){
                    let thisIndex = str.slice(startIndex).indexOf(opSplit[i]) + startIndex;
                    if(thisIndex !== startIndex) mathExpressExtracts.push({
                        type: "string",
                        value: str.slice(startIndex, thisIndex)
                    });
                    mathExpressExtracts.push({
                        type: "operator",
                        value: opSplit[i]
                    });
                    startIndex = thisIndex + 1;
                }
                if(startIndex < str.length) mathExpressExtracts.push({
                    type: "string",
                    value: str.slice(startIndex)
                });
            }
        }
    }
    return mathExpressExtracts;
}

// 匹配特殊函数
function functionSplit(mathExpressSplit) {
    const functionList = ["sin", "cos", "tan", "ln", "lg", "log", "sqrt"];
    let mathExpressExtracts = [];
    for(let i = 0; i < mathExpressSplit.length; i++) {
        let component = mathExpressSplit[i];
        if (component.type === "number") mathExpressExtracts.push(component);
        else if (component.type === "operator") mathExpressExtracts.push(component);
        else if(component.type === "string"){
            let functions = [];
            let sptr = 0;

            // 迭代找到所有特殊函数，保存在数组functions中
            while(sptr < component.value.length){
                let index = 0;
                let flag = false;
                let str = "";
                if(sptr + 4 < component.value.length) str = component.value.slice(sptr, sptr + 4);
                else str = component.value.slice(sptr);

                for(let j = 0; j < functionList.length; j++){
                    index = str.indexOf(functionList[j]);
                    if(index >= 0){
                        flag = true;
                        functions.push({
                            index: index + sptr,
                            fun: functionList[j]
                        });
                        sptr += index + functionList[j].length;
                        // console.log("find", functionList[j]);
                        break;
                    }
                }
                if(!flag) sptr += 1;
            }

            // 遍历functions中的所有函数，从string中分割
            if(functions.length === 0) mathExpressExtracts.push(component);
            else{
                let startIndex = 0;
                for(let j = 0; j < functions.length; j++){
                    let thisIndex = functions[j].index;
                    if(thisIndex !== startIndex) mathExpressExtracts.push({
                        type: "string",
                        value: component.value.slice(startIndex, thisIndex)
                    });
                    switch (functions[j].fun) {
                        case "sin":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.sin"
                            });
                            break;
                        }
                        case "cos":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.cos"
                            });
                            break;
                        }
                        case "tan":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.tan"
                            });
                            break;
                        }
                        case "ln":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.log"
                            });
                            break;
                        }
                        case "lg":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "log10"
                            });
                            break;
                        }
                        case "log":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.log2"
                            });
                            break;
                        }
                        case "sqrt":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: "Math.sqrt"
                            });
                            break;
                        }
                    }
                    startIndex = thisIndex + functions[j].fun.length;
                }
                if(startIndex < component.value.length) mathExpressExtracts.push({
                    type: "string",
                    value: component.value.slice(startIndex)
                });
            }
        }
    }
    return mathExpressExtracts;
}

// 匹配自变量
function variableSplit(mathExpressSplit) {
    let mathExpressExtracts = [];
    for(let i = 0; i < mathExpressSplit.length; i++) {
        let component = mathExpressSplit[i];
        if(component.type === "string"){
            let str = component.value;
            let regOp = /x/g;  // 正则匹配自变量x
            let opSplit = str.match(regOp);
            if(opSplit == null) mathExpressExtracts.push(component);
            else{
                let startIndex = 0;
                for(let i = 0; i < opSplit.length; i++){
                    let thisIndex = str.slice(startIndex).indexOf(opSplit[i]) + startIndex;
                    if(thisIndex !== startIndex) mathExpressExtracts.push({
                        type: "string",
                        value: str.slice(startIndex, thisIndex)
                    });
                    mathExpressExtracts.push({
                        type: "variable",
                        value: "x"
                    });
                    startIndex = thisIndex + 1;
                }
                if(startIndex < str.length) mathExpressExtracts.push({
                    type: "string",
                    value: str.slice(startIndex)
                });
            }
        }
        else mathExpressExtracts.push(component);
    }
    return mathExpressExtracts;
}

function expressStackConv(mathExpressStr, digits) {
    let stack = [];
    let outPut = [];
    const prioritys = {
        ")": 0,
        "(": 1,
        "^": 2,
        "*": 3,
        "/": 3,
        "+": 4,
        "-": 4
    };
    for(let digit in digits){

    }
}