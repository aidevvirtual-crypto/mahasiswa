<?php
// Proxy to Node.js app on port 4321
$host = '127.0.0.1';
$port = 4321;
$path = $_SERVER['REQUEST_URI'];
$query = $_SERVER['QUERY_STRING'];

$url = 'http://' . $host . ':' . $port . $path;
if ($query) $url .= '?' . $query;

// For API calls, use curl
if (strpos($path, '/api/') === 0) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    http_response_code($httpCode);
    echo $response;
    exit;
}

// For regular pages, redirect
header('Location: ' . $url);
exit;
?>