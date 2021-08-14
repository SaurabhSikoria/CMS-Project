<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        {
        header("Access-Control-Allow-Methods: GET, PUT, PATCH, DELETE, POST, OPTIONS");         
        echo 'first ran';
        }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
    {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        echo 'second ran';
    }
    exit(0);
}  
include 'uploads/dbconn.php';
if($_SERVER['REQUEST_METHOD'] === 'GET'  && isset($_SERVER["QUERY_STRING"]) && !isset($_GET['DelieveryId'])) {
    $sql = 'select * from orders as e join menu as m using (id) where m.restaurant = '.$_SERVER['QUERY_STRING'].' AND stats = "unaccepted"';
    $result = mysqli_query($conn, $sql);
    if($result){
        $order = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $total = $row['quantity'] * $row['price'];
            $plate ='';
            if($row['price'] == $row['full'])
            $plate = 'Half Plate';
            else if($row['price'] == $row['half'])
            $plate = 'Full Plate';
            $order[] = array(
                'order_id' => $row['orderId'],
                'image' => $row['image'],
                'dish_name' => $row['dish_name'],
                'custName' => $row['customerName'],
                'quantity' => $row['quantity'],
                'veg' => $row['veg'],
                'plate' => $plate,
                'price' => $total
            );
        }
        print_r(json_encode($order));
    } else echo 'Unable to connect to database of orders';
} else if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['DelieveryId'])) {
    $sql = 'select * from orders as e join menu as m using (id) where m.restaurant = '.$_GET['DelieveryId'].' AND stats = "accepted"';
    $result = mysqli_query($conn, $sql);
    if($result){
        $order = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $total = $row['quantity'] * $row['price'];
            $plate ='';
            if($row['price'] == $row['full'])
            $plate = 'Half Plate';
            else if($row['price'] == $row['half'])
            $plate = 'Full Plate';
            $order[] = array(
                'order_id' => $row['orderId'],
                'image' => $row['image'],
                'dish_name' => $row['dish_name'],
                'custName' => $row['customerName'],
                'quantity' => $row['quantity'],
                'veg' => $row['veg'],
                'plate' => $plate,
                'price' => $total
            );
        }
        print_r(json_encode($order));
    } else echo 'Unable to connect to database';
} else if($_SERVER['REQUEST_METHOD'] === 'PATCH' && isset($_REQUEST['accept'])){
    $sql = 'update cms.orders set stats = "accepted" where orderId = '.$_REQUEST['accept'];
    if(mysqli_query($conn, $sql))
    echo 'This order is Accepted';
    else echo 'This order database is unable to connect';
} else if($_SERVER['REQUEST_METHOD'] === 'PATCH' && isset($_REQUEST['denied'])){
    $sql = 'update cms.orders set stats="rejected" where orderId = '.$_REQUEST['denied'].';';
    if(mysqli_query($conn, $sql))
    echo 'This order is rejected';
    else echo mysqli_error($conn);
}
?>