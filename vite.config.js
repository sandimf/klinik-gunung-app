import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        https: true
},
});
