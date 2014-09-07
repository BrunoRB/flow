"use strict";

$(document).ready(function() {

	var formSettings = $.fn.form.settings;

    formSettings.on = "blur";
    formSettings.revalidate = false;
    formSettings.onInvalid = function(message) {
        alertify.error(message, 2000);
    };

    var $registerForm = $("#register");
    var $loginForm = $("#login-form");

    var ajaxRegister = function(event) {
        event.preventDefault();

        var postData = $registerForm.serialize() + "&request_type=" + flow.Constants.AJAX;

        $.post("/home/registerNewUser", postData, function(retval) {
            if (retval === true) {
                window.location = '/flowchart';
            }
            else {
                flow.Utilities.showDebug(retval);
                alertify.error("Erro no registro", 1000);
            }
        }, "text json").fail(function(retval) {
            alertify.error("Erro no registro", 1000);
            flow.Utilities.showDebug(retval);
        });

        $registerForm.find("input[name='password']").val("");
    };

    var ajaxLogin = function(event) {
        event.preventDefault();

        var postData = $loginForm.serialize() + "&request_type=" + flow.Constants.AJAX;

        $.post("/home/login", postData, function(retval) {
            if (retval === true) {
                window.location = '/flowchart';
            }
            else {
                alertify.error("Senha e/ou login inválido(s)", 1000);
            }
        }, "text json").fail(function(retval) {
            alertify.error("Senha e/ou login inválido(s)", 1000);
            flow.Utilities.showDebug(retval);
        });

        $loginForm.find("input[name='login-password']").val("");
    };


    var emailRules = [
        {
            type: 'email',
            prompt: 'Por favor insira um email válido'
        }
    ];

    var passwordRules = [
        {
            type: 'length[5]',
            prompt: 'A senha deve conter no minímo 5 caracteres'
        }
    ];

    $registerForm.form({
        name: {
            identifier: "name",
            rules: [
                {
                    type: 'length[4]',
                    prompt: 'O nome deve possuir no minímo 4 caracteres'
                }
            ]
        },
        email: {
            identifier: "email",
            rules: emailRules
        },
        password: {
            identifier: "password",
            rules: passwordRules
        }
    }, {
        onSuccess: ajaxRegister
    });


    $loginForm.form({
        email: {
            identifier: "login-email",
            rules: emailRules
        },
        password: {
            identifier: "login-password",
            rules: passwordRules
        }
    }, {
        onSuccess: ajaxLogin
    });


});
