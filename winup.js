import "include/windows.inc";
import { GetModuleHandleW } from "kernel32.dll";
import { RegisterClassExW, PostQuitMessage, CreateWindowExW, DefWindowProcW, ShowWindow, UpdateWindow, GetMessageW, TranslateMessage, DispatchMessageW, LoadCursorW, LoadIconW } from "user32.dll";
var eventsHandle = function (hWnd, uMsg, wParam, lParam) {
    switch (uMsg) {
        case WM_CREATE:
            break;
        case WM_PAINT:
            break;
        case WM_CLOSE:
            PostQuitMessage(null);
            break;
        default:
            return DefWindowProcW(hWnd, uMsg, wParam, lParam);
    }
    return 0;
};
function winMain() {
    var className = L`盖亚能量炮`;
    var h = GetModuleHandleW(null);
    var icon = LoadIconW(h, 0x1000);
    var cursor = LoadCursorW(null, IDC_ARROW);
    var wClass = new WNDCLASSEXW({
        cbSize: 48,
        style: CS_BYTEALIGNWINDOW,
        hInstance: h,
        lpfnWndProc: eventsHandle,
        cbClsExtra: null,
        cbWndExtra: null,
        hbrBackground: COLOR_BACKGROUND,
        hIcon: icon,
        hIconSm: icon,
        hCursor: cursor,
        lpszClassName: className,
        lpszMenuName: null,
    });
    RegisterClassExW(wClass);
    var hwnd = CreateWindowExW(WS_EX_CLIENTEDGE, className, "一剑隔世", WS_POPUP | WS_OVERLAPPEDWINDOW | WS_SIZEBOX, 0, 0, 480, 360, null, null, h, null);
    if (!hwnd) return;
    ShowWindow(hwnd, SW_SHOWNORMAL);
    var msg = new MSG;
    while (GetMessageW(msg, null, 0, 0)) {
        TranslateMessage(msg);
        DispatchMessageW(msg);
    }
    return msg.wParam;
}
winMain();