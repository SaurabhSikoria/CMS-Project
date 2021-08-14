<?php   
include 'uploads/dbconn.php';
function cors() {
    
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    
    }
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            {
            header("Access-Control-Allow-Methods: GET, PUT, DELETE, POST, OPTIONS");         
            echo 'first ran';
            }
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        {
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            echo 'second ran';
        }
        exit(0);
    }   
}
cors();
if($_SERVER['REQUEST_METHOD'] === 'GET' && $_REQUEST['q'] != '') {
    
    function get_data($conn) {
        $id = number_format($_REQUEST['q']);
        if(isset($id)) {  
        $sql = "select * from cms.menu WHERE restaurant = ".$id;
        $result = mysqli_query($conn, $sql);
        $menu = array();
        while($row = mysqli_fetch_assoc($result))
        {
            $menu[] = array (
                'dish_id' => $row['id'],
                'category' => $row['category'],
                'name' => $row['dish_name'],
                'price' => $row['full'],
                'half_price' => $row['half'],
                'image' => $row['image'],
                'veg' => $row['veg'],
                'rest_id' => $row['restaurant'],
                'status' => $row['status']
            );
        }
           $data = array('dishes' => $menu);
        }
        return json_encode($data);
       }
       print_r(get_data($conn));
}
if($_SERVER['REQUEST_METHOD'] === 'POST' && $_REQUEST['disable'] != '') {
    $id = number_format($_REQUEST['disable']);
    if(isset($id)) {  
    $sql = "update cms.menu set status='unactive' WHERE id = ".$id;
    if(mysqli_query($conn, $sql))
    echo 'dish has been disabled';
    else echo 'failed to disable';
    }
    // while($row = mysqli_fetch_assoc($result))
}
else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_REQUEST['enable'] != '') {
    $id = number_format($_REQUEST['enable']);
    if(isset($id)) {  
    $sql = "update cms.menu set status='active' WHERE id = ".$id;
    if(mysqli_query($conn, $sql))
    echo 'dish has been enabled';
    else
    echo 'failed';
    }
    // while($row = mysqli_fetch_assoc($result))
}
else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['QUERY_STRING'] == '') {
    $ext = explode('.', $_FILES['image']['name']);
    $filext = strtolower(end($ext));
    $types = array('jpg', 'jpeg', 'png');
    if($filext == in_array($filext, $types)) {
        if($_FILES['image']['error'] === 0) {
            if($_FILES['image']['size'] < 1000000) {
                $savingname = uniqid('', true).'.'.$filext;
                $destination = 'C:/Users/saura/OneDrive/Desktop/CMS Project/Frontend/image/'.$savingname;
                if(move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
                    $sql = 'insert into cms.menu (dish_name, category, half, full, image, veg, restaurant)
                    values("'.$_POST["dname"].'", "'.$_POST["category"].'", '.$_POST["hprice"].', '.$_POST["fprice"].',
                    "'.$savingname.'", "'.$_POST["veg"].'", "'.$_POST["rest_id"].'");' ;
                    $result = mysqli_query($conn, $sql);
                    echo 'File has been uploaded';
                } else {
                    echo 'File was not uploaded';
                }
            } else {
                echo 'File size is more than 1mb';
            }
    } else {
        echo 'Error in uploading the file';
    }
    } else {
        echo 'The File type should be jpg, png, jpeg.(Make sure your file name does not contain any special character)';
    }
}
else if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = number_format($_REQUEST['q']);
    if(isset($id)) {
        $sql = 'delete from cms.menu where id = '.$id;
        $result = mysqli_query($conn, $sql);
        echo 'data is being deleted';
    }
}  
else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['QUERY_STRING'] !== '') {
    if($_FILES['image']['name'] !== ''){
     $ext = explode('.', $_FILES['image']['name']);
    $filext = strtolower(end($ext));
    $types = array('jpg', 'jpeg', 'png');
    if($filext == in_array($filext, $types)) {
        if($_FILES['image']['error'] === 0) {
            if($_FILES['image']['size'] < 1000000) {
                $savingname = uniqid('', true).'.'.$filext;
                $destination = 'C:/Users/saura/OneDrive/Desktop/CMS Project/Frontend/image/'.$savingname;
                if(move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
                    $sql = 'update cms.menu set dish_name ="'.$_POST["dname"].'", category ="'.$_POST["category"].'", half ='.$_POST["hprice"].',
                     full ='.$_POST["fprice"].', image ="'.$savingname.'", veg ='.$_POST["veg"].' where id ='.$_SERVER['QUERY_STRING'];
                    if(mysqli_query($conn, $sql))
                    echo 'File has been uploaded';
                    else 
                    echo "Error in executing the query";
                } else {
                    echo 'File was not uploaded';
                }
            } else {
                echo 'File size is more than 1mb';
            }
    } else {
        echo 'Error in uploading the file';
    }
    } else {
        echo 'The File type should be jpg, png, jpeg.(Make sure your file name does not contain any special character)';
    }
}
else if($_FILES['image']['name'] == ''){
    $sql = 'update cms.menu set dish_name ="'.$_POST["dname"].'", category ="'.$_POST["category"].'", half ='.$_POST["hprice"].',
    full ='.$_POST["fprice"].', veg ='.$_POST["veg"].' where id ='.$_SERVER['QUERY_STRING'];
    if(mysqli_query($conn, $sql))
    echo 'File has been uploaded';
    else 
    echo "Error in executing the query";
}
}    
?>