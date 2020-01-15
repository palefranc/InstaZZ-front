import axios from 'axios';
import React, { Component } from "react";

let baseUrl = "localhost:3000";

export class User extends Component {
    constructor(props) {
        super(props);
        this.state = { message: "" };
    }

    componentDidMount() {
        axios.get(baseUrl + "/user/1").then(
            res => {
                let user = res.date;
                this.setState({ user })
            })
    }

    render() {
        return (
            <div>
                this.state
            </div>
        );
    }
}