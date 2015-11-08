<?php

session_start();

if (empty($_SESSION['authenticated'])) {
    exit;
}

require 'rb.php';
R::setup('mysql:host=localhost;dbname=nbridi_foood','nbridi_foood','mk^Hw-c@*RSg');


if ($_POST['delete']) {
	$recipe = R::load('recipes', $_POST["id"]);
	R::trash( $recipe );
	header("Location: addedit.php");
	exit;
}

if ($_POST['create']) {
	$recipe = R::dispense('recipes');	
} else if ($_POST['update']) {
	$recipe = R::load('recipes', $_POST["id"]);
} 

$recipe->title = htmlspecialchars($_POST["title"]);
$recipe->steps = htmlspecialchars_decode($_POST["steps"]);
$recipe->tags = htmlspecialchars_decode($_POST["tags"]);
$recipe->ingredients = htmlspecialchars_decode($_POST["ingredients"]);
$recipe->sourcename = htmlspecialchars($_POST["sourcename"]);
$recipe->sourceurl = htmlspecialchars($_POST["sourceurl"]);
$recipe->servings = htmlspecialchars($_POST["servings"]);
$recipe->timetotal = htmlspecialchars($_POST["timetotal"]);
$recipe->timeactive = htmlspecialchars($_POST["timeactive"]);
$recipe->notes = htmlspecialchars($_POST["notes"]);

$id = R::store( $recipe );

header("Location: addedit.php?id=" . $id);
exit;
?>