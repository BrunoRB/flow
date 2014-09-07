<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Load a recently created flowchart');

$flowchartId = Flowchart::createFlowchart($I)['id'];

Flowchart::loadFlowchart($I, $flowchartId);



