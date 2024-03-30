let currentSong = new Audio;

function formatSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if minutes or seconds are single digit
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    // var formattedSeconds = Math.floor(remainingSeconds);
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {

    //Get list of all the songs 
    let songs = await getSongs();
    playMusic(songs[0], true);

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Unknown</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="playbutton.svg" alt="">
                            </div> 
         </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "playbutton.svg"
        }

    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to move circle on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = percent / 100 * currentSong.duration;
    })

    //Add an event listener to open hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "0%";
    })

    //Add an event listener to close hamburger
    document.querySelector(".cross").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listener to play previous songs
    backward.addEventListener("click", ()=> {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        if((index-1) >= 0) {
            playMusic(songs[index-1]);
        }
        else {
                    playMusic(songs[songs.length - 1]);
                }
    })

    //Add an event listener to play next songs
    forward.addEventListener("click", ()=> {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        if((index+1) < songs.length) {
            playMusic(songs[index+1]);
        }
        else {
            playMusic(songs[0]);
        }
    })

}
main();