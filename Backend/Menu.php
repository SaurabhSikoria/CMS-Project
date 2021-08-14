<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Header: *");
function get_data() {
 include_once 'uploads/dbconn.php';

 $sql = "select *, o.restaurant as rest_name from cms.menu as m join cms.owner as o on m.restaurant = owner_id;";
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
         'rest_id' => $row['restaurant'],
         'rest_name' => $row['rest_name']
     );
 }
    $data = array('dishes' => $menu);
 return json_encode($data);
}
print_r(get_data());
?>