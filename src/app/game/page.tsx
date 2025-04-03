"use client";

import React, { useState, useEffect } from 'react';

const initialPacManPosition = { x: 1, y: 1 };
const initialDirection = 'right';

const initialGhosts = [
    { x: 7, y: 6 },
    { x: 8, y: 6 },
    { x: 9, y: 6 },
];

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

const distance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const isWall = (x, y) => labyrinth[y] && labyrinth[y][x] === 1;

const GamePage = () => {
    const [pacMan, setPacMan] = useState(initialPacManPosition);
    const [ghosts, setGhosts] = useState(initialGhosts);
    const [isGameOver, setIsGameOver] = useState(false);

    const movePacMan = (dx, dy) => {
        const newX = pacMan.x + dx;
        const newY = pacMan.y + dy;

        if (!isWall(newX, newY)) {
            setPacMan({ x: newX, y: newY });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isGameOver) return;

            switch (event.key) {
                case "ArrowUp":
                    movePacMan(0, -1);
                    break;
                case "ArrowDown":
                    movePacMan(0, 1);
                    break;
                case "ArrowLeft":
                    movePacMan(-1, 0);
                    break;
                case "ArrowRight":
                    movePacMan(1, 0);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [pacMan, isGameOver]);

    useEffect(() => {
        const moveGhosts = () => {
            setGhosts(prevGhosts =>
                prevGhosts.map(ghost => {
                    const moves = [
                        { x: ghost.x, y: ghost.y - 1 },
                        { x: ghost.x, y: ghost.y + 1 },
                        { x: ghost.x - 1, y: ghost.y },
                        { x: ghost.x + 1, y: ghost.y }
                    ].filter(move => !isWall(move.x, move.y));

                    const bestMove = moves.reduce((acc, move) =>
                            distance(move.x, move.y, pacMan.x, pacMan.y) <
                            distance(acc.x, acc.y, pacMan.x, pacMan.y) ? move : acc
                        , moves[0]);

                    if (bestMove.x === pacMan.x && bestMove.y === pacMan.y) {
                        setIsGameOver(true);
                    }

                    return bestMove;
                })
            );
        };

        if (!isGameOver) {
            const interval = setInterval(moveGhosts, 300);
            return () => clearInterval(interval);
        }
    }, [pacMan, isGameOver]);

    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center bg-black outline-none">
            <div className="grid grid-cols-16 gap-1">
                {labyrinth.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isGhost = ghosts.some(ghost => ghost.x === colIndex && ghost.y === rowIndex);
                        const isPacMan = pacMan.x === colIndex && pacMan.y === rowIndex;

                        return (
                            <div key={`${rowIndex}-${colIndex}`} className="w-6 h-6 relative">
                                {isGhost && (
                                    <div className="ghost">
                                        <div className="eyes">
                                            <div className="eye"></div>
                                            <div className="eye"></div>
                                        </div>
                                    </div>
                                )}
                                {isPacMan && (
                                    <div className="pacman">
                                        <div className="eyes">
                                            <div className="eye"></div>
                                            <div className="eye"></div>
                                        </div>
                                    </div>
                                )}
                                {cell === 1 && <div className="w-full h-full bg-green-500"></div>}
                            </div>
                        );
                    })
                )}
            </div>
            {isGameOver && <div className="text-red-700 mt-4">Game Over! Refresh to play again.</div>}
        </main>
    );
};

export default GamePage;
