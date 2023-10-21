import { GetModuleFileNameW, WriteConsoleW, GetStdHandle } from "kernel32.dll";
import { buffer, Utf16, dirname } from "yueji";
import "include/windows.inc";
var output = GetStdHandle(STD_OUTPUT_HANDLE);

var moduleFileName = buffer(8192);
GetModuleFileNameW(null, moduleFileName, 8192);
moduleFileName = Utf16(moduleFileName);
var folderName = dirname(moduleFileName);
WriteConsoleW(output, folderName, folderName.length, 0, 0);