<?php

try {
    $conn = new PDO("mysql:host=localhost;dbname=", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->query("select * from tetris.top_score");

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $json_string = json_encode($result);
    echo $json_string;

} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error', true, 500);
    echo "Connection error: " . $e->getMessage();
}
