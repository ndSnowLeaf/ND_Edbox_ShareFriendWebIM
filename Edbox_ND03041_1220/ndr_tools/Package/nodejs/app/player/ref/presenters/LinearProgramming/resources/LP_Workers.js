/**
 * Created by Administrator on 2017/1/11 0011.
 */
function checkCondition(condition){
    if (parseFloat(condition.a).toString() == "NaN") { return false; }
    if (parseFloat(condition.b).toString() == "NaN") { return false; }
    if (parseFloat(condition.c).toString() == "NaN") { return false; }
    if (condition.symbol.length == 0){ return false; }

    return true;
}
function isPointInSegment(p, p1, p2) {
    var cross1 =(p.y - p1.y) * (p2.x - p1.x);
    var cross2 =(p.x - p1.x) * (p2.y - p1.y);
    var cross3 = cross1-cross2;

    var crossproduct = Math.abs(cross3);
    if(crossproduct !== 0){ return false; }

    var dotproduct = (p.x-p1.x) * (p2.x-p1.x) + (p.y-p1.y)*(p2.y-p1.y);
    if(dotproduct < 0){ return false }

    var squaredlengthba = (p2.x - p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y)
    if(dotproduct > squaredlengthba){ return false; }
    return true;
}

var symbol = function(){
    var symbolStrategy = {
        getName: function (symbol) {
            if (symbol == "＞") return "greaterThan";
            else if (symbol == "≥") return "greaterThanOrEqual";
            else if (symbol == "＜") return "lessThan";
            else  return "lessThanOrEqual";
        },
        //大于
        greaterThan: function (number) {
            if (number > 0) {
                return "＞";
            }
            else {
                return "";
            }
        },
        //大于等于
        greaterThanOrEqual: function (number) {
            if (number >= 0) {
                return "≥";
            }
            else {
                return "";
            }
        },
        //小于
        lessThan: function (number) {
            if (number < 0) {
                return "＜";
            }
            else {
                return "";
            }
        },
        //小于等于
        lessThanOrEqual: function (number) {
            if (number <= 0) {
                return "≤";
            }
            else {
                return "";
            }
        }
    }
    return function (symbol, number) {
        var symbolName = symbolStrategy.getName(symbol);
        return symbolStrategy[symbolName] && symbolStrategy[symbolName](number);
    }
}()

function isPointInDottedSegment(point, conditions){
    for(var i = 0; i < conditions.length; i++) {
        var condition = conditions[i];
        if (checkCondition(condition)){
            var isDottedPoint = isPointInSegment(point, condition.points[0], condition.points[1]);
            if (isDottedPoint && condition.isDotted) {
                return true;
            }
        }
    }
    return false;
}

function getIntgerSolutions(lengthX, lengthY, intMinX, intMinY, conditions) {

    var answers = [];
    for (var i = 0; i <= lengthX; i++) {
        for (var j = 0; j <= lengthY; j++) {
            var x = intMinX + i;
            var y = intMinY + j;

            var failed = false;
            for (var k = 0; k < conditions.length; k++){
                var condition = conditions[k];
                if (!checkCondition(condition)) continue;
                var number1 = callExpressCondition(x, y, condition.a, condition.b, condition.c);
                var symbol1 = symbol(condition.symbol, number1);
                if (symbol1 !== condition.symbol) {
                    failed = true;
                    break;
                }
            }

            if (!failed)
                answers.push({x: x, y: y});
        }
    }
   return answers;
}

function excludePointInSegment(answers, conditions){
    var points = [];
    if (answers != null && answers.length > 0){
        for (var i = 0; i < answers.length; i++){
            var answer = answers[i];
            var isDottedPoint = isPointInDottedSegment(answer, conditions);
            if (isDottedPoint){
                continue;
            } else {
                points.push(answer);
            }
        }
    }
    return points;
}

function callExpressCondition (x, y, a, b, c ){
    return a * x + b * y + c;
}

onmessage = function(event){
    var data = event.data;
    var lengthX = data.lengthX, lengthY = data.lengthY, conditions = data.conditions, intMinX = data.intMinX, intMinY = data.intMinY;
    var answers = getIntgerSolutions(lengthX, lengthY, intMinX, intMinY, conditions);
    answers = excludePointInSegment(answers, conditions);
    postMessage(answers);
};

