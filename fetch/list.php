<?php

require '../database/connect.php';

$recipes = R::findAll('recipes');

$output = [];

foreach($recipes as $r) {
	$obj = [];
	$obj["title"] = $r["title"];
	$obj["tags"] = json_decode($r['tags']);
	$obj["id"] = $r["id"];
	
	$output[] = $obj;
}


echo json_encode($output);

?>

