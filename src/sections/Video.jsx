import React from "react";
import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";

function Video() {
  function togglePlay() {
    const video = document.getElementById("myVideo");
    const playButton = document.getElementById("playButton");
    if (video.paused) {
      video.play();
      video.controls = true;
      playButton.style.display = "none";
    } else {
      video.pause();
      playButton.style.display = "flex";
    }
  }

  return (
    <section
      id="how-it-works"
      className=" min-h-screen w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-24"
    >
      <div className="section-heading">
        <h2 className="section-title">Send invoices and the good vibes</h2>
        <p className="section-description italic mt-5">
          See vibe invoice in action
        </p>
      </div>
      <div className="relative w-full max-w-4xl aspect-video rounded-xl shadow-xl shadow-primary/20">
        <video
          download="false"
          muted
          id="myVideo"
          className="w-full h-full object-cover rounded-xl"
          poster="/product-screenshot.png"
        >
          <source src="/demo-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <button
          id="playButton"
          onClick={togglePlay}
          className="absolute inset-0 m-auto size-32 bg-black/60 rounded-full flex items-center justify-center cursor-pointer z-10"
        >
          <div className="">
            <Play className="text-white size-12 fill-white" />
          </div>
        </button>
      </div>
      <Link href="/playground">
        <button className="btn italic btn-ghost rounded-full btn-lg hover:bg-black hover:text-white hover:shadow-[0px_0px_20px_5px] shadow-primary/50 transition-all duration-300">
          Try our interactive demo/playground{" "}
          <ExternalLink className="size-4" />
        </button>
      </Link>
    </section>
  );
}

export default Video;
