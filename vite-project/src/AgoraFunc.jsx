import AgoraRTC from "agora-rtc-sdk-ng";

import skin1 from './assets/skin/skin1.png';
import skin2 from './assets/skin/skin2.png';
import skin3 from './assets/skin/skin3.png';
import hair1 from './assets/hair/hair1.png';
import hair2 from './assets/hair/hair2.png';
import hair3 from './assets/hair/hair3.png';
import hair4 from './assets/hair/hair4.png';
import hair5 from './assets/hair/hair5.png';
import hair6 from './assets/hair/hair6.png';
import hair7 from './assets/hair/hair7.png';

const skinTones = [skin1, skin2, skin3];
const hairStyles = [hair1, hair2, hair3, hair4, hair5, hair6, hair7];

const appid = "555ddb47a67643abbf6e20f62f0e59fa";


let uidToEmailMap = {}; // Maps Agora UID to user email
console.log("UID to Email Map:", uidToEmailMap);

const token = null;

let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let rtcClient;

const initRtc = async (roomId) => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  rtcClient.on("user-joined", handleUserJoined);
  rtcClient.on("user-published", handleUserPublished);
  rtcClient.on("user-left", handleUserLeft);

  try {
    // Fetch user profile data
    const email = localStorage.getItem("userEmail"); // Retrieve email from localStorage
    if (!email) {
      alert("No user logged in!");
      return;
    }

    const response = await fetch(`http://localhost:3000/get-profile?email=${email}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user profile data");
    }

    const data = await response.json();
    console.log("User profile data:", data);
    // Extract user data
    const userId = data.id; // Use the ID from the backend or fallback to rtcUid
    console.log("this is the User ID from back end:", userId);
    const username = data.username || 404;
    const skinIdx = skinTones.findIndex((skin) => skin.includes(data.skin)) || 0;
    const hairIdx = hairStyles.findIndex((hair) => hair.includes(data.hair)) || 0;

    // Join the Agora channel
    // Join the Agora channel with the provided roomId
    console.log("Joining Agora Channel:", roomId);
    await rtcClient.join(appid, roomId, token, userId);
    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    console.log("Local audio track created:", audioTracks.localAudioTrack);
    await rtcClient.publish(audioTracks.localAudioTrack);

    // Render the user's avatar
    const membersDiv = document.getElementById("members");
    if (membersDiv) {
      const avatarPosition = { top: "100px", left: "100px" }; // Initial position

      membersDiv.insertAdjacentHTML(
        "beforeend",
        `
        <div
          class="avatar-stack user-rtc-${userId}"
          id="${userId}"
          style="position: absolute; top: ${avatarPosition.top}; left: ${avatarPosition.left};"
          draggable="true"
        >
          <div class="username-display">${username}</div>
          <img src="${skinTones[skinIdx]}" alt="Skin" class="edit-avatar base-layer" />
          <img src="${hairStyles[hairIdx]}" alt="Hair" class="edit-avatar overlay" />
        </div>
        `
      );
    } else {
      console.error("Members div not found in the DOM.");
    }
  } catch (error) {
    console.error("Error initializing RTC:", error);
  }
};


let handleUserJoined = async (user) => {
  console.log("USER JOINED:", user);

  try {
    // Fetch user profile data by user ID
    const response = await fetch(`http://localhost:3000/get-profile-by-id?id=${user.uid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch profile data for UID: ${user.uid}`);
    }

    const data = await response.json();
    console.log("Joined User profile data:", data);

    // Extract user data
    const username = data.username || `User-${user.uid}`;
    const skinIdx = skinTones.findIndex((skin) => skin.includes(data.skin)) || 0;
    const hairIdx = hairStyles.findIndex((hair) => hair.includes(data.hair)) || 0;

    console.log("Rendering avatar with:", { username, skinIdx, hairIdx });

    // Find the members div
    const membersDiv = document.getElementById("members");

    // Check if the members div exists
    if (membersDiv) {
      const avatarPosition = { top: "150px", left: "150px" }; // Example position for remote users

      membersDiv.insertAdjacentHTML(
        "beforeend",
        `
        <div
          class="avatar-stack user-rtc-${user.uid}"
          id="${user.uid}"
          style="position: absolute; top: ${avatarPosition.top}; left: ${avatarPosition.left};"
        >
          <div class="username-display">${username}</div>
          <img src="${skinTones[skinIdx]}" alt="Skin" class="edit-avatar base-layer" />
          <img src="${hairStyles[hairIdx]}" alt="Hair" class="edit-avatar overlay" />
        </div>
        `
      );

      console.log(`Added user avatar for UID: ${user.uid}`);
    } else {
      console.error("Members div not found in the DOM.");
    }
  } catch (error) {
    console.error(`Error fetching profile data for UID: ${user.uid}`, error);
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

const enterRoom = async (selectedRoomId) => {
  roomId = selectedRoomId; // Set the roomId dynamically
  console.log("Entering Room:", roomId);

  await initRtc(selectedRoomId); // Initialize RTC with the updated roomId
};

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