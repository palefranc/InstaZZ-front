import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import Pagination from "react-js-pagination";

import './Demandes.css';

const jwt = require('jsonwebtoken');

//attribut show: "research" -> montre tous les utilisateurs dont le text apparait dans le nom
//         show: "abonnes" -> montre les utilisateurs abonnées à l'utilisateur courrant
//         show: "abonnements" -> montre les utilisateurs auxquel l'utilisateur courrant s'est abonné
export default class Demandes extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            message: "",
			demandes: undefined,
			activePage: 1
        };
	}
	
	componentDidMount()
	{
		if(!this.state.demandes)
		{
			this.getDemandes(1);
		}
	}
	
	async getDemandes(ev)
	{
		const context = this;
		
		const token = localStorage.getItem("token");
		
		var optionReq = undefined;
		
		if(token){
			
			optionReq = {
				method: 'GET',
				headers:{
					Authorization: "Bearer " +token
				},
				url: 'http://localhost:5000/users/user/'
			}
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					const user = res.data;
					
					if(user)
					{
						if(user.demandes)
						{
							this.setState({ demandes: user.demandes })
						}
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
	
	async acceptDemande(ev, demande)
	{
		const token = localStorage.getItem("token");
		
		var optionReq = undefined;
		
		if(token){
			
			optionReq = {
				method: 'POST',
				headers:{
					Authorization: "Bearer " +token
				},
				data:
				{
					id: demande._id
				},
				url: 'http://localhost:5000/users/acceptAbonement/'
			}
			
			console.log(optionReq);
			
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					console.log(res);
					
					if(res.data)
					{
						const user = res.data;
						
						this.setState({ demandes: user.demandes })
					}
					
					//window.location = "http://localhost:3000/profil/";
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
	
	async refuseDemande(ev, demande)
	{
		const token = localStorage.getItem("token");
		
		var optionReq = undefined;
		
		if(token){
			
			optionReq = {
				method: 'POST',
				headers:{
					Authorization: "Bearer " +token
				},
				data:
				{
					id: demande._id,
				},
				url: 'http://localhost:5000/users/declineAbonement/'
			}
			
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					console.log(res);
					
					if(res.data)
					{
						const user = res.data;
						
						this.setState({ demandes: user.demandes })
					}
					//window.location = "http://localhost:3000/profil/";
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
	
	getButtons(demande) {
		var comp = <div/>;
		
		comp = (<div className="button_action_demande">
			<button className="btn btn-info btn-block button_accepter_demande" onClick={(ev, dem) => this.acceptDemande(ev, demande)}>Accepter</button>
			<br />
			<button className="btn btn-info btn-block button_refuser_demande" onClick={(ev, dem) => this.refuseDemande(ev, demande)}>Refuser</button>
		</div>);
			
		return comp;
		
	}
	
	showListDemandes()
	{
		const context = this;
		
		var comp = undefined;
		
		if(this.state.demandes && this.state.demandes.length > 0)
		{
			comp = (
				<div>
					<div className="errorMessage">{this.state.message}</div>
					<div className="list_demandes">
					{context.state.demandes.map(function (demande) {
						const url = "http://localhost:3000/profil/" + demande._id
						return (<div className="demande_element">
							<img className="photo_profil" src={"http://localhost:5000" + demande.image} alt="" />
							<div className="demande_element2">
								<a href={url}>
									{demande.username}
								</a>
								<br />
								{demande.email}
								<br />
							</div>
							{context.getButtons(demande)}
						</div>);
					})}
					</div>
				</div>
			);
		}
		else
		{
			comp = (<div>
				Aucune demande n'a été trouvée
			</div>);
		}
		
        return comp;
	}
	
	render()
	{
		return this.showListDemandes();
	}
}