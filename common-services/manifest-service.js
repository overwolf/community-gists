/*global overwolf*/

async function getManifest()
{
    return new Promise( (resolve, reject) => {
        overwolf.extensions.current.getManifest(manifest => {
            resolve(manifest);        
        });
    });
}

export default {
    getManifest
}