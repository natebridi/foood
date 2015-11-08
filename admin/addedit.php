<?php

session_start();

if (empty($_SESSION['authenticated'])) {
    header('Location: login.php');
    exit;
}

require 'rb.php';
R::setup('mysql:host=localhost;dbname=nbridi_foood','nbridi_foood','mk^Hw-c@*RSg');

$recipes = R::findAll('recipes');
?>

<!DOCTYPE html>
<html>
<head>
	<title>Add/Edit Recipes</title>
	<link href='http://fonts.googleapis.com/css?family=Hammersmith+One|Playfair+Display:700|Vollkorn:400italic,700italic,400,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="admin.css" />
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />


	<script src="http://fb.me/react-with-addons-0.10.0.min.js"></script>
	<script src="http://fb.me/JSXTransformer-0.10.0.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="../definitions.js"></script>
	<script src="arrayeditor.js" type="text/jsx"></script>
	<script src="ingredients.js" type="text/jsx"></script>
	<script src="admin.js"></script>
	
</head>
<body>
	
<div class="main-nav">
	<div class="select-wrap">		
	<select onchange="changeRecipe()" id="recipeSelect">
		<option value="">Add new recipe</option>
	<?php
		foreach($recipes as $r) {
		    $selected = ($r->id == $_GET["id"]) ? ' selected ' : ''; 
		    ?>
			<option value="<?php echo $r->id; ?>" <?php echo $selected; ?> >
				<?php echo $r->title; ?>
			</option>
		<?php 
		} ?>	
	</select>
	</div>
	
	<a href="/admin/logout.php">Logout</a>
</div>

<?php

$id = $_GET['id'];
if ($id) {
	$recipe = R::load('recipes', $id);
} else {
	$recipe = R::dispense('recipes');
	$id = -1;
}

?>

<div class="form-wrap">
<form action="save.php" method="POST">
	<input type="hidden" name="id" value="<?php echo $id; ?>" />
	
	<?php if ($id != -1) { ?>
		<div class="row">
			<label for="notes">Notes</label>
			<div class="textarea-wrap">
				<textarea name="notes"><?php echo $recipe['notes']; ?></textarea>
			</div>
		</div>
	<?php } ?>
	
	<div class="row">
		<label for="title">Title</label>
		<input type="text" name="title" value="<?php echo $recipe['title']; ?>" />
	</div>
	
	<div class="row split">
		<div class="group">
			<label for="servings">Servings</label>
			<input type="text" name="servings" value="<?php echo $recipe['servings']; ?>" />
		</div>
		<div class="group">
			<label for="timetotal">Time</label>
			<div class="two-inputs">
				<input type="text" name="timetotal" value="<?php echo $recipe['timetotal']; ?>" placeholder="Total" />
				<input type="text" name="timeactive" value="<?php echo $recipe['timeactive']; ?>" placeholder="Active" />
			</div>
		</div>
	</div>
	
	<div class="row">
		<label>Ingredients</label>
		<div data-ingredients="<?php echo htmlspecialchars($recipe['ingredients']); ?>"></div>
	</div>
	
	<div class="row">
		<label>Steps</label>
		<div data-array="<?php echo htmlspecialchars($recipe['steps']); ?>" data-name="steps"></div>
	</div>
	
	<div class="row">
		<label>Tags</label>
		<div data-array="<?php echo htmlspecialchars($recipe['tags']); ?>" data-name="tags"></div>
	</div>
	
	<div class="row">
		<label for="sourcename">Source</label>
		<div class="two-inputs">
			<input type="text" name="sourcename" value="<?php echo $recipe['sourcename']; ?>" placeholder="Name" />
			<input type="text" name="sourceurl" value="<?php echo $recipe['sourceurl']; ?>" placeholder="URL" />
		</div>
	</div>
	
	<?php if ($id == -1) { ?>
		<div class="row">
			<label for="notes">Notes</label>
			<div class="textarea-wrap">
				<textarea name="notes"><?php echo $recipe['notes']; ?></textarea>
			</div>
		</div>
	<?php } ?>
	
	<div class="submit row">	
		<?php if ($id == -1) { ?>
			<input type="submit" name="create" value="Save new recipe" />
		<?php } else { ?>
			<div class="fake-delete">Delete</div>
			<div class="delete-wrap">
				Sure?
				<input type="submit" name="delete" value="Yes, delete" class="delete" />
				<div class="cancel">Cancel</div>
			</div>
			<input type="submit" name="update" value="Update recipe" /> 
		<?php } ?>
	</div>
</form>
</div>

</body>
</html>