
function execMathExpress(mathExpressStr) {
    let mathExpressStr2Lower = mathExpressStr.toLowerCase();
    let splitDigit = digitSplit(mathExpressStr2Lower);
    console.log(splitDigit);
    let splitOperator = operatorSplit(splitDigit);
    console.log(splitOperator);
    let splitFun = functionSplit(splitOperator);
    console.log(splitFun);
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
        // else{
        //
        // }
    }
    // for(let i = 0; i < mathExpressSplit.length; i++){
    //     if(mathExpressSplit[i].type === "operator"){
    //         if(mathExpressSplit[i].value === "(") mathExpressSplit[i].type = ""
    //     }
    // }
    return mathExpressExtracts;
}

// 匹配特殊函数
function functionSplit(mathExpressSplit) {
    const functionList = ["sin", "cos", "tan", "ln", "lg", "log2", "sqrt"];
    let mathExpressExtracts = [];
    for(let i = 0; i < mathExpressSplit.length; i++) {
        let component = mathExpressSplit[i];
        if (component.type === "number") mathExpressExtracts.push(component);
        else if (component.type === "operator") mathExpressExtracts.push(component);
        else if(component.type === "string"){
            let functions = [];
            let sptr = 0;

            while(sptr < component.value.length){
                let index = 0;
                let flag = false;
                let str = "";
                if(sptr + 4 < component.value.length) str = component.value.slice(sptr, sptr + 4);
                else str = component.value.slice(sptr);

                for(let i = 0; i < functionList.length; i++){
                    index = str.indexOf(functionList[i]);
                    if(index >= 0){
                        flag = true;
                        functions.push({
                            index: index + sptr,
                            fun: functionList[i]
                        });
                        sptr += index + functionList[i].length;
                        console.log("find", functionList[i]);
                        break;
                    }
                }
                if(!flag) sptr += 1;
            }
            console.log(functions);
            if(functions.length === 0) mathExpressExtracts.push(component);
            else{
                let startIndex = 0;
                for(let i = 0; i < functions.length; i++){
                    let thisIndex = functions[i].index;
                    if(thisIndex !== startIndex) {
                        switch (functions[i].fun) {
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
                            case "log2":{
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
                    }
                }
            }
        }
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