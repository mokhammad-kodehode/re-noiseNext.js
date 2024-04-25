"use client"



export interface SoundData {
    title: string;
    soundSource: string;
    videoSource: string;
    imageSource:string;
}

const videoData :  {[key:string]: SoundData} = {
      bonfire: {
        title: "Fireplace",
        soundSource: "sounds/bonfire.wav",
        videoSource: "videos/bonfire.mp4",
        imageSource: "images/fire.png",
      },
      rain_thunder: {
        title: "Thunderstorm",
        soundSource: "sounds/thunderstorm.wav",
        videoSource: "videos/thunder.mp4",
        imageSource: "images/rain.jpg",
      },
      rain: {
        title: "Rain",
        soundSource: "sounds/rain.wav",
        videoSource: "videos/Raindrops.mp4",
        imageSource: "images/rain.jpg",
      },
      forest: {
        title: "Forest",
        soundSource: "sounds/forest.wav",
        videoSource: "videos/forest.mp4",
        imageSource: "images/forest.jpg",
      },
};

export default videoData;