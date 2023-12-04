WM_DPICHANGED              equ 002E0h
WM_DPICHANGED_BEFOREPARENT equ 002E2h
WM_DPICHANGED_AFTERPARENT  equ 002E3h
WM_GETDPISCALEDSIZE        equ 002E4h
MDT_EFFECTIVE_DPI          equ 0
MDT_ANGULAR_DPI            equ 1
MDT_RAW_DPI                equ 2
MDT_DEFAULT                equ MDT_EFFECTIVE_DPI

GdiplusStartupInput struct
    GdiplusVersion           DWORD 1 ; // Must be 1
    DebugEventCallback       DWORD 0 ; // Ignored on free builds
    SuppressBackgroundThread DWORD 0 ; // FALSE unless you're prepared to call
    SuppressExternalCodecs   DWORD 0 ; // FALSE unless you want GDI+ only to use
GdiplusStartupInput ends

DotsChangeParam     struct
	x real4 ?
	y real4 ?
	r real4 ?
DotsChangeParam ends

SRECT  struct
	x dd ?
	y dd ?
	w dd ?
	h dd ?
SRECT         ends

EFRONT_BUTTON struct
	back dd ?
	clip dd ?
	text dd ?
	leng dd ?
	rect dd ?
EFRONT_BUTTON ends

DEVICE_PRIMARY   equ 0
DEVICE_IMMERSIVE equ 1

IUnknown STRUCT
    QueryInterface cominvk
    AddRef         cominvk
    Release        cominvk
IUnknown     ENDS

IModalWindow STRUCT
    IUnknown
    Show cominvk
IModalWindow ends
; https://github.com/nuxui/nuxui/blob/b8defe2685ee5b88ebf9617ba83488b217b29fa5/nux/internal/win32/com/filedialog.go
IFileDialog  struct
    IModalWindow
	SetFileTypes        cominvk
	SetFileTypeIndex    cominvk
	GetFileTypeIndex    cominvk
	Advise              cominvk
	Unadvise            cominvk
	SetOptions          cominvk
	GetOptions          cominvk
	SetDefaultFolder    cominvk
	SetFolder           cominvk
	GetFolder           cominvk
	GetCurrentSelection cominvk
	SetFileName         cominvk
	GetFileName         cominvk
	SetTitle            cominvk
	SetOkButtonLabel    cominvk
	SetFileNameLabel    cominvk
	GetResult           cominvk
	AddPlace            cominvk
	SetDefaultExtension cominvk
	Close               cominvk
	SetClientGuid       cominvk
	ClearClientData     cominvk
	SetFilter           cominvk
IFileDialog ends

IFileOpenDialog struct
IFileDialog
GetResults       cominvk
GetSelectedItems cominvk
IFileOpenDialog ends

FOS_OVERWRITEPROMPT               equ 2h        ;
FOS_STRICTFILETYPES               equ 4h        ;
FOS_NOCHANGEDIR                   equ 8h        ;
FOS_PICKFOLDERS                   equ 20h       ;
FOS_FORCEFILESYSTEM               equ 40h       ;
FOS_ALLNONSTORAGEITEMS            equ 80h       ;
FOS_NOVALIDATE                    equ 100h      ;
FOS_ALLOWMULTISELECT              equ 200h      ;
FOS_PATHMUSTEXIST                 equ 800h      ;
FOS_FILEMUSTEXIST                 equ 1000h     ;
FOS_CREATEPROMPT                  equ 2000h     ;
FOS_SHAREAWARE                    equ 4000h     ;
FOS_NOREADONLYRETURN              equ 8000h     ;
FOS_NOTESTFILECREATE              equ 10000h    ;
FOS_HIDEMRUPLACES                 equ 20000h    ;
FOS_HIDEPINNEDPLACES              equ 40000h    ;
FOS_NODEREFERENCELINKS            equ 100000h   ;
FOS_OKBUTTONNEEDSINTERACTION      equ 200000h   ;
FOS_DONTADDTORECENT               equ 2000000h  ;
FOS_FORCESHOWHIDDEN               equ 10000000h ;
FOS_DEFAULTNOMINIMODE             equ 20000000h ;
FOS_FORCEPREVIEWPANEON            equ 40000000h ;
FOS_SUPPORTSTREAMABLEITEMS        equ 80000000h ;

SIGDN_DESKTOPABSOLUTEEDITING      equ 8004c000h
SIGDN_DESKTOPABSOLUTEPARSING      equ 80028000h
SIGDN_FILESYSPATH                 equ 80058000h
SIGDN_NORMALDISPLAY               equ 0
SIGDN_PARENTRELATIVE              equ 80080001h
SIGDN_PARENTRELATIVEEDITING       equ 80031001h
SIGDN_PARENTRELATIVEFORADDRESSBAR equ 8007c001h
SIGDN_PARENTRELATIVEPARSING       equ 80018001h
SIGDN_URL                         equ 80068000h

IShellItem struct
	IUnknown
	BindToHandler  cominvk
	GetParent      cominvk
	GetDisplayName cominvk
	GetAttributes  cominvk
	Compare        cominvk
IShellItem ends
