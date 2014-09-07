<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Create new shapes in a flowchart');

$flowchartId = Flowchart::createFlowchart($I)['id'];

Flowchart::loadFlowchart($I, $flowchartId);

$shapes = array('begin', 'process', 'display', 'end', 'connector', 'decision');
Flowchart::createShapes($I, $shapes);



