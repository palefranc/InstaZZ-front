import axios from 'axios';
import React, { Component } from "react";

let baseUrl = "localhost:3000";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = props.in_user;
    }

    componentDidMount() {
        let url_request = baseUrl + "/user/" + this.state._id;
        //this.setState({ email: url_request });
        axios.get(url_request)
            .then(res => {
                let user = res.date;
                this.setState({ user })
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                nom : {this.state.username},<br />
                description : {this.state.bio}<br />
                email : {this.state.email}
            </div>
        );
    }
}