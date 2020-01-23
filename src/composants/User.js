import axios from '../url/url_bdd';
import React, { Component } from "react";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = { user: props.in_user };
    }

    componentDidMount() {
        axios.get("/users/" + this.state.user._id)
            .then(res => {
                let user = res.data;
                if (user) {
                    this.setState({ user: user });
                    console.log(this.state.user);
                }
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                nom : {this.state.user.username},<br />
                description : {this.state.user.bio}<br />
                email : {this.state.user.email}
            </div>
        );
    }
}