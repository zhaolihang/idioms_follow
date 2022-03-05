import * as fs from 'fs-extra';
import * as _ from 'lodash';

class Idiom {
    word: string;
    pinyin: string;
    meaning: string;

    public setData(obj) {
        if (obj) {
            this.word = obj.word;
            this.pinyin = obj.pinyin;
            this.meaning = obj.meaning;
        }
    }
}

interface IdiomMap {
    [key: string]: Idiom[]
}

let log = console.log;
log("start-----------------");

function Txt2Json() {
    let idioms: Idiom[] = [];
    let idiomsText = fs.readFileSync('idioms.txt').toString();
    let lines = idiomsText.split('\n');

    for (const line of lines) {
        let arr = line.split('\t');
        if (arr == null) {
            log(`arr == null ,${line}`);
        }
        if (arr.length != 3) {
            log(`arr.length ,${arr.length} ${line}`);
        }
        if (arr.length == 4) {
            let newStr = arr[2].toString() + arr[3].toString();
            arr[2] = newStr;
            arr.pop();
        }
        if (arr != null && arr.length == 3) {
            let word = arr[0];
            let pinyin = arr[1];
            let meaning = arr[2];
            let idiom = new Idiom();
            idiom.word = word;
            idiom.pinyin = pinyin;
            idiom.meaning = meaning;
            idioms.push(idiom);
        }
    }

    let idiomsJson = JSON.stringify(idioms);
    fs.writeFileSync('idioms.json', idiomsJson);
}


function ReadFromJson() {
    let jsonStr = fs.readFileSync('idioms.json').toString();
    var jsonObjs = JSON.parse(jsonStr) as Idiom[];

    let idioms: Idiom[] = [];
    for (const jsonObj of jsonObjs) {
        let idiom = new Idiom();
        idiom.setData(jsonObj);
        idioms.push(idiom);
    }
    return idioms;
}

function getStartPinyin(pinyin: string) {
    if (pinyin) {
        let pinyins = pinyin.split(`'`);
        if (pinyins != null && pinyins.length > 0) {
            return pinyins[0];
        }
    }
    return null;
}
function ClassByStartPinyin(idioms: Idiom[]) {
    let kv: IdiomMap = {};
    for (const idiom of idioms) {
        let startPinyin = getStartPinyin(idiom.pinyin);
        if (startPinyin) {
            if (!kv[startPinyin]) {
                kv[startPinyin] = [];
            }
            kv[startPinyin].push(idiom);
        }
    }
    return kv;
}

function ShuffleIdioms(kv: IdiomMap) {
    for (const key in kv) {
        _.shuffle(kv[key]);
    }
}

function SearchByStartPinyin(kv: IdiomMap, search: string) {
    if (kv[search]) {
        return kv[search];
    }
    log("no key = " + search);
    return [];
}

function FilterResultArr(arr: Idiom[]) {
    let result: Idiom[] = [];
    for (const item of arr) {
        if (item.word.length == 4) {
            result.push(item);
        }
    }
    return result;
}

function PrintResult(arr: Idiom[]) {
    if (arr && arr.length > 0) {
        let itemCount = 20;
        let allStr = "";
        let item = "";
        for (let index = 0; index < arr.length; index++) {
            if (index != 0 && (index % itemCount == 0)) {
                allStr = allStr + item + "\n";
                item = "";
            }
            const element = arr[index];
            item = item + "  " + element.word;
        }
        if (item) {
            allStr = allStr + item + "\n";
        }
        return allStr;
    }
    return "无结果~~";
}


let idioms = ReadFromJson();
let idiomsByPinyin = ClassByStartPinyin(idioms);
// ShuffleIdioms(idiomsByPinyin);

function IdiomsFollow(search: string) {
    search = search.trimEnd();
    let resultArr = SearchByStartPinyin(idiomsByPinyin, search);
    resultArr = FilterResultArr(resultArr);
    let result = PrintResult(resultArr);
    log(result);
    return result;
}

process.stdin.on('readable', () => {
    let chunk: string;
    // Use a loop to make sure we read all available data. 
    while ((chunk = process.stdin.read()) !== null) {
        chunk = chunk.toString();
        // process.stdout.write(`data:${chunk}`);
        IdiomsFollow(chunk);
    }
});

log("end-----------------");