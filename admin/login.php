<?php

session_start();

if ($_POST['password'] == "abc") {
	$_SESSION['authenticated'] = true;
	header('Location: addedit.php');
    exit;
}

?>

<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<style>
		body {
			background: #eee;
		}
		input {
			display: block;
			padding: 0.5em 1em;
			width: 200px;
			color: #444;
			font-size: 18px;
			margin: 3em auto;
			border: 0;
			background: #fff;
			box-shadow: none;
			border-radius: 3px;
		}
	</style>
</head>
<body>
<form action="" method="POST">
	<input type="text" name="password" id="pw" autocomplete="off" autocapitalize="off" placeholder="Enter password" autofocus="autofocus" />
</form>

</body>
</html>