import {useEffect, useRef, useState} from "react";

function Video() {
  const videoRef = useRef(null);

  return (
    <div className="flex flex-col">
      <div className="my-auto">
        <video ref={videoRef} autoPlay controls muted>
          <source type="video/mp4" src="/test.mp4"></source>
        </video>

        {/* <h2 className="text-sm">{videoTime} + current time</h2> */}
      </div>
    </div>
  );
}

export default Video;
