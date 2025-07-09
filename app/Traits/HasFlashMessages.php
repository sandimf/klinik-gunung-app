<?php

namespace App\Traits;

use Illuminate\Http\RedirectResponse;

trait HasFlashMessages
{
    /**
     * Flash success message
     */
    protected function flashSuccess(string $message, ?string $route = null): RedirectResponse
    {
        $redirect = $route ? redirect()->route($route) : back();

        return $redirect->with('success', $message);
    }

    /**
     * Flash error message
     */
    protected function flashError(string $message, ?string $route = null): RedirectResponse
    {
        $redirect = $route ? redirect()->route($route) : back();

        return $redirect->with('error', $message);
    }

    /**
     * Flash warning message
     */
    protected function flashWarning(string $message, ?string $route = null): RedirectResponse
    {
        $redirect = $route ? redirect()->route($route) : back();

        return $redirect->with('warning', $message);
    }

    /**
     * Flash info message
     */
    protected function flashInfo(string $message, ?string $route = null): RedirectResponse
    {
        $redirect = $route ? redirect()->route($route) : back();

        return $redirect->with('info', $message);
    }
}
