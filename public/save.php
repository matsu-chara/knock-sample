<?php
    $json = file_get_contents("php://input");
    file_put_contents("todos.json", $json);
