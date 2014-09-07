<?php

namespace src\controller;

use core\Utilities;

use \src\enum\Table;

use src\entity\FlowUser;

use \src\extension\Login;

class HomeController extends \core\BaseController {

    public function registerNewUser() {
        $user = $this->buildUserEntityFromPost();

        if (!$this->validateNewUserData($user)) {
            return false;
        }

        $userBean = $this->getUserBeanFromUserEntity($user);
        $userBean->password = hash(Login::HASH_ALG, $user->password);

        $retval = \RedBean_Facade::store($userBean);

        if (!is_int($retval) || $retval === 0) {
            return false;
        }

        $login = new Login();

        return $login->authenticate($user);
    }

    public function emailAlredyRegistered(FlowUser $user) {
        $email = $user->email;
        $user = \RedBean_Facade::findOne(Table::USER, 'email=?', array($email));
        if (!isset($user) || empty($user)) {
            return false;
        }
        return true;
    }

    public function login() {
        $post = Utilities::escapeRequestData($_POST);

        $user = $this->buildUserEntityForLoginFromPost();

        $login = new Login();
        return $login->authenticate($user);
    }

    private function getUserBeanFromUserEntity(FlowUser $user) {
        $userBean = \RedBean_Facade::dispense(Table::USER);
        $userBean->id = $user->id;
        $userBean->name = $user->name;
        $userBean->email = $user->email;
        $userBean->password = $user->password;
        $userBean->isActive = isset($user->isActive) ? $user->isActive : true;
        $userBean->sessionTime = $user->sessionTime;

        return $userBean;
    }

    private function validateNewUserData(FlowUser $user) {
        if ($this->emailAlredyRegistered($user)) {
            return false;
        }

        //TODO

        return true;
    }

    private function buildUserEntityFromPost() {
        $post = Utilities::escapeRequestData($_POST);
        $user = new FlowUser();
        $user->name = $post['name'];
        $user->email = $post['email'];
        $user->password = $post['password'];
        return $user;
    }

    private function buildUserEntityForLoginFromPost() {
        $post = Utilities::escapeRequestData($_POST);
        $user = new FlowUser();
        $user->email = $post['login-email'];
        $user->password = $post['login-password'];
        return $user;
    }
}