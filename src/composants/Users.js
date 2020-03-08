import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import User from './User';
import Pagination from "react-js-pagination";
import './Users.css';

const jwt = require('jsonwebtoken');

//attribut show: "research" -> montre tous les utilisateurs dont le text apparait dans le nom
//         show: "abonnes" -> montre les utilisateurs abonnées à l'utilisateur courrant
//         show: "abonnements" -> montre les utilisateurs auxquel l'utilisateur courrant s'est abonné
export default class Users extends Component {
    constructor(props) {
        super(props);
		
		var text = "";
		
		text = localStorage.getItem("token_search");
		
		if(text!=undefined && text!=""){
			localStorage.removeItem("token_search");
		}
		else{
			text = "";
		}
		
        this.state = {
            show: props.list_type,
            message: "",
			text_search: text,
			currentUser: undefined,
            users: undefined,
			activePage: 1
        };
		console.log("valeur text : " + this.state.text_search);
    }

    update(users) {
        this.setState({
            message: "",
            users: users
        })
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

			if(res && res.status == 200){
				var newUser = this.state.currentUser;
				
				if(newUser)
				{
					newUser.abonnements.push(user._id);
					this.setState({ currentUser: newUser });
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

			if(res && res.status == 200){
				var newUser = this.state.currentUser;
				
				if(newUser)
				{
					newUser.abonnements = newUser.abonnements.filter(function(id) { return id!=user._id; });
					this.setState({ currentUser: newUser });
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
	
	async getListUsers(in_page){
		const context = this;
		
		const token = localStorage.getItem("token");
		
		var url = 'http://localhost:5000/users/' + in_page;
		
		if(token){
			
			const optionReq = {
				method: 'GET',
				headers:{
					Authorization: "Bearer " +token,
					"Content-Type": "application/json"
				},
				url: 'http://localhost:5000/users/'
			}
			
			console.log(optionReq);
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					const users = res.data.users;
					console.log(users);
					
					if (users) {
						const filteredUsers = users.filter(function (user) { return (user.username.includes(context.state.text_search));});
						
						this.setState({
							users: filteredUsers,
							activePage: in_page
						})
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
	}
	
	async getCurrentUser()
	{
		const token = localStorage.getItem("token");
		
		if(token){
			
			const optionReq = {
				method: 'GET',
				headers:{
					Authorization: "Bearer " +token
				},
				url: 'http://localhost:5000/users/user'
			}
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					const user = res.data;

					
					if (user) {
						this.setState({
							currentUser: user
						})
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
	}

    componentDidMount() {
		/*
        if (this.state.show.toLocaleString()=="details") {
			
        }
        else {
			
        }
	*/
		if(!this.state.users)
		{
			this.getListUsers(this.state.activePage);
		}
		
		if(!this.state.currentUser)
		{
			this.getCurrentUser();
		}
    }
	
	getBoutonSubscribe(user) {
		var comp = <div/>;
		
		const token = localStorage.getItem("token");
		
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(user._id == decoded.userId){
			comp = <p className="ItsMe">C'est moi</p>
		}
		else{
			if(this.state.currentUser && this.state.currentUser.abonnements.includes(user._id))
			{
				comp = <button onClick={(ev, us) => this.unsubscribe(ev, user)}>Se desabonner</button>;
			}
			else
			{
				comp = <button onClick={(ev, us) => this.subscribe(ev, user)}>S'abonner</button>;
			}
		}
			
		return comp;
		
	}
	
	getAbonnee(user){
		let comp = undefined;
		
		if(this.state.currentUser && this.state.currentUser.abonnées.includes(user._id))
		{
			comp = <div>S'est abonné(e) à moi</div>;
		}
		
		return comp;
	}
	
	changePage(ev, context)
	{
		console.log(ev);
		context.getListUsers(ev);
	}
	
	getPagination() {
		var comp = undefined;
		
		if(this.state.users.length > 0) {
			comp = (
				<Pagination
					activePage={this.state.activePage}
					itemsCountPerPage={5}
					totalItemsCount={25}
					pageRangeDisplayed={5}
					onChange={(ev, context) => this.changePage(ev, this)}
				/>);
		}
		
		return comp;
	}

    showList() {
		const context = this;
		
		var comp = undefined;
		
		if(this.state.users && this.state.users.length > 0)
		{
			comp = (
				<div>
					<div className="errorMessage">{this.state.message}</div>
					<div className="list_users">
					{context.state.users.map(function (user) {
						const url = "http://localhost:3000/profil/" + user._id
						return (<div className="list_users_element">
							<img className="photo_profil" src="" alt="" />
							<div className="list_users_element2">
								<a href={url}>
									{user.username}
								</a>
								<br />
								{user.email}
								<br />
								{context.getAbonnee(user)}
								{context.getBoutonSubscribe(user)}
							</div>
							<hr/>
						</div>);
					})}
					{this.getPagination()}
					</div>
				</div>
			);
		}
		else
		{
			comp = comp = (<div>Aucun utilisateur n'a été trouvé</div>);
		}
		
        return comp;
    }
	
	showListAbonnees() {
		const context = this;
		
		var comp = undefined;
		
		if(this.state.currentUser && this.state.currentUser.abonnées && this.state.currentUser.abonnées.length > 0)
		{
			comp = (
				<div>
					<div className="errorMessage">{this.state.message}</div>
					<div className="list_users">
					{context.state.currentUser.abonnées.map(function (user) {
						const url = "http://localhost:3000/profil/" + user._id
						return (<div className="list_users_element">
							<img className="photo_profil" src="" alt="" />
							<div className="list_users_element2">
								<a href={url}>
									{user.username}
								</a>
								<br />
								{user.email}
								<br />
								{context.getAbonnee(user)}
								{context.getBoutonSubscribe(user)}
							</div>
							<hr/>
						</div>);
					})}
					{this.getPagination()}
					</div>
				</div>
			);
		}
		else
		{
			comp = (<div>Aucun utilisateur ne s'est abonné à vous</div>);
		}
		
		return comp;
	}
	
	showListAbonnements() {
		const context = this;
		
		var comp = undefined;
		
		if(this.state.currentUser && this.state.currentUser.abonnements && this.state.currentUser.abonnements.length > 0)
		{
			comp = (
				<div>
					<div className="errorMessage">{this.state.message}</div>
					<div className="list_users">
					{context.state.currentUser.abonnements.map(function (user) {
						const url = "http://localhost:3000/profil/" + user._id
						return (<div className="list_users_element">
							<img className="photo_profil" src="" alt="" />
							<div className="list_users_element2">
								<a href={url}>
									{user.username}
								</a>
								<br />
								{user.email}
								<br />
								{context.getAbonnee(user)}
								{context.getBoutonSubscribe(user)}
							</div>
							<hr/>
						</div>);
					})}
					{this.getPagination()}
					</div>
				</div>
			);
		}
		else
		{
			comp = (<div>Vous n'êtes abonné à aucun utilisateur</div>);
		}
		
		return comp;
	}

    showDetails() {
        //console.log(this.state.users[0]);
        return (
            <div>
				<div className="errorMessage">{this.state.message}</div>
                <User in_user={this.state.users[0]} />
            </div>
        );
    }

    render() {
        var affichage;

        if (this.state.show.toLocaleString()=="abonnes") {
            affichage = this.showListAbonnees();
        }
		else if(this.state.show.toLocaleString()=="abonnements") {
            affichage = this.showListAbonnements();
        }
        else if(this.state.show.toLocaleString()=="research") {
            affichage = this.showList();
        }

        return affichage;
    }
}