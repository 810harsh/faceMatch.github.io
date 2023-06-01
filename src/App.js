import { useRef, useEffect } from "react";

// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/tfjs
// this also need to add as dependency   @mediapipe/face_mesh
//  use yarn add ... to add any of the dependency .........................

import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import '@tensorflow/tfjs-backend-webgl';
import Webcam from "react-webcam";

import { drawMesh } from "./utilities";
import "./App.css";

// code for capture the picture .....
// const videoConstraints = {
//   width: 220,
//   height: 200,
//   facingMode: "user"
// }

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // const [image, setImage] = useState('');

  // code for capture the picture .....
  // const capture = React.useCallback(() => {
  //   const imgeSrc = webcamRef.current.getScreenshot();
  //   setImage(imgeSrc);
  // }, [webcamRef])

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   capture();
  // }
  




  const runFaceMesh = async () => {
    const model = facemesh.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    };

    // const ctx = canvasRef.current.getContext("2d");
    // const circle = new Path2D();
    // circle.arc(350, 200, 160, 0, 2 * Math.PI, true);
    // ctx.strokeStyle = "red";
    // ctx.stroke(circle);

    const detector = await facemesh.createDetector(model, detectorConfig);
    setInterval(() => {
      detect(detector);
    }, 10);
  };

  const detect = async (detector) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");
      // const circle = new Path2D();
      // circle.arc(350, 200, 160, 0, 2 * Math.PI, true);
      // ctx.strokeStyle = "red";
      // ctx.stroke(circle);

      const face = await detector.estimateFaces(video);

      // const running = await

      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
    }
  };

  useEffect(() => {
    runFaceMesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}

          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}


        />
      </header>
    </div>
  );
}

export default App;