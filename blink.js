import "include/windows.inc";
import "include/wke.inc";
import {
    GetMessageW,
    TranslateMessage,
    DispatchMessageW,
    GetSystemMetrics,
    WaitMessage,
    PostQuitMessage,
    SetClassLongPtrW,
    SetClassLongW,
    LoadIconW,
    MessageBoxW,
} from "user32.dll";
import { GetModuleHandleW } from "kernel32.dll";
import { SetProcessDpiAwareness } from 'shcore.dll';
import {
    wkeInitializeEx,
    wkeCreateWebWindow,
    wkeOnWindowClosing,
    wkeDestroyWebWindow,
    wkeShowWindow,
    wkeSetZoomFactor,
    wkeMoveToCenter,
    wkeSetWindowTitle,
    wkeOnLoadingFinish,
    wkeGetTitle,
    wkeLoadURL,
    wkeSetTransparent,
    wkeLoadHTML,
    wkeGetHostHWND,
    wkeSetViewSettings,
    wkeNetGetFavicon,
    wkeRunJS,
    wkeGetWindowHandle,
    wkeOnDidCreateScriptContext,
} from cdecl.utf8`miniblink_4949_x32.dll`;
import { addr } from "yueji";
var wcount = 0;
function createWindow(load, data) {
    wcount++;
    function quit() {
        wcount--;
        wkeDestroyWebWindow(w);
        if (!wcount) PostQuitMessage(null);
    }
    function onload() {
        var t = wkeGetTitle(w);
        wkeSetWindowTitle(w, t);
        wkeSetTransparent(w, false);
    }
    wkeInitializeEx(null);
    var w = wkeCreateWebWindow(WKE_WINDOW_TYPE_POPUP, null, 0, 0, w_, h_);
    var settings = new wkeViewSettings({ bgColor: 0x00333333 });
    wkeSetViewSettings(w, settings);
    wkeSetZoomFactor(w, factor);
    wkeMoveToCenter(w);
    wkeSetWindowTitle(w, `正在加载...`);
    wkeOnWindowClosing(w, quit, null);
    wkeOnLoadingFinish(w, onload, null);
    wkeSetTransparent(w, true);

    load(w, data);
    var hWnd = wkeGetHostHWND(w);
    var h = GetModuleHandleW(null);
    var icon = LoadIconW(h, 0x1000);
    if (icon) {
        SetClassLongW(hWnd, GCLP_HICON, icon);
        SetClassLongW(hWnd, GCLP_HICONSM, icon);
    }
    wkeShowWindow(w, SW_SHOWNORMAL);
    return w;
}
var x = GetSystemMetrics(SM_CXSCREEN);
var y = GetSystemMetrics(SM_CYSCREEN);
SetProcessDpiAwareness(1);
var x1 = GetSystemMetrics(SM_CXSCREEN);
var y1 = GetSystemMetrics(SM_CYSCREEN);
var w_ = 860 * x1 / x | 0;
var h_ = 600 * y1 / y | 0;
var factor = x1 / x;
createWindow(wkeLoadHTML, D`./俄罗斯方块.html`);
// createWindow(wkeLoadURL, `http://localhost`);
var msg = new MSG;
while (GetMessageW(msg, null, 0, 0)) {
    TranslateMessage(msg);
    DispatchMessageW(msg);
}
