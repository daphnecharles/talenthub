<?php 

	$file = "courses.json";

	echo "Form.php submitted";

	$timestamp = date("Y-m-dhia");
	$backupFile = "courses".$timestamp.".json";

	$backupFileOpen = fopen($_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/jsonBackup/$backupFile", "w+") or die ("Cannot open file");

	echo "Form submitted";
	
	$dstfile = $_SERVER['DOCUMENT_ROOT'] . "/pmDash/sched/jsonBackup/$backupFile";

	$srcfile = "https://competencies.regeneron.com/pmDash/sched/courses.json";
	
	mkdir(dirname($dstfile), 0777, true);
	
	if (copy($srcfile, $dstfile)) {
		echo "Copy was successful";
	} else {
		echo "Copy failed";
	}

	//If the file exists on the server, gets the contents of the file, replaces closing square bracket with a comma, to allow new form submissions to be saved as a new object in the array. 
	if (file_exists($file)) {
		$format = file_get_contents($file); 
			if($format === false){
			die("Error formatting file");
			}
			else {
			$newFormat = str_replace("]", "", $format);
			echo "Data successfully formatted";
			}

		$rewrite = file_put_contents($file, $newFormat); 
			if($rewrite === false){
				die("Error rewriting to file");
			}
			else {
				echo "Data successfully rewritten to file";
			}		
	} 

	//Save form values in variable to be sent in email
	$email = $_POST['email'];
	$campus = $_POST['campus'];
	$course = $_POST['course'];
	$start_date = $_POST['start-date'];
	$start_time = $_POST['start-time'];
	$end_time = $_POST['end-time'];
	$room = $_POST['room'];
	$activity = $_POST['activity'];
		
	$formArray = array("Course"=>$course, "Start Date"=>$start_date, "Start Time"=>$start_time, "End Time"=>$end_time, "Room"=>$room, "Activity"=>$activity, "Campus"=>$campus);
		
	$formJSON = json_encode($formArray);

	$openingBracket = "[";
	$comma = ",";

	$openingFormat = "{$openingBracket}{$formJSON}";
	$properFormat =  "{$comma}{$formJSON}";

		//If file exists, saves new form submission to JSON file with $properFormat, if file does not exist yet, uses $openingFormat for the first form submission.
		
	if (file_exists($file)) {
		$test2 = file_put_contents($file, $properFormat, FILE_APPEND); 
		if($test2 === false){
			die("Error writing to file");
		}
		else {
			echo "Data successfully written to file";
		}

		$close = file_put_contents($file, "]", FILE_APPEND); 
		if($close === false){
			die("Error closing file");
		}
		else {
			echo "Data successfully closed";
		}

	} 
	else {
			
		$test2 = file_put_contents($file, $openingFormat, FILE_APPEND); 
		if($test2 === false){
			die("Error writing to file");
		}
		else {
			echo "Data successfully written to file";
		}
		
		$close = file_put_contents($file, "]", FILE_APPEND); 
		if($close === false){
			die("Error closing file");
		}
		else {
			echo "Data successfully closed";
		}	
	}

	//Utilize form variables in email message
	$email_from = "talenthub@regeneron.com";
	$email_subject = "Regeneron Talent Hub";
	
	//Formatting the HTML email	
	$message = "<html> 
  <body bgcolor=\"#115BA8\"> 
  <div style=\"padding: 20px 0; text-align: center\">
  <img src=\"https://competencies.regeneron.com/pmDash/sched/images/TalentHublogo.png\" width=\"200\" height=\"50\" alt=\"TalentHub\" border=\"0\">
  </div>
  <div style=\"background: white; padding: 20px; text-align: center\"> 
  <h2>ILT Add or Change Form Submission</h2>
  <p>Below is a copy of the ILT form submittted by '$email'. Please verify that all details are correct.</p>
    <table style=\"margin:auto\" border=\"1\">
       <tr>
	   <th>Campus</th>
	   <th>Course</th>
	   <th>Start Date</th>
	   <th>Start Time</th>
	   <th>End Time</th>
	   <th>Room</th>
	   <th>Activity ID</th>
	   </tr>
       <tr>
	   <td>'$campus'</td>
	   <td>'$course'</td> 
	   <td>'$start_date'</td>
	   <td>'$start_time'</td>
	    <td>'$end_time'</td>
		<td>'$room'</td>
		 <td>'$activity'</td>
	   </tr>
    </table>
	<p>If there is an mistake within the course details, please contact example@email.com </p>
  </body> 
</html>"; 
		
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= "From: ". $email. " <" . $email_from . ">\r\n";
		
 //Sending the email on form submission.
	if (mail($email, $email_subject, $message, $headers)) {
  		echo("Email has been wonderfully sent!");
	}
    else {
		echo("Email has failed.");
   	}  
?>