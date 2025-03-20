import { heroVideo, smallHeroVideo } from '../utils';
import { useEffect, useState } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const Hero = () => {
  // set the initial value of videoSrc variable according to the screen size of the user.
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

  // the initial size for the screen is set but the user can resize the browser in that scenario this function will be used.
  const handleVideoSrcSet = () => {
    if(window.innerWidth < 760) {   
        setVideoSrc(smallHeroVideo)   
    } 
    else {
        setVideoSrc(heroVideo)
    }
  }

  // when a user resizes the screen this event listener will adjust the website layout according to the screen.
  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    // after resizing we will remove the event listener for keeping the website responsive.
    return () => {
      window.removeEventListener('resize', handleVideoSrcSet)
    }
  }, [])

  
  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2 })          // show the element with id = "#hero" on the screen after 2 seconds
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })   // show the element with id = "#cta" on the screen after 2 seconds and also move it -50 pixels in the vertical direction
  }, [])

  return (
    <section className="w-full nav-height bg-black relative">
        <div className="h-5/6 w-full flex-center flex-col">
            <p id="hero" className="hero-title">iPhone 15 Pro</p>
            {/*To add the horizontal iphone video on the website.*/}
            <div className="md:w-10/12 w-9/12">
                <video className="pointer-events-none" autoPlay loop muted playsInline={true} key={videoSrc}>
                    <source src={videoSrc} type="video/mp4" />
                </video>
            </div>
        </div>

        {/*To add the buy button and the text below it.*/}
        <div
            id="cta"
            className="flex flex-col items-center opacity-0 translate-y-20">
            
            <a href="#highlights" className="btn">Buy</a>
            <p className="font-normal text-xl">From $199/month or $999</p>
        </div>
    </section>
  )
}

export default Hero