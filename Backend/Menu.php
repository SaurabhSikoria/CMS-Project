<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Header: *");
 include 'uploads/dbconn.php';
if($_SERVER['REQUEST_METHOD'] === 'GET') {
 $sql = "select *, o.restaurant as rest_name, m.restaurant as rest_id from cms.menu as m join cms.owner as o on m.restaurant = owner_id;";
 $result = mysqli_query($conn, $sql);
 $menu = array();
 while($row = mysqli_fetch_assoc($result))
 {
     $menu[] = array (
         'dish_id' => $row['id'],
         'name' => $row['dish_name'],
         'price' => $row['full'],
         'half_price' => $row['half'],
         'image' => $row['image'],
         'veg' => $row['veg'],
         'rest_id' => $row['rest_id'],
         'rest_name' => $row['rest_name'],
     );
 }
    $data = array('dishes' => $menu);
    print_r(json_encode($data));
}
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $json = json_decode($data, true);
    foreach($json as $item){
        $sql = 'insert into cms.orders (id, price, quantity) values('.$item['dish_id'].','.$item['orderprice'].','.$item['amount'].');';
        if(mysqli_query($conn, $sql)) {
            echo 'Order Placed';
        } else {echo 'Failed to place the order';
        exit;}
    }
}
?>