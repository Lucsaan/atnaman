"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const gridSize = 16;
const initialPacManPosition = { x: 1, y: 1 };

const labyrinth = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 2, 0, 2, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 2, 2, 2, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const initialGhosts = [
    { x: 7, y: 6 },
    { x: 8, y: 6 },
    { x: 9, y: 6 },
];

const GamePage = () => {
    const [pacManPosition, setPacManPosition] = useState(initialPacManPosition);
    const [ghosts, setGhosts] = useState(initialGhosts);

    const isWall = (x, y) => labyrinth[y] && labyrinth[y][x] === 1;

    const handleKeyDown = (e) => {
        const { x, y } = pacManPosition;
        let newPosition = { x, y };

        if (e.key === 'ArrowUp' && !isWall(x, y - 1)) newPosition.y--;
        if (e.key === 'ArrowDown' && !isWall(x, y + 1)) newPosition.y++;
        if (e.key === 'ArrowLeft' && !isWall(x - 1, y)) newPosition.x--;
        if (e.key === 'ArrowRight' && !isWall(x + 1, y)) newPosition.x++;

        setPacManPosition(newPosition);
    };

    useEffect(() => {
        const moveGhosts = () => {
            setGhosts(prevGhosts => prevGhosts.map(ghost => {
                const directions = ['up', 'down', 'left', 'right'];
                const direction = directions[Math.floor(Math.random() * directions.length)];
                let { x, y } = ghost;

                if (direction === 'up' && !isWall(x, y - 1)) y--;
                if (direction === 'down' && !isWall(x, y + 1)) y++;
                if (direction === 'left' && !isWall(x - 1, y)) x--;
                if (direction === 'right' && !isWall(x + 1, y)) x++;

                return { x, y };
            }));
        };

        const interval = setInterval(moveGhosts, 500);
        return () => clearInterval(interval);
    }, [ghosts]);

    return (
        <main
            className="h-screen w-screen flex flex-col items-center justify-center bg-black outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="grid grid-cols-16 gap-1">
                {labyrinth.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isGhost = ghosts.some(ghost => ghost.x === colIndex && ghost.y === rowIndex);
                        const isPacMan = pacManPosition.x === colIndex && pacManPosition.y === rowIndex;

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-6 h-6 relative ${isGhost || isPacMan ? '' : 'bg-gray-800'}`}
                            >
                                {isGhost && (
                                    <div className="ghost">
                                        <div className="eyes">
                                            <div className="eye"></div>
                                            <div className="eye"></div>
                                        </div>
                                    </div>
                                )}
                                {isPacMan && <div className="w-full h-full bg-yellow-400"></div>}
                                {cell === 1 && <div className="w-full h-full bg-green-500"></div>}
                                {cell === 2 && <div className="w-full h-full bg-gray-700"></div>}
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}

export default GamePage;
