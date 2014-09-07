<?php

namespace src\entity;

class ShapeConnection {
    public $id;
    public $value;
    public $fkSourceShape;
    public $fkTargetShape;

    public function loadBean() {
    }
}