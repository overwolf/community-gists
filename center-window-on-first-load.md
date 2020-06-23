
```js
/**
 * This script is centering a window upon first opening.
 * @public
 */
var localStorageString = window.localStorage.getItem('localStorage');
var localStorage = localStorageString ? JSON.parse(localStorageString) : {};

document.body.style.visibility = "hidden";
overwolf.windows.getCurrentWindow((result) => {
    if (result.status != "success")
        return;
    // here you could do stuff like keep a reference of this window
    if (localStorage.weLaunchedOnceBefore)
        return;
    localStorage.weLaunchedOnceBefore = true;

    var winWid = result.window.width
    var winHei = result.window.height
    
    overwolf.utils.getMonitorsList((monRes) => {
        if (result.status != "success")
            return;
        // example 
        var monWid = monRes.displays[0].width;
        var monHei = monRes.displays[0].height;
        var left = monWid / 2 - (winWid / 2);
        var top = monHei / 2 - (winHei / 2);

        overwolf.windows.changePosition("MainWindow", parseInt(left), parseInt(top), () => {
            if (result.status != "success")
                return;
            document.body.style.visibility = "visible";
            window.localStorage.setItem('localStorage', JSON.stringify(localStorage));
        });
    });
});
```
