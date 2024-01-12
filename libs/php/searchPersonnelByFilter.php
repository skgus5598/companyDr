<?php


	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$keyword = $_POST['keyword'];
	$department = $_POST['department'];
	$location = $_POST['location'];


	$sql = 'SELECT *
			FROM ( SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
				   FROM personnel p 
					LEFT JOIN department d ON (d.id = p.departmentID) 
					LEFT JOIN location l ON (l.id = d.locationID) 
				   WHERE 1=1 ';
		if($department !== "0"){
			$sql .= 'AND d.id='. $department .' '   ;
		}		
		if($location !== "0"){
			$sql .= 'AND l.id='. $location .' ' ;
		}	   
	$sql .= ') AS ps ';		
	if($keyword !== ""){
		$sql .= "WHERE ps.firstName LIKE '%".$keyword."%' OR ps.lastName LIKE '%".$keyword."%' "   ;
	}		

	$sql .= 'ORDER BY ps.lastName, ps.firstName,  ps.department, ps.location ';		

	$query = $conn->prepare($sql);
							 


	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
    
	$result = $query->get_result();

   	$list = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($list, $row);

	}

   

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $list;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>