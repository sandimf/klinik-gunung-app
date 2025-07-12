import React, { useRef, useCallback, useState } from "react"
import ReactWebcam from "react-webcam"
import { Button } from "@/Components/ui/button"
import { Camera, Repeat } from "lucide-react"

const WebcamComponent = ({ onCapture, isActive, setIsActive }) => {
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState("environment") // default ke belakang

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      setIsActive(false)
    }
  }, [onCapture, setIsActive])

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  if (!isActive) {
    return null
  }

  return (
    <div className="relative">
      <ReactWebcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full rounded-lg"
        videoConstraints={{ facingMode }}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button onClick={capture}>
          <Camera className="mr-2 h-4 w-4" /> Capture
        </Button>
        <Button variant="outline" onClick={toggleFacingMode}>
          <Repeat className="mr-2 h-4 w-4" /> Ganti Kamera
        </Button>
      </div>
    </div>
  )
}

export default WebcamComponent
