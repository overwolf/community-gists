# windows-service.js

This utility file contains many methods and promised Overwolf API to manage windows easily.

This code is production ready, well tested on an application with over 10k installs, some use cases are specific for my app, so feel free to edit or change the code according to your needs.

## Main functions

Many functions wraps overwolf.windows API with promises.

But some are completely custom:

* closeCurrentWindow
* getOpenWindows : gets all opened windows
* openWindow : opens a window without having to call before the `obtainDeclaredWindow` function
* openWindowWithOptions : open a window with specific positioning and sizing options. 
After opened the window, position the window or size it according to passed options.
When a window is opened with this function, is tracked saving moved windows in localStorage.
Default options object is:
```
{
    position: windowPosition.DEFAULT,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    fullWidth: false,
    fullHeight: false,
}
```
* moveWindow : used from `openWindowWithOptions` to move the window but it can be used alone
* toggleWindow : permits to close completely the window or hide it
* movedWindows : save the moved window name in localStorage
* resizedWindow : save the resized window name in localStorage
