//欧几里得算法 求两个数a、b的最大公约数
function gcd(a,b){
    return b===0?a:gcd(b,a%b)
}
//分数类 分子，分母
class Fraction{
    static create(num,den=1) {
        if(num instanceof Fraction){
            return num;
        }else if(/(-?\d+)\/(\d+)/.test(num)){
            return new Fraction(parseInt(RegExp.$1),parseInt(RegExp.$2))
        }else{
            if(/\.(\d+)/.test(num)){
                num=num*Math.pow(10,RegExp.$1.length);
                den=den*Math.pow(10,RegExp.$1.length);
            }
            if(/\.(\d+)/.test(den)){
                num=num*Math.pow(10,RegExp.$1.length);
                den=den*Math.pow(10,RegExp.$1.length);
            }
            return new Fraction(num,den)
        }
    }
    constructor(num=0,den=1){
        if(den<0){
            num=-num;
            den=-den;
        }
        if(den===0){
            throw '分母不能为0'
        }
        let g=gcd(Math.abs(num),den)
        this.num=num/g;
        this.den=den/g;
    }
    //加
    add(o){
        return new Fraction(this.num*o.den+this.den*o.num,this.den*o.den)
    }
    //减
    sub(o){
        return new Fraction(this.num*o.den-this.den*o.num,this.den*o.den)
    }
    //乘
    multiply(o){
        return new Fraction(this.num*o.num,this.den*o.den);
    }
    //除
    divide(o){
        return new Fraction(this.num*o.den,this.den*o.num);
    }
    //小于
    lessThan(o){
        return this.num*o.den<this.den*o.num;
    }
    //等于
    equal(o){
        return this.num*o.den===this.den*o.num;
    }
    toString() {
        return this.num+'/'+this.den;
    }
}

//解析数学表达式
function execMathExpress(formula,obj){
    //局部变量
    const tempObj=Object.assign({
        _0:0
    },obj);
    //计算缓存
    const keyCache={};
    let index=1;

    formula=formula.replace(/ /g,'');//清理空格
    //解析数字
    formula=formula.replace(/(^|[(*+/-])(\d+\.\d+|\d+)/g,function (m,p1,p2) {
        if(keyCache[p2]){
            return p1+keyCache[p2];
        }
        const key=keyCache[p2]='_'+index++;
        tempObj[key]=Fraction.create(p2);
        return p1+key;
    })

    function getKey(p1,p2,p3) {
        const keyC=p1+p2+p3;
        if(keyCache[keyC]){
            return keyCache[keyC];
        }
        const key=keyCache[keyC]='_'+index++;
        const fA=Fraction.create(tempObj[p1])
        const fB=Fraction.create(tempObj[p3])
        if(p2==='*'){
            tempObj[key]=fA.multiply(fB);
        }else if(p2==='/'){
            tempObj[key]=fA.divide(fB);
        }else if(p2==='+'){
            tempObj[key]=fA.add(fB);
        }else if(p2==='-'){
            tempObj[key]=fA.sub(fB);
        }
        return key;
    }
    function run(s) {

        //子表达式
        if(/\(([^\(]+?)\)/.test(s)){
            s=s.replace(/\(([^\(]+?)\)/g,function (m,p1,p2) {
                return run(p1);
            })
        }
        //负号
        s=s.replace(/([*/+]|^)-(\w+)/g,function (m,p1,p2) {
            return getKey('_0','-',p2);
        })
        //返回
        if(/(^\w+$)/.test(s)){
            return RegExp.$1;
        }
        //乘法、除法、加法、减法
        const expArr=['*','/','+','-'];
        for(let i=0;i<expArr.length;i++){
            const p=expArr[i];
            const reg=new RegExp('(\\w+)['+p+'](\\w+)');
            while (reg.test(s)){
                s=s.replace(reg,function (m,p1,p2) {
                    return getKey(p1,p,p2);
                })
            }
        }
        //返回
        if(/(^\w+$)/.test(s)){
            return RegExp.$1;
        }
        return run(s);
    }
    return tempObj[run(formula)]
}
// module.exports=execMathExpress;