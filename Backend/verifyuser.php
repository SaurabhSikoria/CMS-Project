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
include './uploads/dbconn.php';
$uemail = $_POST['Email_Id'];
$upassword = $_POST['password'];
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
$sql = "SELECT * FROM cms.owner;";
$data = mysqli_query($conn, $sql);
$details = array();
while($result = mysqli_fetch_assoc($data))
{
	if($result['email'] == $uemail )
	{
		// $c=0;
		if($result['password'] == $upassword)
		{
            $details[] = array(
                'owner_id' => $result['owner_id'],
                'rest_name' => $result['restaurant'],
                'email' => $result['email'],
                'mobile' => $result['mobile'],
                'username' => $result['name']
            );
            print_r(json_encode($details[0]));
		}
		else{
			echo "password and user doesn't match. Please enter valid credentials";
		}
	} else if(!isset($uemail)) {
		echo "Please enter email";
	} 	
}
?>
