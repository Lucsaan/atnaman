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

                const yRatio = y / height;  // Prüft nur den vertikalen Bereich des Touches

                if (yRatio > 0.8) {  // Nur sichtbar machen, wenn am unteren Rand des Bildschirms
                    const middleX = width / 2;
                    const middleY = height * 0.9; // 10% über dem unteren Rand

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

        window.addEventListener('touchstart', handleTouchStart);
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, [onMove]);

    return null;  // Return null because it's purely event-based
};

export default TouchController;
