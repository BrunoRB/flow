<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Update data from a recently created flowchart');

$idFlowchart = Flowchart::createFlowchart($I)['id'];

$I->click('#toggle-settings');
$I->wait(1);

$I->canSeeElement('aside#flowchart-settings');

$newLabel = 'Updated' . rand();
$I->fillField('input#flowchart-name', $newLabel);

$I->pressKeyUp('input#flowchart-name', 13); // ENTER

$I->wait(1);

//$I->see($newLabel, '.flowchar-tab.active');

//$I->see($newLabel, 'input#flowchart-name');