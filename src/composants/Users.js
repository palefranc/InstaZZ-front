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
        this.setState({
            message: axios.defaults.baseURL + "/user",
            users: []
        })

        if (this.state.show == "details") {
            var id = this.state.users[0]._id;
            axios.get("/user/"+id)
                .then(res => {
                    const user = res.date;
                    this.update(users);
                    this.setState({
                        message: res.status,
                        users: users
                    })
                }).catch(err => {
                    console.error(err);
                })
        }
        else {
            axios.get("/user")
                .then(res => {
                    const users = res.date;
                    this.update(users);
                    this.setState({
                        message: res.status,
                        users: users
                    })
                }).catch(err => {
                    console.error(err);
                })
        }
    }

    showList() {
        return (
            <div>
                {this.state.message}
                <ul>
                    {
                        this.state.users.map(
                            user => <li>
                                {user.username} <br /> {user.email}
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }

    showDetails() {
        return (
            <div>
                <User in_user={this.state.users[0]} />
            </div>
        );
    }

    render() {
        var affichage;

        if (this.state.show == "details") {
            affichage = this.showDetails();
        }
        else {
            affichage = this.showList();
        }

        return affichage;
    }
}