<?php

require 'rb.php';
require 'config.php';

R::setup('mysql:host=127.0.0.1;dbname=' . $foood_db_name, $foood_db_user, $foood_db_pw);
R::freeze( TRUE );

?>