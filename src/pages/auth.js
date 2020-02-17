// JavaScript source code
import React from 'react';

var user_mail;
var user_password;

function getUser(mail, pwd) {

}

function Auth() {
    return (
        <div>
            User e-mail : <input type="text" name="u_mail"/><br/>
            User password : <input type="password" name="u_pwd"/><br/>
        </div>
    );
}

export default Auth;