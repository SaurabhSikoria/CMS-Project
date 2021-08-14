<?php

$dbServername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "cms";

$conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);
if(mysqli_connect_error())
{
    echo "ERROR: connection". mysqli_connect_error();
}
?>