<?php

namespace App\Http\Controllers\Emergency;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Emergency\EmergencyContact;

class EmergencyContactController extends Controller
{
    public function index(){
        return Inertia::render('Dashboard/Admin/Emergency/Index');
    }


    public function create(){
        return Inertia::render('Dashboard/Admin/Emergecy/Index');
    }

    public function store(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
        ]);

        // Create a new emergency contact record
        $emergencyContact = EmergencyContact::create([
            'name' => $validated['name'],
            'contact' => $validated['contact'],
        ]);

        // Return a response, for example:
        return response()->json([
            'message' => 'Emergency contact created successfully!',
            'data' => $emergencyContact
        ], 201);
    }


    public function update(Request $request, $id)
{
    // Validate the incoming data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'contact' => 'required|string|max:255',
    ]);

    // Find the emergency contact by ID
    $emergencyContact = EmergencyContact::find($id);

    if (!$emergencyContact) {
        // If the emergency contact is not found, return an error response
        return response()->json([
            'message' => 'Emergency contact not found.'
        ], 404);
    }

    // Update the emergency contact record
    $emergencyContact->name = $validated['name'];
    $emergencyContact->contact = $validated['contact'];
    $emergencyContact->save();

    // Return a response
    return response()->json([
        'message' => 'Emergency contact updated successfully!',
        'data' => $emergencyContact
    ], 200);
}

}
