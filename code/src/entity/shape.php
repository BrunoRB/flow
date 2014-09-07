<?php

namespace src\entity;

/**
 * Description of shape
 *
 * @author BrunoRB
 */
class Shape {
    public $id; // PK
    public $value; // NOT NULL
    public $positionLeft; // NOT NULL
    public $positionTop; // NOT NULL
    public $fkFlowchart; // FK
    public $fkShapeDefinition; // FK

    public function loadBean() {
    }
}