// JavaScript source code
import axios from '../url/url_bdd';
import React from "react";
import './AuthRouter.css';
import ImagesUploader from 'react-images-upload';
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
			input_image: undefined,
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
	
	getImage(ev, img, context) {
		
		//context.parseImage(img[0])

		console.log("image chargée");
		//console.log(img);

		context.setState({
		  input_image: img[0]
		});
	}
	
	showImage()
	{
		var comp = undefined;
		
		if(this.state.input_image)
		{
			comp = <img className="apercuImage" src={this.state.input_image}/>
		}
		
		return comp;
	}

    authUser(ev, context) {
		ev.preventDefault();
		context.login();
    }
	
	async createUser(ev, context){
		ev.preventDefault();
		
		const token = localStorage.getItem("token");
		
		const formDatas = new FormData(ev.target);
		
		console.log(formDatas);
		console.log(formDatas.values());
		console.log(formDatas.get("profileImage"));
		console.log(formDatas.get("username"));
		console.log(formDatas.get("email"));
		console.log(formDatas.get("bio"));
		console.log(formDatas.get("status"));
		
		const optionReq = {
			method: 'POST',
			headers: {
				Authorization: "Bearer "+token,
				"Content-Type": "multipart/form-data",
			},
			data: formDatas,
			url: 'http://localhost:5000/users/signup'
		}
		
		console.log(optionReq);
		
		/*
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
		*/
		/*
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
					
					window.location = "http://localhost:3000/profil/";
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
		*/
	}
	
	getChoicePrivacy()
	{
		var comp = undefined;
		
		if(this.state.input_is_private)
		{
			comp = (
				<div className="select_privacy">
					<div>
						<input type="radio" id="public" name="status" value="public"
							onChange={(ev) => { this.changePrivacy(ev) }} />
						<label>Public</label>
					</div>
					<div>
						<input type="radio" id="private" name="status" value="private"
							checked onChange={(ev) => { this.changePrivacy(ev) }} />
						<label>Privée</label>
					</div>
				</div>
			);
		}
		else
		{
			comp = (
				<div className="select_privacy">
					<div>
						<input type="radio" id="public" name="status" value="public"
							onChange={(ev, context) => {this.changePrivacy(ev, this)}} />
						<label>Public</label>
					</div>
					<div>
						<input type="radio" id="private" name="status" value="private"
							 onChange={(ev, context) => {this.changePrivacy(ev, this)}} />
						<label>Privée</label>
					</div>
				</div>
			);
		}
		
		return comp;
	}
	
	changePrivacy(ev)
	{
		console.log(ev.target.value);
		if (ev.target.value == "private")
		{
			this.setState({ privacy: true });
		}
		else if (ev.target.value == "public")
		{
			this.setState({ privacy: false });
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

					<p className="h4 mb-4">Connexion</p>

					<input type="email" 
						id="defaultLoginFormEmail" 
						className="form-control mb-4" 
						placeholder="E-mail"
						onChange={(ev) => { this.changeMail(ev); } }
					/>

					<input type="password"
						id="defaultLoginFormPassword"
						className="form-control mb-4"
						placeholder="Mot de passe" 
						onChange={(ev) => { this.changePwd(ev); } }
					/>

					<button className="btn btn-info btn-block my-4" type="submit">Connexion</button>

					<p>Pas encore membre?
						<a href="/auth/signup">S'inscrire</a>
					</p>

				</form>
			</div>
		);
		
	}
	
	getCreateUser()
	{
		const context = this;
		return(
			<div className="signup">
				<form className="text-center border border-light p-5" onSubmit={(ev, context) => this.createUser(ev, this)}>

					<p className="h4 mb-4">S'inscrire</p>

					<div className="form-row mb-4">
						<div className="col">
							<input type="text"
								id="defaultRegisterFormLastName"
								className="form-control"
								name="username"
								placeholder="Pseudo" />
						</div>
					</div>
					
					<ImagesUploader
						name="profileImage"
						withIcon={true}
						multiple={false}
						optimisticPreviews
						buttonText='Chargez une image'
						onChange={(ev, img) => this.getImage(ev, img, this)}
						imgExtension={['.jpg', '.gif', '.png', '.gif']}
						maxFileSize={5242880}
					/>
					{this.showImage()}

					<input type="email"
						id="defaultRegisterFormEmail"
						className="form-control mb-4"
						name="email"
						placeholder="E-mail"
					/>

					<input
						type="password"
						id="defaultRegisterFormPassword"
						className="form-control"
						name="password"
						placeholder="Mot de passe"
						aria-describedby="defaultRegisterFormPasswordHelpBlock"
					/>
					<small id="defaultRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
						At least 8 characters and 1 digit
					</small>
					
					<textarea
						id="input_text_commentaire"
						className="form-control mb-4"
						name="bio"
						rows="3" cols="25"
						placeholder="Parlez de vous..."
						value={this.state.input_description} 
					/>
					{context.getChoicePrivacy()}
					<button className="btn btn-info my-4 btn-block" type="submit">Sign in</button>
					
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