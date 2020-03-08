// JavaScript source code
import axios from '../url/url_bdd';
import React from "react";
import './AuthRouter.css';
import User from './User';
import logo from '../assets/logo_transparent.png';
import {
    BrowserRouter as Router
} from 'react-router-dom';

const jwt = require('jsonwebtoken');

export default class AuthRouter extends Router {
    constructor(props) {
        super(props);
		//localStorage.clear();
        this.state = {
            auth: props.authentified,
			input_user_name: "",
            input_description: "",
            input_email: "",
            input_pwd: "",
			message: "",
			creationUser: props.signup
        };
    }
	
	componentDidMount() {
		
		const token = localStorage.getItem("token");
		
		if(token){
			window.location = "http://localhost:3000/profil/";
		}
		
		
	}
	
	async login() {
		
		var optionReq = {
			method: 'POST',
			data: {
				email: this.state.input_email,
				password: this.state.input_pwd
			},
			url: 'http://localhost:5000/users/login/'
		}
		
		try {
			const res = await axios(optionReq);
			
			if(res && res.data){
				
				const token = res.data.token;
				localStorage.setItem("token", token)
				
				this.setState({ auth: true });
			}
			else{
				this.setState({ message: "Erreur données reçues" });
			}
			
		}
		catch (err) {
			
			if(err.response)
			{
				if(err.response.data.message)
				{
					this.setState({ message: err.response.data.message });
				}
				else
				{
					this.setState({ message: "Erreur authentification" });
				}
			}
		}
	}

    changeMail(ev) {
		this.setState({ input_email: ev.target.value});
        //this.state["input_email"] = ev.target.value;
    }

    changePwd(ev) {
		this.setState({ input_pwd: ev.target.value});
        //this.state["input_pwd"] = ev.target.value;
    }
	
	changeName(ev) {
		this.setState({ input_user_name: ev.target.value});
        //this.state["input_user_name"] = ev.target.value;
    }

    changeDesc(ev) {
		this.setState({ input_description: ev.target.value});
        //this.state["input_description"] = ev.target.value;
    }

    authUser(ev, context) {
		ev.preventDefault();
		context.login();
    }
	
	async createUser(ev, context){
		ev.preventDefault();
		
		var optionReq = {
			method: 'POST',
			data: {
				username: context.state.input_user_name,
				email: context.state.input_email,
				password: context.state.input_pwd,
				bio: context.state.input_description,
				image: ""
			},
			url: 'http://localhost:5000/users/signup'
		}
		
		try {
			const resp = await axios(optionReq);
			
			if(resp){
				console.log(resp.data);
				
				const user = resp.data.user;
					
				context.login();
				
				if(user){
					console.log(user.username);
					console.log(user.email);
					console.log(user.password);
					
					//context.setState({ auth: true});
					
					//window.location = "http://localhost:3000/profil/";
				}
			}
			
		}
		catch (err) {
			if(err.response)
			{
				if(err.response.status == 401){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/";
				}
				else
				{
					this.setState({ message: err.response.data.message });
					console.error(err.response.data.message);
				}
			}
		}
		
	}
	
	activeCreation(ev, context){
		context.state["message"] = "";
		context.setState({ creationUser:true });
	}
	
	desactiveCreation(ev, context){
		context.state["message"] = "";
		context.setState({ creationUser:false });
	}
	
	getAutComp()
	{
		return(<div className="login">
			<div className="blank">
				<img src={logo} alt="logo" className="logo"/>
			</div>
				<form className="text-center border border-light p-5" onSubmit={(ev, context) => this.authUser(ev, this)}>

					<p className="h4 mb-4">Sign in</p>

					<input type="email" 
						id="defaultLoginFormEmail" 
						className="form-control mb-4" 
						placeholder="E-mail"
						onChange={(ev) => { this.changeMail(ev); } }
					/>

					<input type="password"
						id="defaultLoginFormPassword"
						className="form-control mb-4"
						placeholder="Password" 
						onChange={(ev) => { this.changePwd(ev); } }
					/>

					<div className="d-flex justify-content-around">
						<div>
							<div className="custom-control custom-checkbox">
								<input type="checkbox" className="custom-control-input" id="defaultLoginFormRemember" />
								<label className="custom-control-label">Remember me</label>
							</div>
						</div>
						<div>
							<a href="">Forgot password?</a>
						</div>
					</div>

					<button className="btn btn-info btn-block my-4" type="submit">Sign in</button>

					<p>Not a member?
						<a href="/auth/signup">Register</a>
					</p>

				</form>
			</div>
		);
		
	}
	
	getCreateUser()
	{
		const comp = (<div>
				<form onSubmit={(ev, context) => this.createUser(ev, this)}>
					<div>
						Nom d'utilisateur : 
						<input type="text" 
							id="u_name" 
							placeholder="Nom" 
							value={this.state.input_user_name}
							onChange={(ev) => { this.changeName(ev) }}
						/><br />
						Email : 
						<input type="text"
							id="u_mail"
							placeholder="Mail"
							value={this.state.input_email}
							onChange={(ev) => { this.changeMail(ev) }}
						/><br />
						Mot de passe : 
						<input type="password"
							id="u_pwd"
							placeholder="Mot de passe"
							value={this.state.input_password}
							onChange={(ev) => { this.changePwd(ev) }}
						/><br />
						Description : 
						<input type="text"
							id="u_desc"
							placeholder="Parlez de vous..."
							value={this.state.input_description}
							onChange={(ev) => { this.changeDesc(ev) }}
						/><br />
					</div>
					<button type="submit">Enregistrer</button>
				</form>
				<button onClick={(ev, context) => this.desactiveCreation(ev, this)}>Annuler</button><br />
				<div className="errorMessage">{this.state.message}</div>
			</div>);
		
		return(
			<div className="signup">
				<form className="text-center border border-light p-5" onSubmit={(ev, context) => this.createUser(ev, this)}>

					<p className="h4 mb-4">Sign up</p>

					<div className="form-row mb-4">
						<div className="col">
							<input type="text"
								id="defaultRegisterFormLastName"
								className="form-control"
								placeholder="User name"
								onChange={(ev) => { this.changeName(ev) }} />
						</div>
					</div>

					<input type="email"
						id="defaultRegisterFormEmail"
						className="form-control mb-4"
						placeholder="E-mail"
						onChange={(ev) => { this.changeMail(ev) }}
					/>

					<input
						type="password"
						id="defaultRegisterFormPassword"
						className="form-control"
						placeholder="Password"
						aria-describedby="defaultRegisterFormPasswordHelpBlock"
						onChange={(ev) => { this.changePwd(ev) }}
					/>
					<small id="defaultRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
						At least 8 characters and 1 digit
					</small>
					
					<button className="btn btn-info my-4 btn-block" type="submit">Sign in</button>
					<hr />

					<p>By clicking
						<em>Sign up</em> you agree to our
						<a href="" target="_blank"> terms of service</a>
					</p>

				</form>
			</div>
		);
	}
	

    render() {
        var comp;
        if (!this.state.auth) {
			if(this.state.creationUser){
				comp = this.getCreateUser();
			}
			else
			{
				comp = this.getAutComp();
			}
        }
        else {
            comp = (<User/>);
        }

        return comp;
    }
}