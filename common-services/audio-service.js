/*global overwolf*/

async function createAndPlay(audioPath) {
  return new Promise((resolve, reject) => {
    overwolf.media.audio.create(
      audioPath,
      response => {
        if (response.status == "success") {
          overwolf.media.audio.play(response.id, (response) => {
            resolve(response);
          });
        }
        else
          reject(response);
      }
    );
  });
}

function playHTML5Audio(path, volume = 50) {
  var audio = new Audio(path);
  audio.volume = volume / 100;
  audio.play();
}

export default {
  createAndPlay,
  playHTML5Audio
}       