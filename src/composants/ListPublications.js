// JavaScript source code
import React, { Component } from "react";
import Publication from "./Publication"
import axios from '../url/url_bdd';

import './ListPublications.css';

import Pagination from "react-js-pagination";

const jwt = require('jsonwebtoken');

export default class ListPublications extends Component {
  constructor(props) {
    super(props);
      this.state = {
		  is_on_mur: props.on_mur,
          id_user: props.idUser,
		  message:"",
		  activePage:1,
		  listPubli : []
		};
	}
  
	componentDidMount() {
		const token = localStorage.getItem("token");
		
		if(token){
			this.getListPublication(1);
		}
		else
		{
			window.location = "http://localhost:3000/auth/";
		}
	}
  
	async getListPublication(ev) {
		var listPublications = new Array();
		
		const token = localStorage.getItem("token");
		
		var optionReq = {
			method: 'GET',
			headers: {
				Authorization: "Bearer "+token
			},
			url: "http://localhost:5000/posts/"
		}
		
		try
		{
			const res = await axios(optionReq);
			
			if(res){
				const posts = res.data;
				
				
				if (posts) {
					console.log(posts);
					posts.forEach(post => listPublications.push(post))
				}
				
				if(this.state.is_on_mur)
				{
					
					var optionReq2 = {
						method: 'GET',
						headers: {
							Authorization: "Bearer "+token
						},
						url: "http://localhost:5000/posts/Abonnements/"
					}
					
					const res2 = await axios(optionReq2);
					
					if(res2)
					{
						const posts2 = res2.data;
				
				
						if (posts2) {
							console.log(posts2);
							posts2.forEach(post => listPublications.push(post))
						}
					}
				}
				
				listPublications.sort(function (post1, post2) {return post2.date - post1.date});
						
				this.setState({ listPubli: listPublications })
			}
			
		}
		catch (err)
		{
			if(err.response)
			{
				if(err.response.data.message == "Echec de l'Authentification"){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/auth";
				}
				else
				{
					console.error(err.response.data.message);
				}
			}
			this.setState({ message:err.response.data.message });
		}
			
	}
	
	async deletePost(ev, context, post)
	{
		const token = localStorage.getItem("token");
		
		var optionReq = {
			method: 'DELETE',
			headers: {
				Authorization: "Bearer "+token
			},
			data:
			{
				id: post._id
			},
			url: "http://localhost:5000/posts/"+post._id
		}
		
		try
		{
			const res = await axios(optionReq);
			
			if(res){
				var newListPosts = context.state.listPubli.filter(function(p) { return p._id!=post._id; });;
				
				context.setState({ listPubli: newListPosts });
			}
			
		}
		catch (err)
		{
			if(err.response)
			{
				if(err.response.data.message == "Echec de l'Authentification"){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/auth";
				}
				else
				{
					console.error(err.response.data.message);
				}
				context.setState({ message:err.response.data.message });
			}
		}
	}
	
	confirmDeletePost(ev, context, post)
	{
		if(window.confirm("Etes vous sûr de vouloir supprimer ce post ?"))
		{
			this.deletePost(ev, context, post);
		}
		else
		{
			ev.preventDefault();
		}
	}
	
	getOnePublicationAffichage(in_post)
	{
		var comp = undefined;
		
		const context = this;
		
		const token = localStorage.getItem("token");
		
		if(token)
		{
			const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
			if(decoded)
			{
				if(in_post.refUser == decoded.userId)
				{
					comp = (<div className="user_publication">
						<Publication post={in_post}/>
						<button onClick={(ev, context, post) => this.confirmDeletePost(ev, this, in_post)}>Supprimer le post</button>
						<hr/>
					</div>);
				}
				else
				{
					comp = (<div><Publication post={in_post}/><hr/></div>);
				}
			}
		}
		
		
		return comp;
	}
	
	changePage(ev, context)
	{
		console.log(ev);
		context.getListPublication(ev);
	}
	
	getPublicationsAffichage() {
		
		var comp = (<div></div>);
		
		const context = this;
		
		if(this.state.listPubli != undefined && this.state.listPubli.length != 0){
			comp = (<div className="list_publications">
				<div className="errorMessage">{this.state.message}</div>
				{this.state.listPubli.map(function (in_post) {
					return (context.getOnePublicationAffichage(in_post));
				})}
				<Pagination
					activePage={this.state.activePage}
					itemsCountPerPage={5}
					totalItemsCount={25}
					pageRangeDisplayed={5}
					onChange={(ev, context) => this.changePage(ev, this)}
				/>
			</div>);
		}
		else
		{
			comp = (<div>Aucun post à afficher</div>);
		}
		
		return comp;
	}
	

	render() {
		var comp;
		
		comp = (<div>
			{this.getPublicationsAffichage()}
		</div>);
		
		return comp;
	}
}