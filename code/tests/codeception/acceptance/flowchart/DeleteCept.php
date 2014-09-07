<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Create a new flowchart and then delete it');

$idFlowchart = Flowchart::createFlowchart($I)['id'];

Flowchart::deleteFlowchart($I, $idFlowchart);


