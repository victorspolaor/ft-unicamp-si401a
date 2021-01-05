<?php

try {
    $conn = new PDO("mysql:host=localhost;dbname=", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Conexão estabelecida.";
} catch (PDOException $e) {
    echo "Erro ao acessar servidor!";
}
