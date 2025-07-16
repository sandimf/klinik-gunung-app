import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './resources/js/**/*.jsx',
        './resources/js/**/*.ts',
        './resources/js/**/*.tsx',
    ],
    plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
    theme: {
        extend: {
            colors: {
                'muted-foreground': '#6b7280', // contoh gray-500
            }
        }
    }
};
