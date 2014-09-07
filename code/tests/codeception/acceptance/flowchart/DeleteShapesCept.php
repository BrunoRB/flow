<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo("Delete shapes from a given flowchart !");

Flowchart::createFlowchart($I);

$I->click('#toggle-console');
$I->wait(1);

$shapes = array('end', 'decision');
Flowchart::createShapes($I, $shapes);
Flowchart::deleteShapes($I, $shapes);

$shapes = array('display', 'connector');
Flowchart::createShapes($I, $shapes);
Flowchart::deleteShapes($I, $shapes);

$shapes = array('manual_input', 'decision');
Flowchart::createShapes($I, $shapes);
Flowchart::deleteShapes($I, $shapes);



