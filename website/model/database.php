<?php
include './errorTracking.php';

#TODO anonymize the credentials
#why i cant do this? i didnt figure out how to test this locally yet (env variables i know but annoying)
#github secrets? idk with my current deployment infrastructure
runSQLQuery($sql);{
  $servername = "mysql";
  $username = "evKqe7NcT#wtnCuTT&v5!L7eWbCqqH^S";
  $password = "6v7HABYQKRjhbnJvuBa6ZvU*UayvDTBM";
  $dbname = "phishingDB";
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  
  if ($conn->query($sql) === false) {
    errorCheckRouter($conn->error);
  }
  $conn->close();
}





$sql = "CREATE TABLE MyGuests (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(30) NOT NULL,
  lastname VARCHAR(30) NOT NULL,
  email VARCHAR(50),
  reg_date TIMESTAMP
)";

?>
