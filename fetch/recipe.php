<?php

require '../admin/rb.php';
R::setup('mysql:host=localhost;dbname=nbridi_foood','nbridi_foood','mk^Hw-c@*RSg');

$id = htmlspecialchars($_GET['id']);
$recipe = R::load('recipes', $id);

$output = [];
$output["title"] = $recipe["title"];
$output["ingredients"] = json_decode($recipe["ingredients"]);
$output["steps"] = json_decode($recipe["steps"]);
$output["tags"] = json_decode($recipe["tags"]);
$output["servings"] = $recipe["servings"];
$output["time"]["active"] = $recipe["timeactive"];
$output["time"]["total"] = $recipe["timetotal"];
$output["source"]["name"] = $recipe["sourcename"];
$output["source"]["url"] = $recipe["sourceurl"];
$output["notes"] =  nl2br($recipe["notes"]);

echo json_encode($output);

?>
