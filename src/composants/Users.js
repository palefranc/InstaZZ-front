import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import User from './User';
import Pagination from "react-js-pagination";
import Abonnement from "./Abonnement";
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
			activePage: 1,
			nbTotalElement: 0,
        };
		console.log("valeur text : " + this.state.text_search);
    }

    update_user(user) {
        this.setState({
            currentUser: user
        })
    }
	
	async getListUsers(in_page){
		const context = this;
		
		const token = localStorage.getItem("token");
		
		
		if(token){
			
			const optionReq = {
				method: 'GET',
				headers:{
					Authorization: "Bearer " +token,
					"Content-Type": "application/json"
				},
				params: 
				{
					page: in_page,
					per_page: 5
				},
				url: 'http://localhost:5000/users/UsersList'
			}
			
			console.log(optionReq);
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					const users = res.data.users;
					console.log(users);
					
					if (users && users.users && users.users.length > 0) {
						//const filteredUsers = users.filter(function (user) { return (user.username.includes(context.state.text_search));});
						const filteredUsers = users.users;
						const totalElements = users.total;
						
						this.setState({
							users: filteredUsers,
							activePage: in_page,
							nbTotalElement: totalElements,
						})
					}
				}
				
			}
			catch (err)
			{
				console.error(err);
				
				if(err.response){
					if(err.response.data)
					{
						if(err.response.data.message == "Echec de l'Authentification")
						{
							localStorage.removeItem("token");
							window.location = "http://localhost:3000/";
						}
						else
						{
							this.setState({ message:err.response.data });
						}
					}
					else
					{
						this.setState({ message:err.response });
					}
				}
				else
				{
					this.setState({ message:err });
				}
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
						if(this.state.show == "abonnes")
						{
							this.setState({ currentUser: user,
								users: user.abonnées,
								nbTotalElement: user.abonnées.length })
						}
						else if(this.state.show == "abonnements")
						{
							this.setState({ currentUser: user,
								users: user.abonnements,
								nbTotalElement: user.abonnées.length })
						}
						else
						{
							this.setState({
								currentUser: user
							})
						}
						
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
		
		if(!this.state.currentUser)
		{
			this.getCurrentUser();
		}
		
		
		if(!this.state.users && this.state.show == "research")
		{
			this.getListUsers(this.state.activePage);
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
			comp = <Abonnement user={user} change_user={this.update_user} parent={this} />
		}
			
		return comp;
		
	}
	
	getAbonnee(user){
		let comp = undefined;
		
		if(this.state.currentUser && this.state.currentUser.abonnées.includes(user))
		{
			comp = <div>S'est abonné(e) à moi</div>;
		}
		
		return comp;
	}
	
	changePage(ev, context)
	{
		console.log(ev);
		if(this.state.show.toLocaleString()=="research")
		{
			context.getListUsers(ev);
		}
	}
	
	getPagination() {
		var comp = undefined;
		
		if(this.state.users.length > 0) {
			comp = (
				<Pagination
					activePage={this.state.activePage}
					itemsCountPerPage={5}
					totalItemsCount={this.state.nbTotalElement}
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
							<img className="photo_profil" src={"http://localhost:5000" + user.image} alt="" />
							<div className="list_users_element2">
								<a className="user_name" href={url}>
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
			if(this.state.show == "abonnes")
			{
				comp = (<div className="message_empty">
					Personne n'est abonné à vous
				</div>);
			}
			else if(this.state.show == "abonnements")
			{
				comp = (<div className="message_empty">
					Vous n'êtes abonné à aucun utilisateur
				</div>);
			}
			else
			{
				comp = (<div className="message_empty">
					Aucun utilisateur n'a été trouvé
				</div>);
			}
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
		
		if(this.state.show == "abonnes" && this.state.currentUser)
		{
			this.state.users = this.state.currentUser.abonnées;
		}
		else if(this.state.show == "abonnements" && this.state.currentUser)
		{
			this.state.users = this.state.currentUser.abonnements;
		}
		
		affichage = this.showList();

        return affichage;
    }
}