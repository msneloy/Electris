const { desktopCapturer, remote } = require("electron");
//access electron screencapture ops
const { writeFile } = require("fs");
//access to local filesystem
const { dialog, Menu } = remote;
//electron app render option
let mediaRecorder; //framecapture function
const recordedChunks = []; //capture frames

const videoElement = document.querySelector("video"); //video source selector

const startBtn = document.getElementById("startBtn"); //button functions
startBtn.onclick = (e) => {
  mediaRecorder.start();
  startBtn.classList.add("is-warning");
  startBtn.innerText = "Capturing";
};
//triggers
const stopBtn = document.getElementById("stopBtn");
//function terminator
stopBtn.onclick = (e) => {
  mediaRecorder.stop();
  startBtn.classList.remove("is-danger");
  startBtn.innerText = "Start";
};
//button triggers
const videoSelectBtn = document.getElementById("videoSelectBtn");
videoSelectBtn.onclick = getVideoSources;
//video source element
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });
  //source root
  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map((source) => {
      return {
        label: source.name,
        click: () => selectSource(source),
      };
    })
  );
  //template engine loader

  videoOptionsMenu.popup(); //video souce selector
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;
  //souce control
  const constraints = {
    audio: false, //no audio
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };
  //date plus time tag
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  videoElement.srcObject = stream;
  videoElement.play();
  //on screen playback
  const options = {
    mimeType: "video/webm; codecs=vp9",
  };
  mediaRecorder = new MediaRecorder(stream, options);
  //video source renderer
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}
//render killswitch
function handleDataAvailable(e) {
  console.log("video data available");
  recordedChunks.push(e.data);
}
//frame capture
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });
  //frame render
  const buffer = Buffer.from(await blob.arrayBuffer());
  //frame buffer
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.webm`, //format
  });
  //source tag syntax
  if (filePath) {
    writeFile(filePath, buffer, () => console.log("video saved successfully!"));
  }
  //save in filesystem
}
