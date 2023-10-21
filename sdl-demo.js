import {
    SDL_Init,
    SDL_CreateWindow,
    SDL_FillRect,
    SDL_GetWindowSurface,
    SDL_MapRGB,
    SDL_UpdateWindowSurface,
    SDL_Delay,
    SDL_WaitEvent,
    SDL_CreateThread,
    SDL_EventState,
    SDL_DetachThread,
    SDL_GetWindowSize,
} from cdecl.utf8`SDL2.dll`;
import "sdl/SDL.h";
import { random, array, mfree, addr, jsfree } from 'yueji';
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;
SDL_EventState(SDL_SYSWMEVENT, SDL_IGNORE);
SDL_EventState(SDL_USEREVENT, SDL_IGNORE);
var flags = SDL_INIT_VIDEO | SDL_INIT_AUDIO | SDL_INIT_TIMER;
if (SDL_Init(flags) < 0) return;
flags = SDL_WINDOW_SHOWN | SDL_WINDOW_RESIZABLE;
var window = SDL_CreateWindow("你好月季，演示排序", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, SCREEN_WIDTH, SCREEN_HEIGHT, flags);
if (!window) return;
var rgb = 0x2266cc;
function 渲染(arr, rgb) {
    var r = rgb >> 16 & 0xff;
    var g = rgb >> 8 & 0xff;
    var b = rgb & 0xff;
    var screenSurface = SDL_GetWindowSurface(window);
    var color = SDL_MapRGB(screenSurface[1/*format*/], r, g, b);
    var bgcolor = SDL_MapRGB(screenSurface[1/*format*/], 0, 0, 0);
    var width = SCREEN_WIDTH;
    var height = SCREEN_HEIGHT;
    var rect = new SDL_Rect;
    SDL_GetWindowSize(addr(width), addr(height));
    rect.x = 0;
    rect.y = 0;
    rect.w = width;
    rect.h = height;
    SDL_FillRect(screenSurface, rect, bgcolor);
    for (var cx = 0, dx = arr.length; cx < dx; cx++) {
        rect.x = cx * (width + 10) / dx | 0;
        rect.y = height * (1 - arr[cx]) | 0;
        rect.h = height * arr[cx] | 0;
        rect.w = width / dx - 10 | 0;
        SDL_FillRect(screenSurface, rect, color);
    }
    rect.x = 10;
    rect.y = height - 120 | 0;
    rect.w = 100;
    rect.h = 100;
    SDL_FillRect(screenSurface, rect, bgcolor);
    rect.x = 20;
    rect.y = height - 110 | 0;
    rect.w = 80;
    rect.h = 80;
    SDL_FillRect(screenSurface, rect, color);
    SDL_UpdateWindowSurface(window);
    SDL_Delay(2)
    mfree(rect);
};
function 随机数组(size) {
    var a = array(size);
    for (var cx = 0, dx = a.length; cx < dx; cx++) {
        a[cx] = random();
    }
    return a;
}
function 冒泡排序(arr) {
    for (var cx = 0, dx = arr.length; cx < dx; cx++) {
        for (var cy = 0, dy = cx; cy < dy; cy++) {
            if (arr[cy] < arr[dy]) {
                var temp = arr[cy];
                arr[cy] = arr[dy];
                arr[dy] = temp;
                渲染(arr, rgb);
                SDL_Delay(60);
            }
        }
    }
}
var ignore = false;
var 递归排序 = function (arr, left, right) {
    if (left >= right) return;
    var index = left | 0;
    for (var cx = left + 1 | 0, dx = right | 0; cx <= dx;) {
        if (arr[index] < arr[cx]) {//右边较小，挪到左边
            var temp = arr[cx];
            arr[cx] = arr[index];
            arr[index] = temp;
            index = cx | 0;
            cx++;
        }
        else {//右边不小，挪到右边
            var temp = arr[cx];
            arr[cx] = arr[dx];
            arr[dx] = temp;
            dx--;
        }
        渲染(arr, rgb);
        SDL_Delay(60);
    }
    递归排序(arr, left, index - 1);
    递归排序(arr, index + 1, right);
};
function 演示() {
    ignore = true;
    rgb = rgb << 8;
    rgb = (rgb << 3 | rgb >> 21) & 0xffffff;
    var arr = 随机数组(10);
    递归排序(arr, 0, arr.length - 1);
    jsfree(arr);
    ignore = false;
}
var e = new SDL_Event;
loop: while (SDL_WaitEvent(e)) {
    switch (e.type) {
        case SDL_QUIT: break loop;
        case SDL_MOUSEBUTTONDOWN:
            if (e.button.button === SDL_BUTTON_LEFT) {
                if (ignore) break;
                var thread = SDL_CreateThread(演示, "重绘", null, null, null);
                SDL_DetachThread(thread);
            }
            break;
        default:
    }
}
