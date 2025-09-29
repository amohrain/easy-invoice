import React from "react";

function Video() {
  return (
    <section
      id="how-it-works"
      className="min-h-screen w-full flex flex-col items-center justify-center gap-8 p-4 pt-12 sm:px-4 sm:py-24"
    >
      <div className="section-heading">
        <h2 className="section-title">Send invoices and the good vibes</h2>
        <p className="section-description italic mt-5">
          See vibe invoice in action
        </p>
      </div>
      <div className="mockup-browser w-full max-w-4xl p-4 vibe-opacity rounded-2xl shadow-2xl">
        <div className="mockup-browser-toolbar ml-[-16px]"></div>
        <div className="relative w-full aspect-video overflow-hidden sm:rounded-lg">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/9md6gJLfPlI?si=9Gv3FllpA-eutXEA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Video;
