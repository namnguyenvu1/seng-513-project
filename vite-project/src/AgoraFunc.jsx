import AgoraRTC from "agora-rtc-sdk-ng";
const appid = "555ddb47a67643abbf6e20f62f0e59fa";

const token = null;

let roomId = "main"

let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let rtcClient;

const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  const rtcUid = Math.floor(Math.random() * 1000000); // Option 1: Random UID

  rtcClient.on('user-joined', handleUserJoined)
  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  


  await rtcClient.join(appid, roomId, token, null)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  console.log("Local audio track created:", audioTracks.localAudioTrack);
  await rtcClient.publish(audioTracks.localAudioTrack);


  document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`)
}


let handleUserJoined = async (user) => {
    console.log("USER JOINED:", user);
  
    // Find the members div
    const membersDiv = document.getElementById("members");
  
    // Check if the members div exists
    if (membersDiv) {
      membersDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`
      );
      console.log(`Added user avatar for UID: ${user.uid}`);
    } else {
      console.error("Members div not found in the DOM.");
    }
  };

let handleUserPublished = async (user, mediaType) => {
    console.log("USER published:", user);
    await  rtcClient.subscribe(user, mediaType);

    if (mediaType == "audio"){
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
    }
}

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid]
  document.getElementById(user.uid).remove()
}

const enterRoom = async (e) => {
  e.preventDefault()
  initRtc()

}

let leaveRoom = async () => {
    console.log("leaveRoom function called");

    audioTracks.localAudioTrack.stop()
    audioTracks.localAudioTrack.close()
    rtcClient.unpublish()
    rtcClient.leave()

    console.log("Left the room");

    document.getElementById('members').innerHTML = ''

}
export { enterRoom };
export { leaveRoom };
export default initRtc;