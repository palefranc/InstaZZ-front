import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import './Abonnement.css';

const jwt = require('jsonwebtoken');

export default class Abonnement extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            message: "",
			user: props.user,
			change_current_user: props.change_user,
			parent: props.parent
        };
	}
	
	async subscribe(ev, user){
		
		const token = localStorage.getItem("token");
		
		var options = {
			method: 'POST',
			headers: {
				Authorization: "Bearer "+token
			},
			data: { id: user._id },
			url: "http://localhost:5000/users/addAbonement/"
		}
		
		try
		{
			const res = await axios(options);
			
			console.log(res);
			
			window.alert("Demande d'abonnements envoyée")

			/*
			if(res && res.status == 200){
				var newUser = this.state.currentUser;
				
				if(newUser)
				{
					newUser.abonnements.push(user._id);
					this.setState({ currentUser: newUser });
				}
			}
			*/
		}
		catch (err)
		{
			console.error(err);
			
			if(err.response && err.response.data.message == "Echec de l'Authentification"){
				localStorage.removeItem("token");
				window.location = "http://localhost:3000/";
			}
			this.setState({ message:err.response.data.message });
		}
	}
	
	async unsubscribe(ev, user){
		const token = localStorage.getItem("token");
		
		var options = {
			method: 'POST',
			headers: {
				Authorization: "Bearer " +token
			},
			data: { id: user._id },
			url: "http://localhost:5000/users/removeAbonement/"
		}
		
		try
		{
			const res = await axios(options);
			console.log(res);

			if(res && res.status == 200){
				
				if(res.data)
				{
					console.log(res.data);
					const user = res.data;
					
					this.state.parent.setState({ currentUser: user });
					
					this.setState({ users: user.abonnements });
				}
				
			}
		}
		catch (err)
		{
			console.error(err);
			
			if(err.response && err.response.data.message == "Echec de l'Authentification"){
				localStorage.removeItem("token");
				window.location = "http://localhost:3000/";
			}
			this.setState({ message:err.response.data.message });
		}
	}
	
	async removeSubscriber(ev, user)
	{
		const token = localStorage.getItem("token");
		
		var options = {
			method: 'POST',
			headers: {
				Authorization: "Bearer " +token
			},
			data: { id: user._id },
			url: "http://localhost:5000/users/removeAbonnee/"
		}
		
		try
		{
			const res = await axios(options);
			console.log(res);

			if(res && res.status == 200){
				
				if(res.data)
				{
					console.log(res.data);
					const user = res.data;
					
					console.log(this.state.parent);
					
					this.state.parent.setState({ currentUser: user });
					
					/*
					if(this.state.change_current_user)
					{
						this.state.change_current_user(user);
					}
					*/
				}
			}
		}
		catch (err)
		{
			console.error(err);
			
			if(err.response && err.response.data.message == "Echec de l'Authentification"){
				localStorage.removeItem("token");
				window.location = "http://localhost:3000/";
			}
			this.setState({ message:err.response.data.message });
		}
		
	}
	
	getBoutonRemoveAbonne(user)
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(this.state.user && this.state.user.abonnements.includes(decoded.userId)){
			comp = <button className="btn btn-info my-4 btn-block button_desabonner"
				onClick={(ev, us) => this.removeSubscriber(ev, user)}>
				Desabonner
			</button>
		}
			
		return comp;
	}
	
	render()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(this.state.user && this.state.user.abonnées.includes(decoded.userId))
		{
			comp = (<div className="button_action">
				<button className="btn btn-info my-4 btn-block button_abonner"
					onClick={(ev, us) => this.unsubscribe(ev, this.state.user)}>
					Se desabonner
				</button>
				{this.getBoutonRemoveAbonne(this.state.user)}
			</div>);
		}
		else
		{
			comp = (<div className="button_action">
				<button className="btn btn-info my-4 btn-block button_desabonner"
					onClick={(ev, us) => this.subscribe(ev, this.state.user)}>
					S'abonner
				</button>
				{this.getBoutonRemoveAbonne(this.state.user)}
			</div>);
		}
		
		return comp;
	}
}