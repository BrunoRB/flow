<?php

namespace src\extension;

use \src\entity\FlowUser;
use \src\enum\Table;

class Login {
    const HASH_ALG = 'sha256';

    public function __construct() {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
    }

    public function authenticate(FlowUser $user) {
        if (!$this->isValidUser($user)) {
            return false;
        }

        $this->setSessionTime($user);
        $this->setLoggedUser($user);

        return true;
    }

    public function logOut() {
        unset($_SESSION['user']);
    }

    public function getLoggedUser() {
        return (isset($_SESSION['user'])) ? $this->getUserEntityByUserEmail($_SESSION['user']) : new FlowUser();
    }

    private function setLoggedUser(FlowUser $user) {
        $_SESSION['user'] = $user;
    }

    public function isLogged() {
        $isInSession = (isset($_SESSION['user']) && $_SESSION['user'] instanceof FlowUser) ? true: false;

        if ($isInSession) {
            return true;
        }
        return false;
    }

    private function isValidUser(FlowUser $user) {
        $email = $user->email;
        $password = hash(self::HASH_ALG, $user->password);
        $userBean = \RedBean_Facade::findOne(Table::USER, 'email=? AND password=?', array($email, $password));
        if (!isset($userBean) || empty($userBean)) {
            return false;
        }
        return $userBean;
    }

    private function setSessionTime(FlowUser $user) {
        $userBean = $this->getUserBeanByUserEmail($user);
        $userBean->sessionTime = \RedBean_Facade::isoDateTime();
        $userBean->isActive = true;
        \RedBean_Facade::store($userBean);
    }

    private function getUserBeanByUserEmail(FlowUser $user) {
        $email = $user->email;
        return \RedBean_Facade::findOne(Table::USER, 'email=?', array($email));
    }

    private function getUserEntityByUserEmail(FlowUser $user) {
        $userBean = \RedBean_Facade::findOne(Table::USER, 'email=?', array($user->email));
        $user->id = $userBean->id;
        $user->name = $userBean->name;
        $user->email = $userBean->email;
        $user->password = $userBean->password;
        $user->isActive = $userBean->isActive;
        $user->sessionTime = $userBean->sessionTime;

        return $user;
    }
}