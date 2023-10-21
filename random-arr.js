import { random, array } from "yueji";
random();
var arr = array(10);
arr[0] = random();
for (var cx = 1, dx = arr.length; cx < dx; cx++) {
    arr[cx] = random();
}