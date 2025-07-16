'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/Components/ui/button'
import { Eraser } from 'lucide-react'

export default function SignatureInput({
    canvasRef: externalCanvasRef,
    onSignatureChange,
}) {
    const internalCanvasRef = useRef(null)
    // Untuk event handler, selalu pakai internalCanvasRef
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPosition, setLastPosition] = useState(null)

    useEffect(() => {
        const canvas = internalCanvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000000'
    }, [])

    const getPointerPosition = (e) => {
        const canvas = internalCanvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            }
        } else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }
    }

    const startDrawing = (e) => {
        e.preventDefault()
        setIsDrawing(true)
        const pos = getPointerPosition(e)
        setLastPosition(pos)
    }

    const stopDrawing = (e) => {
        if (!isDrawing) return
        setIsDrawing(false)
        setLastPosition(null)
        const canvas = internalCanvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            ctx.beginPath()
            const dataUrl = canvas.toDataURL()
            onSignatureChange(dataUrl)
        }
    }

    const draw = (e) => {
        if (!isDrawing) return
        e.preventDefault()
        const canvas = internalCanvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            const pos = getPointerPosition(e)
            if (lastPosition) {
                ctx.beginPath()
                ctx.moveTo(lastPosition.x, lastPosition.y)
                ctx.lineTo(pos.x, pos.y)
                ctx.stroke()
            }
            setLastPosition(pos)
        }
    }

    const clearSignature = () => {
        const canvas = internalCanvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            onSignatureChange(null)
        }
    }

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden relative w-[400px] h-[200px] bg-white">
            <canvas
                ref={internalCanvasRef}
                width={400}
                height={200}
                className="w-full h-full touch-none"
                style={{ background: 'transparent', display: 'block' }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
            />
            <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute left-1 bottom-1 z-10 rounded-full"
                onClick={clearSignature}
            >
                <Eraser className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
        </div>
    )
}
