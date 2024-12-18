import React, { useRef, useCallback } from "react"
import ReactWebcam from "react-webcam" // Ubah nama import di sini
import { Button } from "@/Components/ui/button"
import { Camera } from "lucide-react"

const WebcamComponent = ({ onCapture, isActive, setIsActive }) => {
  const webcamRef = useRef(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      setIsActive(false)
    }
  }, [onCapture, setIsActive])

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
      />
      <Button
        onClick={capture}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <Camera className="mr-2 h-4 w-4" /> Capture
      </Button>
    </div>
  )
}

export default WebcamComponent
