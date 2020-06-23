```js
 /**
 * Returns the current screen resolution in-game
 * @public
 */
static find_game_resolution = function(callback) {
    overwolf.games.getRunningGameInfo(function(gameinfo){
        window.gameinfo = false;
        if(arguments.length == 1) {
            window.gameinfo = gameinfo;
        } else {
            $.each(gameinfo, function(k,v){
                if(typeof v.id === 'undefined') return true;
                if(Math.floor(v.id/10) == 10826) {
                    window.gameinfo = v;
                    return false;
                }
            });
        }
        if(typeof window.gameinfo === 'undefined' || window.gameinfo === false || window.gameinfo === null) {
            // Fallback assumption, 1080p resolution
            var sw = 1920; // Screen Width
            var sh = 1080; // Screen Height
        } else {
            var sw = window.gameinfo.logicalWidth; // Screen Width
            var sh = window.gameinfo.logicalHeight; // Screen Height
        }
        var result = {
            "width": sw,
            "height": sh
        };
        callback(result);
    });
}
```
