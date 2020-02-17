// JavaScript source code
import React, { Component } from "react";
import Publication from "./Publication"
import axios from '../url/url_bdd';

export default class ListPublications extends Component {
  constructor(props) {
    super(props);
      this.state = {
		  is_on_mur: props.on_mur,
          id_user: props.idUser
		};
	}
  
	componentDidMount() {
		const token = localStorage.getItem("token_id");
		
		if(token){
			this.setState({ id_user: token });
			this.getListPublication();
		}
		else
		{
			window.location = "http://localhost:3000/auth/";
		}
	}
  
  getListPublication() {
	  var listPublications = new Array();
		
		console.log("List id user : " + this.state.id_user);
		
		const access_token = localStorage.getItem("token_id");
		
		if(access_token != undefined) {
		
			var optionReq = {
				method: 'GET',
				headers: {
					Authorization: access_token
				},
				url: "http://localhost:5000/posts/" + this.state.id_user
			}
			
			axios.get("/posts/"+this.state.id_user)
				.then(res => {
					const posts = res.data;
					
					
					if (posts) {
						console.log(posts);
						posts.forEach(post => listPublications.push(post))
					}
					
					if(this.state.is_on_mur)
					{
						axios.get("/posts/Abonnements/"+this.state.id_user).then(res => {
							const posts = res.data;
							
							
							if (posts) {
								console.log(posts);
								posts.forEach(post => listPublications.push(post))
							}
							
							listPublications.sort(function (post1, post2) {return post2.date - post1.date});
							
							this.setState({ listPubli: listPublications })
							
							
							
						}).catch(err => {
							console.error(err);
						})
					}
				
				}).catch(err => {
					console.error(err);
				})
			
		}
		
		/*
		this.state.id_users.forEach(id => {
		  
		  axios.get("/posts/"+id)
			.then(res => {
				const posts = res.data;
				
				
				if (posts) {
					console.log(posts);
					posts.forEach(post => listPublications.push(post))
				}
				
				this.setState({ listPubli: listPublications })
				
			}).catch(err => {
				console.error(err);
			})
		});
		*/
		
		
	}
	
	getPublicationsAffichage() {
		
		var comp = (<div></div>);
		
		if(this.state.listPubli != undefined){
			comp = (<div>
				{this.state.listPubli.map(function (in_post) {
					return (<Publication post={in_post}/>);
				})}
			</div>);
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