"use client";

import React, { useState, useEffect } from 'react';

const initialPacManPosition = { x: 1, y: 1 };
const initialDirection = 'right';

const initialGhosts = [
    { x: 7, y: 6 },
    { x: 8, y: 6 },
    { x: 9, y: 6 },
];

const generateRandomLabyrinth = (rows, cols) => {
    const labyrinth = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => {
            if (rowIndex === 0 || rowIndex === rows - 1 || colIndex === 0 || colIndex === cols - 1) {
                return 1; // Äußere Wände
            }
            return 1; // Innen wird später freigeräumt
        })
    );

    // Depth-First Search (DFS) für Labyrinth-Erstellung mit garantierten Wegen
    const carvePath = (x, y) => {
        const directions = [
            [0, -1], // oben
            [0, 1],  // unten
            [-1, 0], // links
            [1, 0],  // rechts
        ].sort(() => Math.random() - 0.5); // Zufällig mischen

        labyrinth[y][x] = 0; // Setze diesen Punkt als Weg

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            if (ny > 0 && ny < rows - 1 && nx > 0 && nx < cols - 1 && labyrinth[ny][nx] === 1) {
                labyrinth[y + dy][x + dx] = 0; // Zwischenfeld freimachen
                carvePath(nx, ny);
            }
        }
    };

    // Starte das Labyrinth von der Mitte
    carvePath(1, 1);

    // Öffne zufällig zusätzliche Wege für mehr Ausweichmöglichkeiten
    for (let i = 0; i < Math.floor((rows * cols) / 5); i++) {
        const x = Math.floor(Math.random() * (cols - 2)) + 1;
        const y = Math.floor(Math.random() * (rows - 2)) + 1;
        labyrinth[y][x] = 0; // Freies Feld hinzufügen
    }

    // Setze Startpositionen
    labyrinth[1][1] = 0; // Pac-Man Startpunkt
    labyrinth[6][7] = 0; // Ghost 1
    labyrinth[6][8] = 0; // Ghost 2
    labyrinth[6][9] = 0; // Ghost 3

    return labyrinth;
};



const distance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const isWall = (x, y, labyrinth) => labyrinth[y] && labyrinth[y][x] === 1;

const GamePage = () => {
    const [pacMan, setPacMan] = useState(initialPacManPosition);
    const [ghosts, setGhosts] = useState(initialGhosts);
    const [isGameOver, setIsGameOver] = useState(false);
    const [points, setPoints] = useState(new Set());
    const [score, setScore] = useState(0);
    const [labyrinth, setLabyrinth] = useState(generateRandomLabyrinth(13, 16));

    useEffect(() => {
        const initialPoints = new Set();
        labyrinth.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) initialPoints.add(`${x},${y}`);
            });
        });
        setPoints(initialPoints);
    }, []);

    const movePacMan = (dx, dy) => {
        const newX = pacMan.x + dx;
        const newY = pacMan.y + dy;

        if (!isWall(newX, newY, labyrinth)) {
            const newPosition = `${newX},${newY}`;
            if (points.has(newPosition)) {
                setPoints(prev => {
                    const updatedPoints = new Set(prev);
                    updatedPoints.delete(newPosition);
                    return updatedPoints;
                });
                setScore(prevScore => prevScore + 10);
            }

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
                    ].filter(move => !isWall(move.x, move.y, labyrinth));

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
            <div className="text-white mb-4">Score: {score}</div>
            <div className="grid grid-cols-16 gap-1">
                {labyrinth.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isGhost = ghosts.some(ghost => ghost.x === colIndex && ghost.y === rowIndex);
                        const isPacMan = pacMan.x === colIndex && pacMan.y === rowIndex;
                        const hasPoint = points.has(`${colIndex},${rowIndex}`);

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
                                {hasPoint && <div className="w-2 h-2 bg-yellow-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
                                {cell === 1 && <div className="w-full h-full bg-green-500"></div>}
                            </div>
                        );
                    })
                )}
            </div>
            {isGameOver && <div className="text-red-700 mt-4">Game Over! Refresh to play again.</div>}
        </main>
        // <main className="h-screen w-screen flex flex-col items-center justify-center bg-black outline-none">
        //     <div className="text-white mb-4">Score: {score}</div>
        //     <div className="grid grid-cols-16 gap-1">
        //         {labyrinth.map((row, rowIndex) =>
        //             row.map((cell, colIndex) => {
        //                 const isGhost = ghosts.some(ghost => ghost.x === colIndex && ghost.y === rowIndex);
        //                 const isPacMan = pacMan.x === colIndex && pacMan.y === rowIndex;
        //                 const hasPoint = points.has(`${colIndex},${rowIndex}`);
        //
        //                 return (
        //                     <div key={`${rowIndex}-${colIndex}`} className="w-6 h-6 relative">
        //                         {isGhost && <div className="ghost"></div>}
        //                         {isPacMan && <div className="pacman"></div>}
        //                         {hasPoint && <div className="w-2 h-2 bg-yellow-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
        //                         {cell === 1 && <div className="w-full h-full bg-green-500"></div>}
        //                     </div>
        //                 );
        //             })
        //         )}
        //     </div>
        //     {isGameOver && <div className="text-red-700 mt-4">Game Over! Refresh to play again.</div>}
        // </main>
    );
};


export default GamePage;
