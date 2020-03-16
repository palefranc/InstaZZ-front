import axios from '../url/url_bdd';
import React, { Component } from "react";

import ListPublications from "./ListPublications";
import Abonnement from "./Abonnement";

import './User.css';

const jwt = require('jsonwebtoken');
//var ReactTestUtils = require('react-dom/test-utils');

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = { 
			user: props.in_user,
			posts: [],
			modified_user: props.in_user,
			modif: false
		};
    }

    async componentDidMount() {
		if(!this.state.user)
		{
			var idUser = undefined;
			
			if(this.props && this.props.match 
				&& this.props.match.params
				&& this.props.match.params.idUser)
			{
				idUser = this.props.match.params.idUser;
			}
			
			console.log(idUser);
			
			var optionReq = undefined;
			
			const token = localStorage.getItem("token");
			
			if(idUser)
			{
				console.log("Il faut afficher le user " + idUser);
				
				optionReq = {
					method: 'GET',
					headers:{
						Authorization: "Bearer " +token
					},
					url: 'http://localhost:5000/users/user/'+idUser
				}
			}
			else
			{
			
				if(token){
					
					optionReq = {
						method: 'GET',
						headers:{
							Authorization: "Bearer " +token
						},
						url: 'http://localhost:5000/users/user/'
					}
				}
				else
				{
					window.location = "http://localhost:3000/auth/";
				}
			}
			
				
			if(optionReq)
			{
				try
				{
					const res = await axios(optionReq);
					
					if(res){
						const user = res.data;
						
						if (user) {
							this.setState({ user: user });
						}
					}
					
				}
				catch (err)
				{
					
					if(err.response)
					{
						if(Number(err.response.status) == 401){
							localStorage.removeItem("token");
							window.location = "http://localhost:3000/";
						}
						else if(Number(err.response.status) == 500)
						{
							console.error(err.response.data.message);
						}
					}
					
				}
			}
			
		}
		
		if(!this.state.modif)
		{
			this.state["modified_user"] = this.state.user;
		}
    }
	
	addPost(ev, context){
		console.log(context.state);
		window.location = "http://localhost:3000/addpost/";
		
	}
	
	toggleModif(ev, context)
	{
		var new_modif = !context.state.modif;
		context.setState({ modif: new_modif });
		this.state["modified_user"] = this.state.user;
	}
	
	changeField(ev, context)
	{
		const idChamp = ev.target.id;
		
		switch(idChamp)
		{
			case "defaultRegisterFormLastName":
				context.setState({ modified_user: {...context.state.modified_user, username: ev.target.value }});
				break;
				
			case "input_desc":
				context.setState({ modified_user: {...context.state.modified_user, bio: ev.target.value }});
				break;
				
			case "defaultRegisterFormEmail":
				context.setState({ modified_user: {...context.state.modified_user, email: ev.target.value }});
				break;
				
			case "defaultRegisterFormPassword":
				context.setState({ modified_user: {...context.state.modified_user, password: ev.target.value }});
				break;
				
			default:
				break;
		}
	}
	
	
	getChoicePrivacy()
	{
		var comp = undefined;
		
		if(this.state.modified_user.status == "private")
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
							checked onChange={(ev, context) => {this.changePrivacy(ev, this)}} />
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
		
		this.setState({ modified_user: {...this.state.modified_user, status: ev.target.value }});
	}
	
	
	async saveModif(ev, context)
	{
		
		var modifiedChamps = new Array();
		
		if(!(context.state.user.username == context.state.modified_user.username))
		{
			modifiedChamps.push({ propName: "username" , value: context.state.modified_user.username });
		}
		
		if(!(context.state.user.bio == context.state.modified_user.bio))
		{
			modifiedChamps.push({ propName: "bio" , value: context.state.modified_user.bio });
		}
		
		if(!(context.state.user.email == context.state.modified_user.email))
		{
			modifiedChamps.push({ propName: "email" , value: context.state.modified_user.email });
		}
		
		if(!(context.state.user.password == context.state.modified_user.password))
		{
			modifiedChamps.push({ propName: "password" , value: context.state.modified_user.password });
		}
		
		if(!(context.state.user.status == context.state.modified_user.status))
		{
			modifiedChamps.push({ propName: "status" , value: context.state.modified_user.status });
		}
		
		const token = localStorage.getItem("token");
		
		if(token){
			
			
			const optionReq = {
				method: 'POST',
				headers:{
					Authorization: "Bearer " +token
				},
				data: modifiedChamps,
				url: 'http://localhost:5000/users/'
			}
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					context.setState({ modif: false, user: context.state.modified_user });
				}
				
			}
			catch (err)
			{
				if(err.response)
				{
					if(err.response.status == 401){
						localStorage.removeItem("token");
						window.location = "http://localhost:3000/";
					}
					else
					{
						console.error(err.response.data.message);
					}
				}
			}
		}
		else
		{
			window.location = "http://localhost:3000/auth/";
		}
	}
	
	confirmDelete(ev, context)
	{
		if(window.confirm("Attention ! Votre profil, et tout son contenu seront définitivement supprimés ! \nEtes vous sûr ?"))
		{
			this.deleteUser(ev, context);
		}
		else
		{
			//console.log("Annulation suppression du profil");
			ev.preventDefault();
		}
	}
	
	async deleteUser(ev, context)
	{
		//console.log("Suppression du profil");
		
		const token = localStorage.getItem("token");
		
		if(token){
			
			const optionReq = {
				method: 'DELETE',
				headers:{
					Authorization: "Bearer " +token
				},
				url: 'http://localhost:5000/users/'
			}
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/";
				}
				
			}
			catch (err)
			{
				
				if(err.response)
				{
					if(err.response.status == 401){
						localStorage.removeItem("token");
						window.location = "http://localhost:3000/";
					}
					else if(err.response.status == 500)
					{
						console.error(err.response.data.message);
					}
				}
				
			}
		}
		else
		{
			window.location = "http://localhost:3000/auth/";
		}
	}
	
	getInfosQuantite()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(decoded.userId == this.state.user._id)
		{
			comp = (
				<div className="infos_quantite">
					<div className="nb_post">
						{this.state.posts.length}<br /> posts
					</div>
					<a className="nb_abonnees" href="http://localhost:3000/users/abonnes">
						{this.state.user.abonnées.length}<br /> abonnés
					</a><br/>
					<a className="nb_abonnements" href="http://localhost:3000/users/abonnements">
						{this.state.user.abonnements.length}<br /> abonnements
					</a><br/>
					<a className="nb_demandes" href="http://localhost:3000/users/demandes">
						{this.state.user.demandes.length}<br /> demandes
					</a>
				</div>
			);
		}
		else
		{
			comp = (
				<div className="infos_quantite">
					<div className="nb_post">
						{this.state.posts.length}<br /> posts
					</div>
					<div className="nb_abonnees">
						{this.state.user.abonnées.length}<br /> abonnés
					</div><br/>
					<div className="nb_abonnements">
						{this.state.user.abonnements.length}<br /> abonnements
					</div>
				</div>
			);
		}
		
		return comp;
	}
	
	getPrivacy()
	{
		var comp = undefined;
		
		if(this.state.user.status == "private")
		{
			comp = <div className="privacy">Utilisateur privé</div>
		}
		
		return comp;
	}
	
	getButtonsAction()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		console.log(this.state.user);
		
		if(decoded.userId == this.state.user._id)
		{
			comp = (
				<div className="infos_user3">
					<button className="btn btn-info btn-block my-4"
						onClick={(ev, context, oldUser) => this.toggleModif(ev,this, this.state.user)}>
						Modifier les infos
					</button>
					<button className="btn btn-info btn-block my-4"
						onClick={(ev, context) => this.addPost(ev,this)}>
						Ajouter un post
					</button>
				</div>
			);
		}
		else
		{
			comp = <Abonnement user={this.state.user} />
		}
		
		return comp;
	}
	
	getPublications()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		/*
		if(decoded.userId != this.state.user._id && this.state.user.status == "private" && )
		{
			comp = (<div className="error_publications">
				Vous ne pouvez pas voir les posts d'un utilisateur privée.
				<br />
				Si vous voulez les voir, abonnez-vous à cet utilisateur.
			</div>)
		}
		else
		{
			comp = (<ListPublications idUser={this.state.user._id} on_mur={false}/>);
		}
		*/
		
		comp = (<ListPublications idUser={this.state.user._id} on_mur={false}/>);
		
		return comp;
	}
	
	getButtonDelete()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(decoded.userId == this.state.user._id)
		{
			comp = (<button className="btn btn-info btn-block my-4 button_delete_user"
				onClick={(ev, context) => this.confirmDelete(ev,this)}>Supprimer profil</button>);
		}
		
		return comp;
	}
	
	getInfoUser ()
	{
		const context = this;
		
		return (
			<div className="user">
				<div className="infos_user">
				<img className="photo_profil" src={"http://localhost:5000" + this.state.user.image} alt="" />
					<div className="infos_user2">
						{context.getInfosQuantite()}
						<div className="user_name">{this.state.user.username}</div>
						
						description : {this.state.user.bio}<br />
						email : {this.state.user.email}<br />
						{context.getPrivacy()}
					</div>
					{context.getButtonsAction()}
				</div>
				<div className="publications_user">
					<hr/>
					{context.getPublications()}
					{context.getButtonDelete()}
				</div>
			</div>
		);
	}
	
	getModifUser()
	{
		return (
			<div className="input_infos_user">
				<form className="text-center border border-light p-5" onSubmit={(ev, context) => this.saveModif(ev,this)}>

					<p className="h4 mb-4">Modifier les informations vous concernant : </p>

					<div className="form-row mb-4">
						<div className="col">
							<input type="text"
								id="defaultRegisterFormLastName"
								className="form-control"
								placeholder="User name"
								value={this.state.modified_user.username}
								onChange={(ev, context) => this.changeField(ev,this)} />
						</div>
					</div>
					
					<textarea
						id="input_desc"
						className="form-control mb-4"
						rows="3" cols="25"
						placeholder="Description"
						value={this.state.modified_user.bio}
						onChange={(ev, context) => this.changeField(ev,this)}
					/>

					<input type="email"
						id="defaultRegisterFormEmail"
						className="form-control mb-4"
						placeholder="E-mail"
						value={this.state.modified_user.email}
						onChange={(ev, context) => this.changeField(ev,this)}
					/>

					<input
						type="password"
						id="defaultRegisterFormPassword"
						className="form-control"
						placeholder="Password"
						aria-describedby="defaultRegisterFormPasswordHelpBlock"
						onChange={(ev, context) => this.changeField(ev,this)}
					/>
					<small id="defaultRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
						At least 8 characters and 1 digit
					</small>
					{this.getChoicePrivacy()}
					<hr />
					
					<button type="submit" className="btn btn-info my-4 btn-block">Enregistrer</button>
					<button className="btn btn-info my-4 btn-block" onClick={(ev, context) => this.toggleModif(ev,this)}>Annuler</button>

				</form>
			</div>
		);
	}

    render() {
		var comp = <div/>;
		
		if(this.state.user){
			
			
			if(this.state.modif)
			{
				comp = this.getModifUser();
			}
			else
			{
				comp = this.getInfoUser();
			}
		}
		
        return comp;
    }
}