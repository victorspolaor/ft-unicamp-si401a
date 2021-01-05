<?php

try {
    $conn = new PDO("mysql:host=localhost;dbname=", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    $sql = "insert into tetris.users value ('{$username}', '{$pwd}')";
    $conn->exec($sql);

} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error', true, 500);
    echo "Erro: " . $e->getMessage();
}
