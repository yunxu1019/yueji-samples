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
import { GetModuleHandleW, ExitProcess } from "kernel32.dll";
import { SetProcessDpiAwareness } from 'shcore.dll';
import {
    mbInit,
    mbCreateWebWindow,
    mbOnDestroy,
    mbOnClose,
    mbDestroyWebView,
    mbShowWindow,
    mbSetZoomFactor,
    mbMoveToCenter,
    mbSetWindowTitle,
    mbOnLoadingFinish,
    mbGetTitle,
    mbLoadURL,
    mbSetTransparent,
    mbOnDocumentReady,
    mbLoadHtmlWithBaseUrl,
    mbGetHostHWND,
    mbSetViewSettings,
    mbOnTitleChanged,
    mbRunJs,
} from utf8`miniblink_4949_x32.dll`;
function createWindow(load, data, base) {
    function titleChange(w, _, t) {
        mbSetWindowTitle(w, t);
    }
    function quit(a, b, c) {
        mbDestroyWebView(w);
        PostQuitMessage(null);
    }
    mbInit(null);
    var w = mbCreateWebWindow(WKE_WINDOW_TYPE_POPUP, null, 0, 0, w_, h_);
    var settings = new wkeViewSettings({ bgColor: 0x00333333 });
    mbSetViewSettings(w, settings);
    mbSetZoomFactor(w, factor);
    mbMoveToCenter(w);
    mbSetWindowTitle(w, `正在加载...`);
    mbOnTitleChanged(w, titleChange, null);
    mbOnDestroy(w, quit, null);

    var hWnd = mbGetHostHWND(w);
    var h = GetModuleHandleW(null);
    var icon = LoadIconW(h, 0x1000);
    if (icon) {
        SetClassLongW(hWnd, GCLP_HICON, icon);
        SetClassLongW(hWnd, GCLP_HICONSM, icon);
    }
    load(w, data, base);
    mbShowWindow(w, SW_SHOWNORMAL);

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
createWindow(mbLoadHtmlWithBaseUrl, D`./俄罗斯方块.html`, "");
// createWindow(mbLoadURL, `http://efront.cc/kugou/`);
var msg = new MSG;
while (GetMessageW(msg, null, 0, 0)) {
    TranslateMessage(msg);
    DispatchMessageW(msg);
}
ExitProcess();