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

	$dataName = $_POST['dataName'];
	$dataId = $_POST['dataId'];

	$sql = '';
	
	if($dataName === "pers"){
		$sql .= 'DELETE FROM personnel WHERE id ='. $dataId . ' ';
	}else if($dataName === "dept"){
		$sql .= 'DELETE FROM department WHERE id ='. $dataId . ' ';
	}else if($dataName === "loc"){
		$sql .= 'DELETE FROM location WHERE id ='. $dataId . ' ';
	}

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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>