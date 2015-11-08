<?php

require '../admin/rb.php';
R::setup('mysql:host=localhost;dbname=nbridi_foood','nbridi_foood','mk^Hw-c@*RSg');

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

