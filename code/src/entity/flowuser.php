<?php

namespace src\entity;

class FlowUser {
    public $id;
    public $name;
    public $email;
    public $password;
    public $isActive;
    public $sessionTime;

    public function loadBean() {
    }

}