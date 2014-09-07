<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Edit shapes values');

$flowchartId = Flowchart::createFlowchart($I)['id'];

Flowchart::loadFlowchart($I, $flowchartId);

$I->click('#toggle-console');

$I->wait(1);

$shapes = Flowchart::$ALL_SHAPES;

Flowchart::createShapes($I, $shapes);

$shapesEditValues = array(
    'begin' => array('isEditable' => false), 'decision' => array('isEditable' => true),
    'process' => array('isEditable' => true), 'connector' => array('isEditable' => false)
);
Flowchart::editShapesValues($I, $shapesEditValues);



