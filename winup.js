import "include/windows.inc";
import "./winup.inc";
import { GetModuleHandleW } from "Kernel32.dll";
import {
    RegisterClassExW,
    GetSystemMetrics,
    PostQuitMessage,
    CreateWindowExW,
    DefWindowProcW,
    ShowWindow,
    UpdateWindow,
    GetMessageW,
    TranslateMessage,
    DispatchMessageW,
    LoadCursorW,
    GetCursorPos,
    GetWindowRect,
    GetDC,
    ReleaseDC,
    SendMessageW,
    BeginPaint,
    EndPaint,
    LoadIconW,
    SetTimer,
    KillTimer,
    GetWindowLongW,
    SetWindowLongW,
    MoveWindow,
    DestroyWindow,
    SetLayeredWindowAttributes
} from "User32.dll";
import { SetProcessDpiAwareness } from 'Shcore.dll';
import {
    CreateCompatibleDC,
    BitBlt,
    SelectObject,
    CreateCompatibleBitmap,
    DeleteDC
} from "Gdi32.dll";
import {
    GdipAddPathPolygon,
    GdipSetPathFillMode,
    GdipIsVisiblePathPoint,
    GdipReleaseDC,
    GdipDeleteGraphics,
    GdiplusStartup,
    GdiplusShutdown,
    GdipCreateFromHDC,
    GdipSetTextRenderingHint,
    GdipSetSmoothingMode,
    GdipCreateMatrix,
    GdipScaleMatrix,
    GdipSetWorldTransform,
    GdipDeleteMatrix,
    GdipCreateSolidFill,
    GdipFillPath,
    GdipDeleteBrush,
    GdipCreatePen1,
    GdipDeletePen,
    GdipDrawPath,
    GdipCreateFontFamilyFromName,
    GdipDeleteFontFamily,
    GdipCreateFont,
    GdipDeleteFont,
    GdipCreateStringFormat,
    GdipDeleteStringFormat,
    GdipSetStringFormatTrimming,
    GdipCreatePath,
    GdipDeletePath,
    GdipResetPath,
    GdipMeasureString,
    GdipAddPathString,
    GdipWindingModeOutline,
} from "GdiPlus.dll";
import { go, pause, addr, buffer, mfree, jsfree, dump } from 'yueji';
var factor = 1.0;
var w_rect = new SRECT(0, 0, 480, 360);
var closeBtn = new EFRONT_BUTTON(0, 0, 0, 0, 0);
var ground = new EFRONT_BUTTON(0, 0, 0, 0, 0);
var mouseActived = false, mouseMoved = false;
var mousePosition = new POINT(0, 0);
var cursor_top = 0.0;
var cursor_left = 0.0;
var currentHover = null;
var mouseDrag = function (hWnd) {
    var p = new POINT;
    GetCursorPos(p);
    if (!mouseMoved) {
        var deltax = p.x - mousePosition.x;
        var deltay = p.y - mousePosition.y;
        if (deltax * deltax + deltay * deltay < factor * 3) {
            return;
        }
        mouseMoved = true;
    }
    w_rect.x = p.x - mousePosition.x + w_rect.x | 0;
    w_rect.y = p.y - mousePosition.y + w_rect.y | 0;
    MoveWindow(hWnd, w_rect.x, w_rect.y, w_rect.w, w_rect.h, true);// win7上只能用true
    mousePosition.x = p.x;
    mousePosition.y = p.y;
    mfree(p);
}

var updateCursor = function (hWnd) {
    var p = new POINT;
    var rect = new RECT;
    GetCursorPos(p);
    GetWindowRect(hWnd, rect);
    cursor_left = (p.x - rect.left) / factor;
    cursor_top = (p.y - rect.top) / factor;
    mfree(p);
    mfree(rect);
}
var mouseMove = function (hWnd) {
    if (mouseActived) {
        mouseDrag(hWnd);
    }
};
var mouseUp = function (hWnd) {
    mouseActived = false;
    if (mouseMoved) return;
    if (!currentHover) return;
    switch (currentHover) {
        case closeBtn.back:
            return SendMessageW(hWnd, WM_CLOSE, null, null);
    }

}
var mouseDown = function (hWnd) {
    mouseActived = true;
    mouseMoved = false;
    var r = new RECT;
    GetWindowRect(hWnd, r);
    GetCursorPos(mousePosition);
    w_rect.x = r.left;
    w_rect.y = r.top;
    mfree(r);
}
var eventsHandle = function (hWnd, uMsg, wParam, lParam) {
    switch (uMsg) {
        case WM_CREATE:
            SetTimer(hWnd, 1, 32, null);
            var tmp = GetWindowLongW(hWnd, GWL_EXSTYLE);
            SetWindowLongW(hWnd, GWL_EXSTYLE, tmp);
            SetLayeredWindowAttributes(hWnd, 0, 255, 2);
            return 0;
        case WM_PAINT:
            var stPs = new PAINTSTRUCT;
            BeginPaint(hWnd, stPs);
            EndPaint(hWnd, stPs);
            return 0;
        case WM_LBUTTONDOWN:
            mouseDown(hWnd);
            return uMsg;
        case WM_LBUTTONUP:
            mouseUp(hWnd);
            return uMsg;
        case WM_MOUSELEAVE:
        case WM_MOUSEMOVE:
            mouseMove(hWnd);
            return uMsg;
        case WM_CLOSE:
            KillTimer(hWnd, 1);
            DestroyWindow(hWnd);
            PostQuitMessage(null);
            break;
        case WM_TIMER:
            drawFrame(hWnd);
            UpdateWindow(hWnd);
            break;
        default:
            return DefWindowProcW(hWnd, uMsg, wParam, lParam);
    }
    return 0;
};
function setFactor() {
    if (!GetSystemMetrics) return;
    var w = GetSystemMetrics(SM_CXSCREEN);
    var h = GetSystemMetrics(SM_CYSCREEN);
    if (SetProcessDpiAwareness) SetProcessDpiAwareness(1);
    var w1 = GetSystemMetrics(SM_CXSCREEN);
    var h1 = GetSystemMetrics(SM_CYSCREEN);
    factor = w1 / w;
    var width = w_rect.w = w_rect.w * w1 / w | 0;
    var height = w_rect.h = w_rect.h * h1 / h | 0;
    w_rect.x = w1 - width >> 1;
    w_rect.y = h1 - height >> 1;
}
function drawText(gp, color, text, fontSize, rect, fFamily, rectref) {
    var font = null, brush = null, family = null, x = 0, y = 0, path = null;
    var format = 0;
    fontSize *= 1;
    GdipCreateFontFamilyFromName(fFamily, null, addr(family));
    GdipCreateFont(family, fontSize, 0, 0, addr(font));
    // debugger;
    GdipCreateStringFormat(0x00007400, 0, addr(format));
    GdipSetStringFormatTrimming(format, 5);
    GdipCreateSolidFill(color | 0, addr(brush));
    if (rectref) {
        GdipMeasureString(gp, text, text.length, font, rect, format, rectref, addr(x), addr(y));
    }
    GdipCreatePath(0, addr(path));
    GdipResetPath(path);
    GdipAddPathString(path, text, text.length, family, 0, fontSize, rect, 0);
    GdipWindingModeOutline(path, 0, 0);
    GdipFillPath(gp, brush, path);
    GdipDeleteFontFamily(family);
    GdipDeletePath(path);
    GdipDeleteFont(font);
    GdipDeleteBrush(brush);
    GdipDeleteStringFormat(format);
}
function drawButton(gp, shape, fillcolor, bordercolor, outline, outcolor) {
    EFRONT_BUTTON: shape;// 指定 shape 的类型为 EFRONT_BUTTON
    var pen = 0, brush = 0;
    if (shape.back) {
        GdipCreateSolidFill(fillcolor | 0, addr(brush));
        GdipFillPath(gp, brush, shape.back);
        GdipDeleteBrush(brush);
    }
    if (shape.text) {
        drawText(gp, bordercolor | 0, shape.text, shape.clip, shape.rect, "宋体", 0);
    }
    else if (shape.clip) {
        GdipCreateSolidFill(bordercolor | 0, addr(brush));
        GdipFillPath(gp, brush, shape.clip);
        GdipDeleteBrush(brush);
    }
    if (outline) {
        GdipCreatePen1(outcolor | 0, outline, 0, addr(pen));
        GdipDrawPath(gp, pen, shape.back);
        GdipDeletePen(pen);
    }
}
function createPath(dots) {
    var path = null;
    GdipCreatePath(0, addr(path));
    GdipAddPathPolygon(path, dots, dots.length >> 1);
    GdipSetPathFillMode(path, 1);
    return path;
}
function drawClose(gp) {
    if (currentHover === closeBtn.back) {
        if (mouseActived) {
            drawButton(gp, closeBtn, 0xff882200, 0xffffffff, 0, 0);
        }
        else {
            drawButton(gp, closeBtn, 0xffcc4400, 0xffffffff, 0, 0);
        }
    }
    else {
        drawButton(gp, closeBtn, 0xff323634, 0xff336622, 1, 0xff666666);
    }
    return;
}
function drawLogo() { }
function drawSetup() { }
function drawTitle() { }
function createShapes(gp) {
    var CloseShape = M(1.0, 10, -1)`480, 30, 480, 0, 420, 0, 420.15, 2.995, 420.598, 5.96, 421.34, 8.866, 422.368, 11.683, 423.673, 14.383, 425.24, 16.939, 427.055, 19.327,429.099, 21.521, 431.352, 23.5, 433.791, 25.244, 436.392, 26.736, 439.129, 27.961, 441.975, 28.907, 444.901, 29.563, 447.878, 29.925`;
    var CrossShape = M(0.012, 454, 8)`1024, 80.441, 943.559, 0, 512, 431.559, 80.441, 0, 0, 80.441, 431.559, 512, 0, 943.559, 80.441, 1024, 512, 592.441, 943.559, 1024, 1024, 943.559, 592.441, 512, 1024, 80.441`;
    closeBtn.clip = createPath(CrossShape);
    closeBtn.back = createPath(CloseShape);
    ground.back = createPath(M`-1,-1,483,-1,483,363,-1,363,-1,-1`);
}
function drawShapes(gp) {
    drawButton(gp, ground, 0xff323634, 0xfff2f6f4, 0, 0);
    drawClose(gp);
    drawText(gp, 0xff629436, "一剑隔世", 42, M`18,20,370,50`, "仿宋", 0);
}
function deleteShapes() {
    GdipDeletePath(closeBtn.clip);
    GdipDeletePath(closeBtn.back);
    GdipDeletePath(ground.back);
}
var bitmap;
function drawFrame(hWnd) {
    var gp = 0, matrix = 0;
    var dc = GetDC(hWnd);
    var tmpDc = CreateCompatibleDC(dc);
    if (!bitmap) {
        bitmap = CreateCompatibleBitmap(dc, w_rect.w, w_rect.h)
        BitBlt(tmpDc, 0, 0, w_rect.w, w_rect.h, dc, 0, 0, SRCCOPY);
    }
    SelectObject(tmpDc, bitmap);
    var ratio = factor;
    GdipCreateFromHDC(tmpDc, addr(gp));
    GdipSetTextRenderingHint(gp, 3);
    GdipSetSmoothingMode(gp, 4);
    if (SetProcessDpiAwareness) {
        GdipCreateMatrix(addr(matrix));
        GdipScaleMatrix(matrix, ratio, ratio, 1);
        GdipSetWorldTransform(gp, matrix);
        GdipDeleteMatrix(matrix);
    }
    if (!closeBtn.clip) {
        createShapes();
    }
    updateCursor(hWnd);
    var isCursorIn = function (shape) {
        var isIn = 0;
        GdipIsVisiblePathPoint(shape, cursor_left, cursor_top, gp, addr(isIn));
        return isIn;
    }
    if (isCursorIn(closeBtn.back)) {
        currentHover = closeBtn.back;
    }
    else {
        currentHover = null;
    }
    drawShapes(gp);
    BitBlt(dc, 0, 0, w_rect.w, w_rect.h, tmpDc, 0, 0, SRCCOPY);
    GdipReleaseDC(gp, tmpDc);
    GdipDeleteGraphics(gp);
    ReleaseDC(hWnd, dc);
    DeleteDC(tmpDc);
    return 0;
}
function winMain() {
    var h = GetModuleHandleW(null);
    var icon = LoadIconW(h, 0x1000);
    var cursor = LoadCursorW(null, IDC_ARROW);
    var className = L`盖亚能量炮`;
    var wClass = new WNDCLASSEXW({
        cbSize: 48,
        style: CS_BYTEALIGNWINDOW,
        hInstance: h,
        lpfnWndProc: eventsHandle,
        cbClsExtra: null,
        cbWndExtra: null,
        hbrBackground: null,
        hIcon: icon,
        hIconSm: icon,
        hCursor: cursor,
        lpszClassName: className,
        lpszMenuName: null,
    });
    RegisterClassExW(wClass);
    var hWnd = CreateWindowExW(0, className, "一剑隔世", WS_POPUP, w_rect.x, w_rect.y, w_rect.w, w_rect.h, null, null, h, null);
    if (!hWnd) return;
    var gptoken = null, gpstart = new GdiplusStartupInput(1, 0, 0, 0);
    GdiplusStartup(addr(gptoken), gpstart, null);
    ShowWindow(hWnd, SW_SHOWNORMAL);
    drawFrame(hWnd);
    UpdateWindow(hWnd);
    var msg = new MSG;
    while (GetMessageW(msg, null, 0, 0)) {
        TranslateMessage(msg);
        DispatchMessageW(msg);
    }
    deleteShapes();
    GdiplusShutdown(gptoken);
}
setFactor();
winMain();