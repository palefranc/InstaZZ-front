// JavaScript source code
import axios from '../url/url_bdd';
import React, { Component } from "react";
import User from './User';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
} from 'react-router-dom';

export default class AuthRouter extends Router {
    constructor(props) {
        super(props);
		
		//localStorage.clear();
        this.state = {
            auth: props.authentified,
            input_email: "",
            input_pwd: "",
			token: {},
            user: {}
        };
    }
	
	componentDidMount() {
		
		const token = localStorage.getItem("token_id");
		var authentified = false;
		
		if(token){
			//this.setState({ auth: true });
			window.location = "http://localhost:3000/profil/";
		}
		
		
	}
	
	getUser(){
		const id_test = "5e42782facfdb41ad0693636";
		
		axios.get("/users/" + id_test)
            .then(res => {
                let user = res.data;
                if (user) {
					this.setState({ user : user });
					//this.state["user"] = user;
                    console.log(this.state.user);
					localStorage.setItem("token_id", this.state.user._id);
                }
            })
            .catch(err => console.error(err));
	}
	
	login() {
		localStorage.setItem("token_mail", this.state.input_email)
		localStorage.setItem("token_pwd", this.state.input_pwd)
		this.getUser();
		this.state["auth"] = true;
	}

    changeMail(ev) {
        this.state["input_email"] = ev.target.value;
    }

    changePwd(ev) {
        this.state["input_pwd"] = ev.target.value;
    }

    authUser(ev, context) {
		ev.preventDefault();
        console.log(context.state.input_email);
        console.log(context.state.input_pwd);
		context.login();
    }
    

    render() {
        var comp;
        if (!this.state.auth) {
            comp = (
                <form onSubmit={(ev, context) => this.authUser(ev, this)}>
                    <div>
                        User e-mail : <input type="text" id="u_mail" placeholder="Mail user" onChange={(ev) => { this.changeMail(ev) } }/><br />
                        User password : <input type="password" id="u_pwd" placeholder="Mot de passe" onChange={(ev) => { this.changePwd(ev) }}/><br />
                    </div>
                    <button type="submit">Log in</button>
                </form>

            );
        }
        else {
            comp = (<User in_user={this.state.user}/>);
        }

        return comp;
    }
}