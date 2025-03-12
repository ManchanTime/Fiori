"use strict"
let i1 = 10;
var i2 = 20;
const i3 = 30;
var iMyVariable = 12;
let item1 = 13;
iMyVariable = 12;
let str = "\"Hello World\""

let con = [1, 2, 3, 4, 5];
let pr = con.join(" + ");
console.log(pr);

console.log(str);

var obj = {
    'key1' : 'val1',
    'key2' : 'val2'
}   // key1 -> val1, key2 -> val2 이거든?
// obj[key1] 일케 호출하면 val1이 나오는거야

for(var sKey in obj) {   // 이거는 obj에 있는 key값(key1, key2)를 순차적으로 호출해서 sKey 값에 넣어주는거
    console.log(obj[sKey]); // sKey값에 해당하는 값(val1, val2)같은 값을 출력하는거거 
}

for(let i of con) {
    console.log(i);
}
// for(let i = 0; i < 10; i++) {
//     console.log(i);
// }