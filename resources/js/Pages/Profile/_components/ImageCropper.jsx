import { Button } from "@/Components/ui/button";
import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
export function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState();
    const imageRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const cropSize = Math.min(width, height, 300);
        const crop = {
            unit: "px",
            width: cropSize,
            height: cropSize,
            x: (width - cropSize) / 2,
            y: (height - cropSize) / 2,
        };
        setCrop(crop);
    }

    function getCroppedImg(image, crop) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

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
            }, "image/jpeg");
        });
    }

    async function handleCropComplete() {
        if (imageRef.current && crop) {
            const croppedImage = await getCroppedImg(imageRef.current, crop);

            const file = new File([croppedImage], "avatar.jpg", {
                type: "image/jpeg",
            });

            onCropComplete(file);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="p-4 bg-white rounded-lg"
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            >
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
                        style={{ maxWidth: "100%", maxHeight: "70vh" }}
                    />
                </ReactCrop>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button onClick={onCancel}>Batal</Button>
                    <Button onClick={handleCropComplete}>Crop</Button>
                </div>
            </div>
        </div>
    );
}
