/*global overwolf*/

async function getCurrentOverwolfUser() {
    return new Promise((resolve, reject) => {
        overwolf.profile.getCurrentUser((profile) => {
            resolve(profile);
        });
    });
}

export default {
    getCurrentOverwolfUser
}