<?php

try {
    $conn = new PDO("mysql:host=localhost;dbname=", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    $stmt = $conn->query("select * from tetris.users where username = '{$username}' and password = '{$pwd}'");
    if ($stmt->rowCount() === 0){
        header('HTTP/1.1 403 Forbidden', true, 403);
    } else {
        session_start();
        $_SESSION["username"] = $username;
    }

} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error', true, 500);
    echo "Connection error: " . $e->getMessage();
}
