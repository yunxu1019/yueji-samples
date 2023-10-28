WM_DPICHANGED equ 002E0h
WM_DPICHANGED_BEFOREPARENT equ 002E2h
WM_DPICHANGED_AFTERPARENT equ 002E3h
WM_GETDPISCALEDSIZE equ 002E4h
MDT_EFFECTIVE_DPI equ 0
MDT_ANGULAR_DPI  equ 1
MDT_RAW_DPI  equ 2
MDT_DEFAULT  equ MDT_EFFECTIVE_DPI
GdiplusStartupInput struct
    GdiplusVersion DWORD 1; // Must be 1
    DebugEventCallback DWORD 0; // Ignored on free builds
    SuppressBackgroundThread DWORD 0; // FALSE unless you're prepared to call
    SuppressExternalCodecs DWORD 0; // FALSE unless you want GDI+ only to use
GdiplusStartupInput ends
DotsChangeParam struct
x real4 ?
y real4 ?
r real4 ?
DotsChangeParam ends
SRECT struct
x dd ?
y dd ?
w dd ?
h dd ?
SRECT ends
EFRONT_BUTTON struct
back dd ?
clip dd ?
text dd ?
leng dd ?
rect dd ?
EFRONT_BUTTON ends
DEVICE_PRIMARY equ 0
DEVICE_IMMERSIVE equ 1
