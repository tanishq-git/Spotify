let currentsong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    // Calculate whole minutes and remaining seconds

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format the output as "minutes:seconds"
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');
 var formattedTime = formattedMinutes + ':' + formattedSeconds ;
    return formattedTime
}



async function getsongs(folder){
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let respond = await a.text();
    let div = document.createElement("div");
    div.innerHTML = respond;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + ` <li> 
          <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song} </div>
                            <div>Tanishq</div>
                        </div>
                        <div class="playnow">
                            <span>play now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div>
                                            </li> `;
       
    }
    
// attach event listener to each song..
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })
    return songs

}

const playmusic = (track , pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track;
    if(!pause){
    currentsong.play()
     play.src = "pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00/00:00"

  
}

async function displayalbume(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let respond = await a.text();
    let div = document.createElement("div");
    div.innerHTML = respond;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
  let array =   Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
 
     if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0];
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
        let response = await a.json();
        console.log(response)
        cardcontainer.innerHTML =  cardcontainer.innerHTML + `<div data-folder="${folder}" class="card ">
                <div class="play">
                    <div data-testid="language-selection-button" class="" data-encore-id="buttonSecondary">
                        <span aria-hidden="true" class="icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`
     }
    }
    //   load the playlist whenever card is clicked..
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        console.log(item,item.currentTarget.dataset)
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
    })
})
}

async function main(){
    
      await getsongs("songs/cs");
   
    playmusic(songs[0],true);

    // display all the albume on the page
    displayalbume()
    // let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // for (const song of songs) {
    //     songul.innerHTML = songul.innerHTML + ` <li> 
    //       <img class="invert" src="music.svg" alt="">
    //                     <div class="info">
    //                         <div>${song} </div>
    //                         <div>Tanishq</div>
    //                     </div>
    //                     <div class="playnow">
    //                         <span>play now</span>
    //                         <img class="invert" src="play.svg" alt="">
    //                     </div>
    //                                         </li> `;
       
    // }
    
// attach event listener to each song..
    // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    //     e.addEventListener("click", element=>{
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    //     })
        
    // })

  
// attach an event listener to play,pre,next
play.addEventListener("click", ()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src = "pause.svg"
    } 
    else{
        currentsong.pause()
          play.src = "play.svg"
    }
})

// listen for time update event 
currentsong.addEventListener("timeupdate", ()=>{
  console.log(currentsong.currentTime , currentsong.duration);
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong
    .currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

})

// add event listener to seekbar
document.querySelector(".seekbar").addEventListener("click" ,e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
  document.querySelector(".circle").style.left = percent  + "%";
  currentsong.currentTime =  (currentsong.duration) * percent /100
})
// add an event listener
document.querySelector(".hambarger").addEventListener("click", e=>{
    document.querySelector(".left").style.left = 0;
})
// add an event listener
document.querySelector(".close").addEventListener("click", e=>{
    document.querySelector(".left").style.left = "-150%";
})

// add an event listener to previous
previous.addEventListener("click",e=>{
    console.log("previous click");
 let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    // console.log(currentsong.src.split("/").slice(-1)[0]);
    if((index-1)  >= 0){
        playmusic(songs[index-1]);
    }
})

// add an event listener to next
next.addEventListener("click",e=>{
    console.log("next click");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    // console.log(currentsong.src.split("/").slice(-1)[0]);
    if((index+1) < songs.length){
        playmusic(songs[index+1]);
    }
    // console.log(songs , index)
})
    // add event listener to range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value) / 100;
    })

//   load the playlist whenever card is clicked..
// Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     e.addEventListener("click", async item=>{
//         console.log(item,item.currentTarget.dataset)
//         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
//     })
// })

// add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg");
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg");
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})



}             



main()


    // var audio = new Audio(songs[0]);
    // audio.play();

//     audio.addEventListener("loadeddata", () => {
//    console.log(audio.duration, audio.currentSrc, audio.currentTime)
//     })

// const name = 'John Doe';
// const age = 20;

// // Using template literals for string interpolation
// console.log(`My name is ${name} and I'm ${age} years old.`);