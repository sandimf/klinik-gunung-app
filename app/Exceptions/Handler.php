<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
   public function render($request, Throwable $exception)
{
    $response = parent::render($request, $exception);

    if ($request->header('X-Inertia') && in_array($response->status(), [500, 503, 404, 403])) {
        return Inertia::render('Errors/Error', ['status' => $response->status()])
            ->toResponse($request)
            ->setStatusCode($response->status());
    }

    return $response;
}
}