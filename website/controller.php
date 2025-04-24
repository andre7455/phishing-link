<?php
// a simple PHP function to demonstrate the use of PHP
function greet($name, $loops) {
    for ($i = 0; $i < $loops; $i++) {
        echo "Hello, " . htmlspecialchars($name) . "!" . "<br>";
    }   
}


?>
