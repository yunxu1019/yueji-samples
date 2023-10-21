import { GetStdHandle, WriteConsoleW, AttachConsole, AllocConsole, FreeConsole, ExitProcess } from "kernel32.dll";
import "include/windows.inc";
if (!AttachConsole(-1/*parent*/)) AllocConsole();
var output = GetStdHandle(STD_OUTPUT_HANDLE);
function print() {
    // invoke WriteFile,hdst,hdata,uninstallSize,addr writed,NULL
    for (var cx = 0, dx = arguments.length; cx < dx; cx++) {
        var a = arguments[cx];
        WriteConsoleW(output, a, a.length, 0, 0);
    }
}

print("你好月季，", "中文原创！")