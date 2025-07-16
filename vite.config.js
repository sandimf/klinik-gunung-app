import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),

        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@components': path.resolve(__dirname, './resources/js/Components'),
            '@utils': path.resolve(__dirname, './resources/js/Utils'),
            '@ui': path.resolve(__dirname, './resources/js/Components/ui'),
            'ziggy-js': path.resolve(__dirname, './vendor/tightenco/ziggy'),
        },

    },

    server: {
        // Ngork set up
        //     host: 'localhost',
        //     port: 5173,
        //     https: {
        //         key: fs.readFileSync('../cert/vite.key'),
        //         cert: fs.readFileSync('../cert/vite.crt'),
        //     },
        //     hmr: {
        //         protocol: 'wss', // ← pakai WSS (karena HTTPS)
        //         host: 'localhost',
        //         clientPort: 443,
        //     },
        //     cors: true,
        // },
        cors: true,
    },
});
