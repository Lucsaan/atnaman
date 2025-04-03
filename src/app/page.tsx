"use client";

import Link from 'next/link';

const Home = () => {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-between bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 relative">

            <h1 className="text-4xl mt-10 bg-gradient-to-r from-sky-400 to-green-400 text-transparent bg-clip-text">
                Willkommen zu deinem ATNA-Man Spiel!
            </h1>

            {/* Button zum Spiel */}
            <Link href="/game">
                <button
                    className="bg-blue-400 text-black font-bold py-2 px-4 rounded-xl mb-10 hover:bg-green-400 transition relative"
                >
                    Spiel Starten
                </button>
            </Link>

            {/* Copyright Bereich */}
            <footer className="text-white text-sm mb-4">
                © {new Date().getFullYear()} Anni, Theresa, Nathalie und Andi. Alle Rechte vorbehalten.
            </footer>
        </main>
    );
}

export default Home;
