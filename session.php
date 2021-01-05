<?php
session_start();

if (isset($_SESSION["username"])){
    $json = array(
        'username:' => $_SESSION["username"]
    );
    $json_string = json_encode($json);
    echo $json_string;
} else {
    header('HTTP/1.1 401 Unauthorized', true, 401);
}
