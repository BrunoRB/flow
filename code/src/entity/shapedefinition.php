<?php

namespace src\entity;

/**
 * Description of shape_definition
 *
 * @author BrunoRB
 */
class ShapeDefinition {
    public $name; // PK
    public $defaultValue;
    public $maxInputs; // NOT NULL
    public $maxOutputs; // NOT NULL
    public $maxCopies; // NOT NULL
    public $hasUserText; // NOT NULL
    public $connLabelType; // NOT NULL
    public $cssStyle;

    public function loadBean() {
    }
}

