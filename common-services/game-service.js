/*global overwolf*/

async function getGameDBInfo(gameClassID) {
    return new Promise((resolve, reject) => {
        overwolf.games.getGameDBInfo(parseInt(gameClassID), g => {
            resolve(g);
        });
    });
}

export default {
    getGameDBInfo
}