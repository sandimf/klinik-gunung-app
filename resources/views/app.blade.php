<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Klinik Gunung') }}</title>
        <!-- Fonts -->
          <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"> <!-- fallback Inter -->
        <style>
          @font-face {
            font-family: 'Mona Sans';
            src: url('https://github.githubassets.com/assets/Mona-Sans.woff2') format('woff2');
            font-weight: 100 1000;
            font-display: swap;
          }
        </style>
        
        <!-- Favicon -->
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
