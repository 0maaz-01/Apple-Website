import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";


// to start playing the videos only when the user reaches the video section of the website
gsap.registerPlugin(ScrollTrigger);


const VideoCarousel = () => {
  // initially all these will contain an empty array as their initial values.
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);


  const [video, setVideo] = useState({
    // setting the initial values for the variables.
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  // extracting the values from the video variable with the help of useState.
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,    // move the current video 100% of the width of current video.
      duration: 2,                                    // move the video from the current to the next, the slider will take 2 seconds.
      ease: "power2.inOut", 
    });

    // video animation to play the video when it is in the view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",        // animation will be executed on the element with id = #video
        toggleActions: "restart none none none",     //  when this gsap.to is called (when isEnd or videoId changes) restart the animation from the beginning.
      },
      onComplete: () => {            // this function will start working after the animation is completed.
        setVideo((pre) => ({    
          ...pre,                 // keep all the arguements same as their previous values
          startPlay: true,        // change startPlay to true
          isPlaying: true,        // change isPlaying to true
        }));
      },
    });
  }, [isEnd, videoId]);       // when isEnd or videoId changes this gsap animation will be again executed


  // this will display the animation that represents the time covered in the progress bar.
  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;  // whenever the function is called take the span of the current video.

    if (span[videoId]) {
      // animation to move the indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]); 


  // this hook is responsible for playing the videos.
  useEffect(() => {
    
    if (loadedData.length > 3) {
      // if the user has clicked on the pause button or all the video has played, then pause playing the videos.
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } 
      // else if the pause button is not clicked by the user nor he has reached the end of all the videos then keep on playing the videos.
      else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);    // this effect will be executed when one of these dependencies changes.

  

  // vd id is the id for every video until id becomes number 3
  const handleProcess = (type, i) => {
    switch (type) {
      // if the type = video-end then take the previous states (pre) keep all the arguements same as the previous state but change the isEnd and videoId arguement
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;
      
      // if type = video-last, keep isLastVideo: true
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      
      // if type = video-reset, videoId: 0, isLastVideo: false 
      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      // if type = pause, then keep isPlaying opposite of its previous values
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying : !pre.isPlaying }));
        break;

      // if type = play, then keep isPlaying opposite of its previous values
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      
      // if all other cases just simply return the video.
      default:
        return video;
    }
  };


  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
          {/*highlight slides contains the text, ref, etc of the video to be displayed.*/}
          {hightlightsSlides.map((list, i) => (                           // list represents each item in the highlight slides
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
              <div className="video-carousel_container">
                  <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                      <video
                          id="video"
                          playsInline={true}      // If you add the playsInline attribute to the <video> tag, it prevents the video from 
                                                  // automatically going into full-screen mode. Instead, the video will play directly within 
                                                  // the webpage (inline), allowing the user to interact with other content on the page while
                                                  //  the video plays.
                          
                          // If list.id === 2 is true, the result of this expression is "translate-x-44" else doesn't apply any class.
                          // pointer-events-none will always be applied.
                          className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}

                          // to load the entire media file as soon as the page loads. This ensures that the media is ready to play without 
                          // buffering when the user clicks play.
                          preload="auto"            
                          muted
                          ref={(el) => (videoRef.current[i] = el)}
                              onEnded={() =>
                                i !== 3
                                  ? handleProcess("video-end", i)
                                  : handleProcess("video-last")
                              }
                              onPlay={() =>
                                setVideo((pre) => ({ ...pre, isPlaying: true }))
                              }
                              onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                        >
                          {/*setting the source for the video file*/}
                          <source src={list.video} type="video/mp4" />
                    </video>
                </div>
                  
                  {/*display the text on the videos*/}
                  <div className="absolute top-12 left-[5%] z-10">
                    {list.textLists.map((text, i) => (
                        <p key={i} className="md:text-2xl text-xl font-medium">
                          {text}
                        </p>
                    ))}
                  </div>
              </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
          {/*to display the amount of duration covered in the video*/}
          <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                  {videoRef.current.map((_, i) => (
                      <span
                      key={i}
                      className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                      ref={(el) => (videoDivRef.current[i] = el)}>
                          <span
                            className="absolute h-full w-full rounded-full"
                            ref={(el) => (videoSpanRef.current[i] = el)}
                          />
                      </span>
                  ))}
              </div>
          
          {/*To add the play and pause button*/}
          <button className="control-btn">
              {/*To display the image on the button.*/}
              <img
                  // 
                  src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                  alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                  onClick={
                    isLastVideo 
                        // if last video then call handleProcess 
                        ? () => handleProcess("video-reset") 
                        
                        // if not last video 
                        : !isPlaying
                        
                        // if not isPlaying
                        ? () => handleProcess("play") 
                        // if is playing
                        : () => handleProcess("pause")
                  }
              />
          </button>





      </div>
    </>
  );
};

export default VideoCarousel;
