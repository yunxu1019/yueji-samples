import { MessageBoxW } from "user32.dll";
var utf8str = '你好utf16';
MessageBoxW(null, "你好utf8", utf8str, 0);