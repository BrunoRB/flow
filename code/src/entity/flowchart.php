<?php

namespace src\entity;

class Flowchart {
    public $id;
    public $name;
    public $lastAlteration;
    public $isPublic;
    public $connectorStyle;
    public $fkFlowUser;

    public function loadBean() {
    }

}