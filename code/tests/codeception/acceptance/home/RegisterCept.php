<?php

$I = new WebGuy\FlowSteps($scenario);

$I->wantTo('Register a new user');

$I->amOnPage('/home');

$I->click('a[href="/home/register"]');

$name = 'NewUser ' . rand();
$I->fillField('#name', $name);

$email = 'newuser@newuser' . rand() . '.com';
$I->fillField('#email', $email);

$password = 'newuserpassword';
$I->fillField('#password', $password);

$I->click('#submit');

$I->wait(1);

$I->seeInCurrentUrl('/flowchart');
