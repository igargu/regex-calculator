<?php

// Send the HTTP request to the websockets server
$ch = curl_init('http://localhost:3000');

// It's POST
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

// Send JSON encoded data to the client
$json = json_encode([
	'name' => $name,
	'message' => $message
]);
$query = http_build_query(['data' => $json]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $query);

// Return the transfer
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute
$response = curl_exec($ch);

 // Close
curl_close($ch);
