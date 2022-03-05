"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var _ = require("lodash");
var Idiom = /** @class */ (function () {
    function Idiom() {
    }
    Idiom.prototype.setData = function (obj) {
        if (obj) {
            this.word = obj.word;
            this.pinyin = obj.pinyin;
            this.meaning = obj.meaning;
        }
    };
    return Idiom;
}());
var log = console.log;
log("start-----------------");
function Txt2Json() {
    var idioms = [];
    var idiomsText = fs.readFileSync('idioms.txt').toString();
    var lines = idiomsText.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var arr = line.split('\t');
        if (arr == null) {
            log("arr == null ," + line);
        }
        if (arr.length != 3) {
            log("arr.length ," + arr.length + " " + line);
        }
        if (arr.length == 4) {
            var newStr = arr[2].toString() + arr[3].toString();
            arr[2] = newStr;
            arr.pop();
        }
        if (arr != null && arr.length == 3) {
            var word = arr[0];
            var pinyin = arr[1];
            var meaning = arr[2];
            var idiom = new Idiom();
            idiom.word = word;
            idiom.pinyin = pinyin;
            idiom.meaning = meaning;
            idioms.push(idiom);
        }
    }
    var idiomsJson = JSON.stringify(idioms);
    fs.writeFileSync('idioms.json', idiomsJson);
}
function ReadFromJson() {
    var jsonStr = fs.readFileSync('idioms.json').toString();
    var jsonObjs = JSON.parse(jsonStr);
    var idioms = [];
    for (var _i = 0, jsonObjs_1 = jsonObjs; _i < jsonObjs_1.length; _i++) {
        var jsonObj = jsonObjs_1[_i];
        var idiom = new Idiom();
        idiom.setData(jsonObj);
        idioms.push(idiom);
    }
    return idioms;
}
function getStartPinyin(pinyin) {
    if (pinyin) {
        var pinyins = pinyin.split("'");
        if (pinyins != null && pinyins.length > 0) {
            return pinyins[0];
        }
    }
    return null;
}
function ClassByStartPinyin(idioms) {
    var kv = {};
    for (var _i = 0, idioms_1 = idioms; _i < idioms_1.length; _i++) {
        var idiom = idioms_1[_i];
        var startPinyin = getStartPinyin(idiom.pinyin);
        if (startPinyin) {
            if (!kv[startPinyin]) {
                kv[startPinyin] = [];
            }
            kv[startPinyin].push(idiom);
        }
    }
    return kv;
}
function ShuffleIdioms(kv) {
    for (var key in kv) {
        _.shuffle(kv[key]);
    }
}
function SearchByStartPinyin(kv, search) {
    if (kv[search]) {
        return kv[search];
    }
    log("no key = " + search);
    return [];
}
function FilterResultArr(arr) {
    var result = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        if (item.word.length == 4) {
            result.push(item);
        }
    }
    return result;
}
function PrintResult(arr) {
    if (arr && arr.length > 0) {
        var itemCount = 20;
        var allStr = "";
        var item = "";
        for (var index = 0; index < arr.length; index++) {
            if (index != 0 && (index % itemCount == 0)) {
                allStr = allStr + item + "\n";
                item = "";
            }
            var element = arr[index];
            item = item + "  " + element.word;
        }
        if (item) {
            allStr = allStr + item + "\n";
        }
        return allStr;
    }
    return "无结果~~";
}
var idioms = ReadFromJson();
var idiomsByPinyin = ClassByStartPinyin(idioms);
// ShuffleIdioms(idiomsByPinyin);
function IdiomsFollow(search) {
    search = search.trimEnd();
    var resultArr = SearchByStartPinyin(idiomsByPinyin, search);
    resultArr = FilterResultArr(resultArr);
    var result = PrintResult(resultArr);
    log(result);
    return result;
}
process.stdin.on('readable', function () {
    var chunk;
    // Use a loop to make sure we read all available data. 
    while ((chunk = process.stdin.read()) !== null) {
        chunk = chunk.toString();
        // process.stdout.write(`data:${chunk}`);
        IdiomsFollow(chunk);
    }
});
log("end-----------------");
//# sourceMappingURL=index.js.map