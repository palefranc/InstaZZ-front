import React, { Component } from "react";

export default class Publication extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  test() {
    alert(this.state.message);
  }

  updateMessage(message) {
    this.setState({ message });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          onChange={event => this.updateMessage(event.target.value)}
        />
        <button onClick={() => this.test()}>Valider</button>
      </div>
    );
  }
}
