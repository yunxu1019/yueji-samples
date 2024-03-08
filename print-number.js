import { WriteConsoleW, GetStdHandle, AttachConsole, AllocConsole } from "Kernel32.dll";
import { number_tostr } from "yueji";
import "include/windows.inc";
if (!AttachConsole(-1/*parent*/)) AllocConsole();
var output = GetStdHandle(STD_OUTPUT_HANDLE);

function print(n) {
    debugger;
    var a = number_tostr(n);
    WriteConsoleW(output, a, a.length, 0, 0);
}
print(-1129.23);