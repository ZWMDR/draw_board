
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
                        console.log("find", functionList[j]);
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
                                value: function (x) {
                                    return Math.sin(x);
                                }
                            });
                            break;
                        }
                        case "cos":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.cos(x);
                                }
                            });
                            break;
                        }
                        case "tan":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.tan(x);
                                }
                            });
                            break;
                        }
                        case "ln":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.log(x);
                                }
                            });
                            break;
                        }
                        case "lg":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.log10(x);
                                }
                            });
                            break;
                        }
                        case "log":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.log2(x);
                                }
                            });
                            break;
                        }
                        case "sqrt":{
                            mathExpressExtracts.push({
                                type: "function",
                                value: function (x) {
                                    return Math.sqrt(x);
                                }
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
            let regOp = /x/g;  // 正则匹配四则运算符号
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
    }
    for(let digit in digits){

    }
}