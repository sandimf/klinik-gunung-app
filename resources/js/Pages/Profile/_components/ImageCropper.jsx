import { Button } from '@/Components/ui/button';
import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from "sonner";
import { CheckCircle2 } from 'lucide-react';
export function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState();
  const imageRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height, 300); // Limit crop size to 300px
    const crop = {
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: (width - cropSize) / 2,
      y: (height - cropSize) / 2
    };
    setCrop(crop);
  }

  function getCroppedImg(image, crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  async function handleCropComplete() {
    if (imageRef.current && crop) {
        const croppedImage = await getCroppedImg(imageRef.current, crop);
    
        // Convert Blob to a File object
        const file = new File([croppedImage], "avatar.jpg", { type: "image/jpeg" });
    
        // Pass the cropped file to the parent component
        onCropComplete(file);

        // Show a success toast after cropping
        toast.success("Image cropped successfully!", {
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
    }
}
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          circularCrop
        >
          <img 
            ref={imageRef} 
            src={imageSrc || "/placeholder.svg"} 
            onLoad={onImageLoad} 
            alt="Crop preview" 
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
          />
        </ReactCrop>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={handleCropComplete}>Crop</Button>
        </div>
      </div>
    </div>
  );
}

