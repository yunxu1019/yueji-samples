import "include/windows.inc";
import "./winup.inc";
import {
    GetModuleHandleW,
    GetEnvironmentVariableW,
    GetCurrentProcess,
    GetCurrentThread,
    CloseHandle,
    GetProcessHeap,
    HeapAlloc,
    HeapFree,
    ExitProcess,
    CreateFileW,
} from "Kernel32.dll";
var alert = function (content, title = "错误") {
    MessageBoxW(null, content, title, MB_OK | MB_ICONASTERISK);
};
import {
    SHGetSpecialFolderPathW,
    SHBrowseForFolderW,
    GetFileNameFromBrowse,
    SHCreateItemFromParsingName,
    SHGetPathFromIDListW
} from "Shell32.dll";
import { CoCreateInstance, CoDisconnectObject, IIDFromString, CLSIDFromString, CoUninitialize, CoInitializeEx, CoTaskMemFree, OleUninitialize, OleInitializ } from "Ole32.dll";
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
    ReleaseCapture,
    MessageBoxW,
    CreateDialogParamW,
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
    GdipGetGenericFontFamilySerif,
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
    GdipSetPenColor,
    GdipAddPathLine,
    GdipAddPathLine2,
    GdipAddPathString,
    GdipWindingModeOutline,
} from "GdiPlus.dll";
import { Utf16, addr, buffer, mfree, jsfree, strcpy, dump } from 'yueji';
var factor = 1.0;
var w_rect = new SRECT(0, 0, 480, 360);
var closeBtn = new EFRONT_BUTTON(0, 0, 0, 0, 0);
var ground = new EFRONT_BUTTON(0, 0, 0, 0, 0);
var setupBtn = new EFRONT_BUTTON(0, 0, 0, 0, 0);
var mouseActived = false, mouseMoved = false;
var mousePosition = new POINT(0, 0);
var cursor_top = 0.0;
var cursor_left = 0.0;
var currentHover = 1;
var mouseDrag = function (hWnd) {
    if (!mouseMoved) {
        var p = new POINT;
        GetCursorPos(p);
        var deltax = p.x - mousePosition.x;
        var deltay = p.y - mousePosition.y;
        if (deltax * deltax + deltay * deltay < factor * 3) {
            return;
        }
        mouseMoved = true;
        mouseActived = false;
        w_rect.x = p.x - mousePosition.x + w_rect.x | 0;
        w_rect.y = p.y - mousePosition.y + w_rect.y | 0;
        MoveWindow(hWnd, w_rect.x, w_rect.y, w_rect.w, w_rect.h, true);// win7上只能用true
        mousePosition.x = p.x;
        mousePosition.y = p.y;
        ReleaseCapture();
        SendMessageW(hWnd, WM_SYSCOMMAND, SC_MOVE | HTCAPTION, 0);
    }
}

var updateCursor = function (hWnd) {
    var p = new POINT;
    var rect = new RECT;
    GetCursorPos(p);
    GetWindowRect(hWnd, rect);
    cursor_left = (p.x - rect.left) / factor;
    cursor_top = (p.y - rect.top) / factor;
}
var mouseMove = function (hWnd) {
    if (mouseActived) {
        mouseDrag(hWnd);
    }
};
var tempTarget = buffer(MAX_PATH, 1);
var choosingfn = function (hWnd, uMsg, lParam, lpData) {
    var pszPath = buffer(MAX_PATH, 1);
    switch (uMsg) {
        case BFFM_INITIALIZED:
            SendMessageW(hWnd, BFFM_SETSELECTION, true, targetPath);
            break;
        case BFFM_SELCHANGED:
            SHGetPathFromIDListW(lParam, tempTarget);
            SendMessageW(hWnd, BFFM_SETSTATUSTEXT, 0, pszPath);
            break;
    }
    return 0;
}
var initiallized = false;
var pfd = 0;
IFileDialog: pfd;
var browsForFolder = function (hWnd) {
    var title = L`选择文件夹`;
    var CLSID_FileOpenDialog = G`dc1c5a9c-e88a-4dde-a5a1-60f82a20aef7`;
    var IID_IFileOpenDialog = G`d57c7288-d4ad-4768-be02-9d969532d960`;
    var IID_IShellItem = G`43826d1e-e718-42ee-bc55-a1e261c37bfe`;
    // https://github.com/ncruces/zenity/blob/2f486f1d0107c245da13182649e70457335aec8f/internal/win/shell32.go#L54

    // https://github.com/godotengine/godot/blob/80de898d721f952dac0b102d48bb73d6b02ee1e8/platform/windows/display_server_windows.cpp#L270
    noframe = true;
    if (!initiallized) {
        if (CoInitializeEx) {
            var hr = CoInitializeEx(null, COINIT_APARTMENTTHREADED);
            initiallized = hr >= 0;
            if (initiallized) {
                hr = CoCreateInstance(CLSID_FileOpenDialog, null, CLSCTX_ALL, IID_IFileOpenDialog, addr(pfd));
            }
        }
        if (hr >= 0) {
            pfd.SetTitle(title);
            var path1 = 0;
            if (SHCreateItemFromParsingName) {
                hr = SHCreateItemFromParsingName(targetPath, null, IID_IShellItem, addr(path1));
                if (hr >= 0) {
                    IShellItem: path1;
                    pfd.SetDefaultFolder(path1);
                    pfd.SetFolder(path1);
                    path1.Release();
                }
            }
            var flags = 0;
            pfd.GetOptions(addr(flags));
            flags |= FOS_PICKFOLDERS;
            pfd.SetOptions(flags | FOS_FORCEFILESYSTEM);
        }
    }
    if (initiallized) {
        hr = pfd.Show(hWnd);
        var result = 0;
        hr = pfd.GetResult(addr(result));
        if (hr >= 0) {
            IShellItem: result;
            var file_path = 0;
            hr = result.GetDisplayName(SIGDN_DESKTOPABSOLUTEPARSING, addr(file_path));
            if (hr >= 0) {
                strcpy(targetPath, file_path);
                CoTaskMemFree(file_path);
            }
            result.Release();
        }
    }
    else {
        var tmp = buffer(MAX_PATH, 1);
        strcpy(tmp, targetPath);
        var flag = BIF_RETURNONLYFSDIRS | BIF_STATUSTEXT;

        var a = new BROWSEINFOW({
            hwndOwner: hWnd,
            pidlRoot: null,
            pszDisplayName: tmp,
            lpszTitle: title,
            ulFlags: flag,
            lpfn: choosingfn,
            lParam: null,
            iImage: null,
        });
        if (SHBrowseForFolderW(a)) {
            strcpy(targetPath, tempTarget);
        }
    }

    noframe = false;
};

var mouseUp = function (hWnd) {
    mouseActived = false;
    if (mouseMoved) return;
    if (!currentHover) return;
    switch (currentHover) {
        case closeBtn:
            return SendMessageW(hWnd, WM_CLOSE, null, null);
        case setupBtn:
            alert(targetPath, '目标文件夹');
            return;
        case folder_rect:
            browsForFolder(hWnd);
            return;
    }
};

var mouseDown = function (hWnd) {
    mouseActived = true;
    mouseMoved = false;
    var r = new RECT;
    GetWindowRect(hWnd, r);
    GetCursorPos(mousePosition);
    w_rect.x = r.left;
    w_rect.y = r.top;
};

var noframe = false;
var eventsHandle = function (hWnd, uMsg, wParam, lParam) {
    switch (uMsg) {
        case WM_CREATE:

            SetTimer(hWnd, 1, 16, null);
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
    var created = true;
    GdipCreateFontFamilyFromName(fFamily, null, addr(family));
    if (!family) GdipCreateFontFamilyFromName("仿宋_GB2312", null, addr(family));
    if (!family) GdipCreateFontFamilyFromName("楷体_GB2312", null, addr(family));
    if (!family) GdipCreateFontFamilyFromName("黑体", null, addr(family));
    if (!family) GdipCreateFontFamilyFromName("宋体", null, addr(family));
    if (!family) {
        GdipGetGenericFontFamilySerif(addr(family));
        created = false;
    }
    GdipCreateFont(family, fontSize, 0, 0, addr(font));
    // debugger;
    GdipCreateStringFormat(0x00007400, 0, addr(format));
    GdipSetStringFormatTrimming(format, 5);
    GdipCreateSolidFill(color | 0, addr(brush));
    var a = buffer(1024, 1);
    strcpy(a, text);
    if (rectref) {
        GdipMeasureString(gp, a, a.length, font, rect, format, rectref, addr(x), addr(y));
    }
    GdipCreatePath(0, addr(path));
    GdipResetPath(path);
    GdipAddPathString(path, a, a.length, family, 0, fontSize, rect, format);
    GdipWindingModeOutline(path, 0, 1.0);
    GdipFillPath(gp, brush, path);
    GdipDeleteFontFamily(family);
    GdipDeletePath(path);
    GdipDeleteFont(font);
    GdipDeleteBrush(brush);
    if (created) GdipDeleteStringFormat(format);
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
        GdipDrawPath(gp, pen, shape.back === ground.back ? ground.clip : shape.back);
        GdipDeletePen(pen);
    }
}
function createPathPolygon(dots) {
    var path = null;
    GdipCreatePath(0, addr(path));
    GdipAddPathPolygon(path, dots, dots.length >> 1);
    GdipSetPathFillMode(path, 1);
    return path;
}
var folder_rect = M`0,0,0,0`;
function drawFolder(gp) {
    var color;
    if (currentHover === folder_rect) {
        if (mouseActived) {
            color = 0xff922416;
        }
        else {
            color = 0xffc24436;
        }
    }
    else {
        color = 0xff629436;
    }
    drawText(gp, color, targetPath, 16, M`20,320,440,21`, "仿宋", folder_rect);
}
function drawClose(gp) {
    if (currentHover === closeBtn) {
        if (mouseActived) {
            drawButton(gp, closeBtn, 0xff363322, 0xffccc3c2, 1, 0xfff2c2bb);
        }
        else {
            drawButton(gp, closeBtn, 0xff5a3322, 0xfff2d3d2, 1, 0xfff2c2bb);
        }
    }
    else {
        drawButton(gp, closeBtn, 0xff323634, 0xffb2d2bb, 1, 0xffb2d2bb);
    }
}
function drawSetup(gp) {
    if (currentHover === setupBtn) {
        if (mouseActived) {
            drawButton(gp, setupBtn, 0xff222926, 0xff627266, 2, 0xff627266);
        }
        else {
            drawButton(gp, setupBtn, 0xff243229, 0xffd2f4c6, 2, 0xff627266);
        }
    }
    else {
        drawButton(gp, setupBtn, 0xff292c2b, 0xffb2d2bb, 2, 0xff627266);
    }
}
function drawTitle(gp) {
    drawText(gp, 0xff92b2aa, L`一剑隔世\0\0`, 42, M`18,20,370,50`, "仿宋", 0);
}
var logoLine = brizer(.78, 7, 5)`464.054,574.786,93.042,57.856,416.684,192.928,393.0,2.0,656.528,27.884,786.0,177.952,786.0,395.0,786.0,612.048,610.048,788.0,393.0,788.0,175.952,788.0,0.0,612.048,0.0,395.0,67.346,325.95,47.566,97.362,47.566,97.362,222.956,95.026,325.226,415.644,464.054,574.786`;
function createShapes(gp) {
    var CloseShape = M(1.0, 10, -1)`480,30,480,0,420,0,420.15,2.995,420.598,5.96,421.34,8.866,422.368,11.683,423.673,14.383,425.24,16.939,427.055,19.327,429.099,21.521,431.352,23.5,433.791,25.244,436.392,26.736,439.129,27.961,441.975,28.907,444.901,29.563,447.878,29.925`;
    var CrossShape = M(0.012, 454, 8)`1024,80.441,943.559,0,512,431.559,80.441,0,0,80.441,431.559,512,0,943.559,80.441,1024,512,592.441,943.559,1024,1024,943.559,592.441,512,1024,80.441`;
    closeBtn.clip = createPathPolygon(CrossShape);
    closeBtn.back = createPathPolygon(CloseShape);
    setupBtn.back = createPathPolygon(M`322,203,422,200,422,232,317,232`);
    setupBtn.clip = 16;
    setupBtn.rect = M`336,208,100,100`;
    setupBtn.text = L`>>弹窗<<`;
    ground.back = createPathPolygon(M`-1,-1,483,-1,483,363,-1,363,-1,-1`);
    ground.clip = createPathPolygon(logoLine);
}
function drawShapes(gp) {
    drawButton(gp, ground, 0xff262b29, 0xff2c322e, 1, 0xff829288);
    drawClose(gp);
    drawTitle(gp);
    drawSetup(gp);
    drawFolder(gp);
}
function deleteShapes() {
    GdipDeletePath(closeBtn.clip);
    GdipDeletePath(closeBtn.back);
    GdipDeletePath(ground.back);
}
var bitmap = null;
function drawFrame(hWnd) {
    if (noframe) return;
    var isCursorIn = function (shape) {
        var isIn = 0;
        GdipIsVisiblePathPoint(shape, cursor_left, cursor_top, gp, addr(isIn));
        return isIn;
    };
    var isCursorOn = function (rect) {
        var left = rect[0];
        var top = rect[1];
        var right = rect[2] + left;
        var bottom = rect[3] + top;

        return cursor_left >= left && cursor_left <= right && cursor_top >= top && cursor_top <= bottom;
    }
    updateCursor(hWnd);
    var lastHover = currentHover;
    if (isCursorIn(closeBtn.back)) {
        currentHover = closeBtn;
    }
    else if (isCursorIn(setupBtn.back)) {
        currentHover = setupBtn;
    }
    else if (isCursorOn(folder_rect)) {
        currentHover = folder_rect;
    }
    else {
        currentHover = null;
    }
    if (lastHover === currentHover) return;
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
    drawShapes(gp);
    BitBlt(dc, 0, 0, w_rect.w, w_rect.h, tmpDc, 0, 0, SRCCOPY);
    GdipReleaseDC(gp, tmpDc);
    GdipDeleteGraphics(gp);
    ReleaseDC(hWnd, dc);
    DeleteDC(tmpDc);
    UpdateWindow(hWnd);
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
    var hWnd = CreateWindowExW(WS_EX_LAYERED, className, "一剑隔世\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0", WS_POPUP, w_rect.x, w_rect.y, w_rect.w, w_rect.h, null, null, h, null);
    if (!hWnd) return;
    var gptoken = null, gpstart = new GdiplusStartupInput(1, 0, 0, 0);
    GdiplusStartup(addr(gptoken), gpstart, null);
    ShowWindow(hWnd, SW_SHOWNORMAL);
    drawFrame(hWnd);
    var msg = new MSG;
    while (GetMessageW(msg, null, 0, 0)) {
        TranslateMessage(msg);
        DispatchMessageW(msg);
    }
    deleteShapes();
    GdiplusShutdown(gptoken);
}
var targetPath = buffer(MAX_PATH, 1);
function initenv() {
    var res;
    if (GetEnvironmentVariableW) res = GetEnvironmentVariableW("ProgramW6432\0\0\0\0\0\0\0\0\0", targetPath, targetPath.length);
    if (!res) SHGetSpecialFolderPathW(null, targetPath, CSIDL_PROGRAM_FILES, false);
    Utf16(targetPath);
}
initenv();
setFactor();
winMain();
if (initiallized && pfd) {
    pfd.Release();
    CoDisconnectObject(pfd, 0);
    CoUninitialize();
}
ExitProcess();