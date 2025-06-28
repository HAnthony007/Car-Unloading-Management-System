<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255' ],
            'email'=> ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'=> ['required', 'confirmed', 'min:8'],
            ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            "success" => true,
            "message" => "User registered successfully",
            "user" => $user,
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json([
                "success" => true,
                "message" => "User logged in successfully",
                "user" => Auth::user(),
            ]);
        }
        
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function logout(Request $request)
    {
        if (!Auth::check()) {
            throw ValidationException::withMessages([
                'logout' => ['No user is currently logged in.'],
                ]);
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            "success" => true,
            "message" => "User logged out successfully",
        ]);
    }
}
