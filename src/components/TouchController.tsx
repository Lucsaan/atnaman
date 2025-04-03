"use client";

import React, { useEffect } from 'react';

interface TouchControllerProps {
    onMove: (direction: string) => void;
}

const TouchController: React.FC<TouchControllerProps> = ({ onMove }) => {

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const x = touch.clientX;
                const y = touch.clientY;

                const width = window.innerWidth;
                const height = window.innerHeight;

                const yRatio = y / height;

                if (yRatio > 0.8) {  // Nur aktivieren, wenn unten auf dem Bildschirm berührt wird
                    const middleX = width / 2;
                    const middleY = height * 0.9;

                    const dx = x - middleX;
                    const dy = y - middleY;

                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx > 0) onMove("right");
                        else onMove("left");
                    } else {
                        if (dy > 0) onMove("down");
                        else onMove("up");
                    }
                }
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true }); // passive:true erlaubt weiterhin das Pull-to-Refresh
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, [onMove]);

    return null;  // Komplett unsichtbar und interagiert nur durch Touch-Events
};

export default TouchController;
