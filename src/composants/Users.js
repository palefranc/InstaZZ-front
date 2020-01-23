import axios from '../url/url_bdd';
//import axios from 'axios';
import React, { Component } from "react";
import User from './User';


//attribut show: "list" -> montre tous les utilisateurs, avec des donnees reduites
//         show: "details" -> montre les informations detaillees a propos d'un utilisateur. Affiche le component User
export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "list",
            message: "Il n'y a qu'un seul user :",
            users: []
        };
    }

    update(users) {
        this.setState({
            message: "Voici la liste des users",
            users: users
        })
    }

    componentDidMount() {
        if (this.state.show.toLocaleString()=="details") {
            var id = this.state.users[0]._id;
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
        }
        else {
            axios.get("/users")
                .then(res => {
                    const users = res.data.users;
					if(users) {
						this.setState({
							message: res.status,
							users: users
						})
						
					}
                }).catch(err => {
                    console.error(err);
                })
        }
    }

    showList() {
        return (
            <div>
                <ul>
                {this.state.users.map(function (user) {
                        return (<li>
                            {user.username} <br /> {user.email}
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