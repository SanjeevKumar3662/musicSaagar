let currAudio = new Audio();
let currFolder;
let songs;
const songInfo = document.querySelector(`.songInfo`);
const timing = document.querySelector(`.timing`);
const seekCircle = document.getElementById(`seek`);
seekCircle.value = 0;
const volume = document.getElementById(`volume`);
volume.value = 100;
const volIcon = document.querySelector(`#volIcon`);
const playbar = document.querySelector(`.playbar`);
let folderIndex = 5;
let index;

// Step 1: To display album on website by scanning the songs folder
const displayAlbums = async () => {
  let cardContainer = document.querySelector(`.cardContainer`);
  // Get all folders in "Songs" directory
  let responce = await fetch(`/songs/`);
  let text = await responce.text();
  let doc = document.createElement(`div`);
  doc.innerHTML = text;
  let anchors = Array.from(doc.querySelectorAll(`a`));
  let folders = [];
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    if (anchor.href.includes(`/songs/`)) {
      folders.push(anchor.href.split("/").slice(-2, -1)[0]);
    }
  }
  console.log(folders);

  for (const folder of folders) {
    let card = document.createElement("div");
    let responce = await fetch(`/songs/${folder}/info.json`);
    let folderInfo = await responce.json();
    // console.log(folderInfo);
    card.innerHTML = `
        <div><img src="/songs/${folder}/cover.jpg" alt="cover"></div>
        <div class="details">
          <p>${folderInfo.title}</p>
          <p>${folderInfo.description}</p>
          <div class="hover ">
          <img id="hover" src="img/hover.png" alt="">
        </div>
        </div>`;
    card.classList.add("card");
    card.dataset.folder = folderInfo.name;
    // console.log(card);
    cardContainer.prepend(card);

    card.addEventListener(`click`, (e) => {
      loadMusic(e.currentTarget.dataset.folder.toLowerCase());
      folderIndex = folders.indexOf(e.currentTarget.dataset.folder);
    });
  }

  // Album mai agea piche hone ke liye upar jo 2 buttons hai usse index 5 se start hai 0 ki wajah kyuki prepend kiya tha isliye songs folder ke song wale cards ulte order mai lage hai website pe
  let prevAlbum = document.querySelector(`.prevAlbum`);
  prevAlbum.addEventListener(`click`, (e) => {
    console.log(`prevAlbum is clicked`);
    if (folderIndex < 5) {
      console.log(`select ${folderIndex + 1} album`);
      folderIndex++;
      loadMusic(folders[folderIndex]);
    }
  });
  let nextAlbum = document.querySelector(`.nextAlbum`);
  nextAlbum.addEventListener(`click`, (e) => {
    console.log(`nextAlbum is clicked`);
    if (folderIndex > 0) {
      console.log(`select ${folderIndex - 1} album`);
      folderIndex--;
      loadMusic(folders[folderIndex]);
    }
  });
};

// album pe click karn pe jo puri songs ki list library mai add hogi
const loadMusic = async (folder) => {
  currFolder = folder;
  // currAudio.pause();
  let songList = document.querySelector(`.songs ul`);
  songList.innerHTML = ``;

  let responce = await fetch(`/songs/${folder}/`);
  let text = await responce.text();
  let doc = document.createElement(`div`);
  doc.innerHTML = text;
  let anchors = Array.from(doc.querySelectorAll(`a`));
  songs = [];
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    if (anchor.href.endsWith(`.mp3`)) {
      songs.push(decodeURI(anchor.href.split("/").slice(-1)[0]));
    }
  }
  // console.log(songs)

  // play first audio of album on clicking and update other things
  playMusic(folder, songs[0]);
  index = 0;
  play.src = "img/pause.svg";
  playbar.classList.remove(`vHid`);
  let songName = decodeURI(currAudio.src.split("/").slice(-1)[0]);
  console.log(songs);
  console.log(songName);
  index = songs.indexOf(songName);
  console.log(index);

  let songLi;
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
      songLi = document.createElement(`li`);
      songLi.innerHTML = `
    <svg class="invert" xmlns="http://www.w3.org/2000/svg" width="24" height="44" viewBox="0 0 24 24"
    fill="none">
    <circle cx="6.5" cy="18.5" r="3.5" stroke="#000000" stroke-width="1.5" />
    <circle cx="18" cy="16" r="3" stroke="#000000" stroke-width="1.5" />
    <path
      d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16"
      stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="#000000" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <p>${song}</p>
  <button class="playNow flex"><a class="download" href="songs/${folder}/${song}" download><img height="25px" class="invert" src="img/download.svg" alt="download"></a></button>
      `;
      songLi.classList.add("gaana");
      songList.append(songLi);
      let download = document.querySelectorAll(`.download`);
      download.forEach((e) => {
        e.addEventListener(`click`, (e) => {
          e.stopPropagation();
          console.log(`download`);
        });
      });
  }
  let sList = document.querySelectorAll(`.gaana`);
  sList.forEach((li) => {
    li.addEventListener(`click`, (e) => {
      play.src = "img/pause.svg";
      // console.log(currFolder, e.currentTarget.querySelector(`p`).textContent)
      playMusic(currFolder, e.currentTarget.querySelector(`p`).textContent);
      console.log(
        songs.indexOf(e.currentTarget.querySelector(`p`).textContent)
      );
      index = songs.indexOf(e.currentTarget.querySelector(`p`).textContent);
    });
  });
};

const playMusic = (file, audio) => {
  currAudio.pause();
  currAudio = new Audio(`/songs/${file}/${audio}`);
  currAudio.play();
  currAudio.volume = volume.value / 100;
  songInfo.textContent = audio;
  //timeupdate event
  currAudio.addEventListener("timeupdate", () => {
    timing.innerHTML = `<p>${timeFormat(
      currAudio.currentTime
    )}</p><p>/${timeFormat(currAudio.duration)}</p>`;
    seekCircle.value = `${(currAudio.currentTime / currAudio.duration) * 100}`;
  });
  seekCircle.addEventListener("input", (event) => {
    // Handle seeking when the user interacts with the seekbar
    const seekPercentage = event.target.value;
    const newTime = (seekPercentage / 100) * currAudio.duration;
    currAudio.currentTime = newTime;
  });
  // Next audio of album automatically playing
  currAudio.addEventListener("ended", () => {
    console.log(`next song playing`);
    if (index + 1 < songs.length) {
      index++;
      playMusic(currFolder, songs[index]);
    } else {
      play.src = "img/play.svg";
    }
  });
};

const timeFormat = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minu = Math.floor(seconds / 60);
  const remainingSec = Math.floor(seconds % 60);
  const formattedMin = String(minu).padStart(2, "0");
  const formattedSec = String(remainingSec).padStart(2, "0");
  return `${formattedMin}:${formattedSec}`;
};

async function main() {
  displayAlbums();

  play = document.querySelector(`#play`);
  play.addEventListener(`click`, (e) => {
    if (currAudio.paused) {
      currAudio.play();
      play.src = "img/pause.svg";
    } else {
      currAudio.pause();
      play.src = "img/play.svg";
    }
  });

  // Handle volume when the user interacts with the volume baar
  volume.addEventListener("input", (e) => {
    currAudio.volume = e.target.value / 100;
    if (currAudio.volume === 0) {
      volIcon.src = `img/mute.svg`;
    } else {
      volIcon.src = `img/volume.svg`;
    }
  });

  volIcon.addEventListener(`click`, (e) => {
    if (volIcon.src.includes("volume")) {
      volIcon.src = `img/mute.svg`;
      currAudio.volume = 0;
      volume.value = 0;
    } else {
      volIcon.src = `img/volume.svg`;
      currAudio.volume = 0.2;
      volume.value = 20;
    }
  });
  let hamburger = document.querySelector(`#menu`);
  hamburger.addEventListener(`click`, (e) => {
    document.querySelector(`.left`).style.display = `inline-block`;
  });
  let cross = document.querySelector(`#cross`);
  cross.addEventListener(`click`, (e) => {
    document.querySelector(`.left`).style.display = `none`;
  });

  //  Handling prev next button to go forward and backward in library
  const prev = document.querySelector(`#prev`);
  prev.addEventListener("click", (e) => {
    console.log("Previous button clicked");
    if (index - 1 >= 0) {
      index--; // Update the index
      play.src = "img/pause.svg";
      playMusic(currFolder, songs[index]);
    }
  });
  const next = document.querySelector(`#next`);
  next.addEventListener("click", (e) => {
    console.log("Next button clicked");
    if (index + 1 < songs.length) {
      index++; // Update the index
      play.src = "img/pause.svg";
      playMusic(currFolder, songs[index]);
    }
  });
}
main();
