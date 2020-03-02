import axios from '../url/url_bdd';
import React, { Component } from "react";
import ListPublications from "./ListPublications";

import './User.css';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = { 
			user: props.in_user,
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
			
			var optionReq = undefined;
			
			const token = localStorage.getItem("token");
			
			if(idUser)
			{
				console.log("Il faut afficher le user " + idUser);
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
			case "input_name":
				context.setState({ modified_user: {...context.state.modified_user, username: ev.target.value }});
				break;
				
			case "input_desc":
				context.setState({ modified_user: {...context.state.modified_user, bio: ev.target.value }});
				break;
				
			case "input_email":
				context.setState({ modified_user: {...context.state.modified_user, email: ev.target.value }});
				break;
				
			case "input_pwd":
				context.setState({ modified_user: {...context.state.modified_user, password: ev.target.value }});
				break;
				
			default:
				break;
		}
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
	
	getInfoUser ()
	{
		return (
			<div className="user">
				<div className="infos_user">
					<div className="user_name">{this.state.user.username}</div>
					<div className="infos_quantite"> 
						{this.state.user.posts.length} posts
						{this.state.user.abonnées.length} abonnés
						{this.state.user.abonnements.length} abonnements
					</div>
					description : {this.state.user.bio}<br />
					email : {this.state.user.email}<br />
					<button onClick={(ev, context, oldUser) => this.toggleModif(ev,this, this.state.user)}>Modifier les infos</button>
				</div>
				<div className="publications_user">
					<button className="button_ajout" onClick={(ev, context) => this.addPost(ev,this)}>Ajouter un post</button>
					<hr/>
					<ListPublications idUser={this.state.user._id} on_mur={false}/>
					<button className="button_delete_user" onClick={(ev, context) => this.confirmDelete(ev,this)}>Supprimer profil</button>
				</div>
			</div>
		);
	}
	
	getModifUser()
	{
		return (
			<div className="input_infos_user">
				Abonnements : {this.state.user.abonnements.length}<br />
				Abonnés : {this.state.user.abonnées.length}<br />
				<div className="titre">Modifier les informations vous concernant : </div>
				nom : <input type="text" id="input_name" value={this.state.modified_user.username} onChange={(ev, context) => this.changeField(ev,this)}/><br />
				description : <input type="text" id="input_desc" value={this.state.modified_user.bio} onChange={(ev, context) => this.changeField(ev,this)}/><br />
				email : <input type="text" id="input_email" value={this.state.modified_user.email} onChange={(ev, context) => this.changeField(ev,this)}/><br />
				mot de passe : <input type="password" id="input_pwd" onChange={(ev, context) => this.changeField(ev,this)}/>
				<br />
				<button className="button_save_modif" onClick={(ev, context) => this.saveModif(ev,this)}>Enregistrer</button>
				<button className="button_cancel_modif" onClick={(ev, context) => this.toggleModif(ev,this)}>Annuler</button>
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