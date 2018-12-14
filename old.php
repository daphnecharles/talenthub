<?php

	$file = "fakeData.json";

	echo "old.php submitted";
	
	//Saves a timestamped copy of fakeData.json to the jsonBackup folder
	$timestamp = date("Y-m-dhia");
	$backupFile = "courses".$timestamp.".json";

	$backupFileOpen = fopen($_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/testingSchedNew/jsonBackup/$backupFile", "w+") or die ("Cannot open file");
	
	$dstfile = $_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/testingSchedNew/jsonBackup/$backupFile";

	$srcfile = "https://competencies.regeneron.com/pmDash/sched/testingSchedNew/fakeData.json";
	
	mkdir(dirname($dstfile), 0777, true);
	
	if (copy($srcfile, $dstfile)) {
		echo "Copy was successful";
	} else {
		echo "Copy failed";
	}

	$oldCourseId = $_POST['oldCourseId'];

	//Get the contents of the JSON file	
	$jsonStringOld = file_get_contents($file);
	if ($getFileOld === false) {
		die("Error getting file");
	} else {
		echo "Successfully read JSON file";
	}

	//Decode JSON string as an array
	$jsonArrayOld = json_decode($jsonStringOld, true);

	//Loop through elements in the array and delete elements if they match the activityId of the row
	foreach ($jsonArrayOld as $key => $value) {
		if ($value["Activity"] == $oldCourseId) {
			unset($jsonArrayOld[$key]);
		}
	}

	//Saves array values and encodes them as a JSON string
	$jsonArrayOld     = array_values($jsonArrayOld);
	$newJsonStringOld = json_encode($jsonArrayOld);

	//Saves new JSON string to JSON file 
	$oldRewrite = file_put_contents($file, $newJsonStringOld);
	if ($oldRewrite === false) {
		die("Error deleting and rewriting to file");
	} else {

		echo "Data successfully deleted and rewritten to file";
	}

?>