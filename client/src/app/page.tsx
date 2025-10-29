"use client";

import Tabs from "../components/Tabs";
import React from "react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-black dark:to-red-950 p-6 sm:p-12">
            <header className="max-w-4xl mx-auto mb-8">
                <div className="text-center space-y-2">
                    <div className="inline-block bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h1 className="text-4xl font-bold flex items-center gap-2">
                             Spark Bytes!
                        </h1>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                        Share available food
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <Tabs />
            </main>

            <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                SparkBytes! 2025
            </footer>
        </div>
    );
}