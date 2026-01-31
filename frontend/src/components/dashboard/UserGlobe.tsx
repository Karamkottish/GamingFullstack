"use client"
import createGlobe from "cobe"
import { useEffect, useRef } from "react"

export function UserGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        let phi = 0

        if (!canvasRef.current) return

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.1, 0.1, 0.1], // Dark gray base
            markerColor: [0.5, 0.2, 0.9], // Violet markers
            glowColor: [0.2, 0.05, 0.4], // Violet glow
            markers: [
                // longitude latitude
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [51.5, -0.12], size: 0.05 },
                { location: [35.6895, 139.6917], size: 0.07 },
                { location: [-33.8688, 151.2093], size: 0.04 },
                { location: [-23.5505, -46.6333], size: 0.06 },
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi
                phi += 0.01
            },
        })

        return () => {
            globe.destroy()
        }
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            />
            <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-xs font-mono text-primary font-bold">LIVE NETWORK</span>
                </div>
            </div>
        </div>
    )
}
