import axios from '../url/url_bdd';
import React, { Component } from "react";
import ListPublications from "./ListPublications";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = { 
			user: props.in_user,
			modif: false
		};
    }

    componentDidMount() {
		const token = localStorage.getItem("token_id");
		
        axios.get("/users/" + token)
            .then(res => {
                let user = res.data;
                if (user) {
                    this.setState({ user: user });
                    console.log(this.state.user);
                }
            })
            .catch(err => console.error(err));
    }
	
	addPost(ev, context){
		console.log(context.state);
		window.location = "http://localhost:3000/addpost/";
		
	}
	
	toggleModif(ev, context)
	{
		var new_modif = !context.state.modif;
		context.setState({modif: new_modif});
	}
	
	postModif(ev, context)
	{
		
	}
	
	getInfoUser ()
	{
		return (
			<div>
				Abonnements : {this.state.user.abonnements.length}<br />
				Abonnés : <br />
				nom : {this.state.user.username},<br />
				description : {this.state.user.bio}<br />
				email : {this.state.user.email}<br />
				<button onClick={(ev, context) => this.addPost(ev,this)}>Add Post</button>
				<ListPublications idUser={this.state.user._id} on_mur={false}/>
				<button onClick={(ev, context) => this.toggleModif(ev,this)}>Modifier</button>
			</div>
		);
	}
	
	getModifUser()
	{
		return (
			<div>
				Abonnements : {this.state.user.abonnements.length}<br />
				Abonnés : <br />
				nom : <input type="text"/><br />
				description : <input type="text"/><br />
				email : <input type="text"/><br />
				mot de passe : <input type="text"/>
				<button>Enregistrer</button>
				<button onClick={(ev, context) => this.toggleModif(ev,this)}>Annuler</button>
			</div>
		);
	}

    render() {
		var comp = <div/>;
		
		if(this.state.user){
		
			var listIdUsersForPost = new Array();
			
			listIdUsersForPost.push(this.state.user._id);
			
			
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