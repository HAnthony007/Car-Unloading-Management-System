<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Enable stateful API so Sanctum can use cookie-based session auth for SPA requests
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return structured JSON for API routes
        $asJson = static function ($request): bool {
            return $request->expectsJson() || $request->is('api/*');
        };

        // 401: Unauthenticated
        $exceptions->render(function (AuthenticationException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'error' => [
                        'code' => 401,
                        'message' => 'Unauthenticated.',
                    ],
                ], 401);
            }
        });

        // 405: Method Not Allowed
        $exceptions->render(function (MethodNotAllowedHttpException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                $headers = $e->getHeaders();
                $allow = $headers['Allow'] ?? null;

                return response()->json([
                    'error' => [
                        'code' => 405,
                        'message' => 'Method Not Allowed.',
                        'allowed' => $allow,
                    ],
                ], 405, $headers);
            }
        });

        // 404: Not Found
        $exceptions->render(function (NotFoundHttpException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'error' => [
                        'code' => 404,
                        'message' => 'Not Found.',
                    ],
                ], 404);
            }
        });
    })->create();
