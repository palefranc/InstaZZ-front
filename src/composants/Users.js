import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import User from './User';


//attribut show: "list" -> montre tous les utilisateurs, avec des donnees reduites
//         show: "details" -> montre les informations detaillees a propos d'un utilisateur. Affiche le component User
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
            show: "list",
            message: "Il n'y a qu'un seul user :",
			text_search: text,
            users: []
        };
		console.log("valeur text : " + this.state.text_search);
    }

    update(users) {
        this.setState({
            message: "Voici la liste des users",
            users: users
        })
    }
	
	subscribe(ev, user){
		
		const access_token = localStorage.getItem("token_id");
		
		var options = {
			method: 'POST',
			headers: {
				Authorization: access_token
			},
			body: { id: user._id },
			url: "http://localhost:5000/users/addAbonement/" + access_token
		}
		
		axios(options)
			.then(res => {
				const user = res.data;
				
				if (user) {
					
				}
				
			}).catch(err => {
				console.error(err);
			})
		
		/*
		
		axios.get("/users/"+id)
                .then(res => {
                    const user = res.data;
                    if (user) {
                        this.setState({
                            message: res.status,
                            users: [user]
                        })
                    }
                }).catch(err => {
                    console.error(err);
                })
				*/
	}
	
	unsubscribe(ev, user){
		const access_token = localStorage.getItem("token_id");
		
		var options = {
			method: 'POST',
			params: { userId: access_token},
			headers: {
				Authorization: access_token
			},
			url: "http://localhost:5000/removeAbonement/" + user._id
		}
		
		axios(options)
			.then(res => {
				const user = res.data;
				
				if (user) {
					
				}
				
			}).catch(err => {
				console.error(err);
			})
	}

    componentDidMount() {
		var url = "/users/";
		
        if (this.state.show.toLocaleString()=="details") {
			
			const token = localStorage.getItem("token_id");
            //var id = this.state.users[0]._id;
            
			url = url + token;
        }
        else {
			if(this.state.text_search){
				url = url + this.state.text_search;
			}
        }
		
		console.log(this.state.text_search);
		console.log(url);
		
		axios.get(url)
			.then(res => {
				const users = res.data.users;

				
				if (users) {
					this.setState({
						message: res.status,
						users: users
					})
				}
			}).catch(err => {
				console.error(err);
			})
    }
	
	getBoutonSubscribe(user) {
		var comp = <div/>;
		
		const access_token = localStorage.getItem("token_id");
		
		if(user._id == access_token){
			comp = <p className="ItsMe">C'est moi</p>
			
			return comp;
		}
		else{
			
			//#TODO : A supprimer, transmettre les données autrement
			axios.get("/users/" + access_token)
				.then(res => {
					const user = res.data;
					
					
					if (user) {
						const abonnements = user.abonnements;
						console.log(abonnements);
						
						if(abonnements.includes(user._id)){
							console.log("je suis abonné");
							
							comp = <button onClick={(ev, us) => this.unsubscribe(ev, user)}>Unsubscribe</button>
						}
						else{
							console.log("je ne suis pas abonné");
							comp = <button onClick={(ev, us) => this.subscribe(ev, user)}>Subscribe</button>
						}
						
						return comp;
						
					}
				}).catch(err => {
					console.error(err);
				})
		}
		
	}

    showList() {
		const context = this;
		
        return (
            <div>
                <ul>
                {this.state.users.map(function (user) {
                        return (<li>
                            {user.username} <br /> {user.email} <br />
							<button onClick={(ev, us) => context.subscribe(ev, user)}>Subscribe</button>
							{context.getBoutonSubscribe(user)}
                        </li>);
                })}
                </ul>
            </div>
        );
    }

    showDetails() {
        //console.log(this.state.users[0]);
        return (
            <div>
                <User in_user={this.state.users[0]} />
            </div>
        );
    }

    render() {
        var affichage;

        if (this.state.show.toLocaleString()=="details") {
            affichage = this.showDetails();
        }
        else {
            affichage = this.showList();
        }

        return affichage;
    }
}