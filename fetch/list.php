<?php

require '../database/connect.php';

$recipes = R::findAll('recipes');

$output = [];

foreach($recipes as $r) {
	$obj = [];
	$obj["title"] = $r["title"];
	$obj["id"] = $r["id"];
	
	$output[] = $obj;
}


echo json_encode($output);

?>

