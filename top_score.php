<?php
session_start();

try {
    $conn = new PDO("mysql:host=localhost;dbname=", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $username = $_SESSION["username"];
    $score = $_POST["score"];

    $stmt = $conn->query("select * from tetris.top_score where username = '{$username}'");

    if ($stmt->rowCount() > 0) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (isset($result['score'])) {
            $prev_score = $result['score'];
            if ($score > $prev_score) {
                $sql = "update tetris.top_score set score='{$score}' where username = '{$username}'";
                $conn->exec($sql);
            }
        }
    } else {
        $sql = "insert into tetris.top_score value ('{$username}', '{$score}')";
        $conn->exec($sql);
    }

} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error', true, 500);
    echo "Connection error: " . $e->getMessage();
}
