```js
/**
* Move a window
* @public
*/
static move_window_to(window, left, top) {
    var result = overwolf.windows.changePosition(window, Math.round(left), Math.round(top));
    return result;
}
```
