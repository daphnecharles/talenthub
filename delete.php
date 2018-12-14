<?php 

	$file = "courses.json";

	echo "Delete.php submitted";

	$timestamp = date("Y-m-dhia");
	$backupFile = "courses".$timestamp.".json";

	$backupFileOpen = fopen($_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/jsonBackup/$backupFile", "w+") or die ("Cannot open file");
	
	$dstfile = $_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/jsonBackup/$backupFile";

	$srcfile = "https://competencies.regeneron.com/pmDash/sched/courses.json";
	
	mkdir(dirname($dstfile), 0777, true);
	
	if (copy($srcfile, $dstfile)) {
		echo "Copy was successful";
	} else {
		echo "Copy failed";
	}

	//Save activity ID of row to be deleted in PHP variable	
	$activityId = $_POST['activityId'];
	
	//Get the contents of the JSON file	
	$jsonString = file_get_contents($file);
	if($getFile === false){
		die("Error getting file");
		}
	else {
		echo "Successfully read JSON file";		
	}

	//Decode JSON string as an array
	$jsonArray = json_decode($jsonString, true);


	//Loop through elements in the array and delete elements if they match the activityId of the row
	foreach ($jsonArray as $key => $value) {
		if ( $value["Activity"] == $activityId) {
			unset($jsonArray[$key]);	
		}
	  }

	//Saves array values and encodes them as a JSON string
	$jsonArray = array_values($jsonArray);
	$newJsonString = json_encode($jsonArray);

	//Saves new JSON string to JSON file 
	$deleteRewrite = file_put_contents($file, $newJsonString); 
			if($deleteRewrite === false){
				die("Error deleting and rewriting to file");
			}
			else {

				echo "Data successfully deleted and rewritten to file";
			}		

?>