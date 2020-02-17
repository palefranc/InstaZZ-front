import React, { Component } from "react";
import ImageUploader from 'react-images-upload';

export default class Publication extends Component {
  constructor(props) {
    super(props);
      this.state = {
		  idUser: undefined,
		  image: {},
          post: props.post,
          modifiable: props.modifiable
      };
  }

  test() {
    alert(this.state.message);
  }
  
  componentDidMount() {
	  var token_id = localStorage.getItem("token_id");
	  this.setState({idUser: token_id});
	  this.setState({ post: { date: "", description: "", image: "", likes: [], comments:[] } })
  }
  
  loadImage(ev){
	  /*
	  if(ev != undefined)
	  {
		  var image = ev.target.value;
		  console.log(ev.target.files[0]);
		  
		  this.setState({image: image});
		  
	  }
	  */
  }
  
  getImage(ev, img, context) {
	  
	  context.setState({
		  image: img
	  });
	  
	  console.log("image chargée");
  }
  
  publicateImage(){
	  
  }
  
  publicatePost(){
	  //this.publicateImage();
	  
	  var postToSend = {};
	  
	  //axios.post();
	  
	  window.location = "http://localhost:3000/";
  }

  updatePost(message) {
    this.setState({ message });
  }

    render() {
        var comp;

        if (this.state.modifiable || this.state.post == undefined) {
            comp = (<div>
				<p>Ajoutez une image :</p>
				<ImageUploader
					withIcon={true}
					buttonText='Chargez une image'
					onChange={(ev, img) => this.getImage(ev, img, this)}
					imgExtension={['.jpg', '.gif', '.png', '.gif']}
					maxFileSize={5242880}
				/>
				<br />
				<br />
                <input
                    type="text"
					placeholder="Ecrivez ici"
                    onChange={event => this.updatePost(event.target.value)}
                />
				<br />
                <button onClick={() => this.publicatePost()}>Publier</button>
            </div>);
        }
        else {
            comp = (<div>
                <img src={"http://localhost:5000/image" + this.state.post.image}
					alt={"http://localhost:5000/image" + this.state.post.image} />
                <p>
					{this.state.post.date} <br />
					{this.state.post.description} <br />
					Like : {this.state.post.likes.length}
				</p>
                <ul>{this.state.post.comments.map(function (comment) {
					return (<li>comment</li>)
				})}</ul>
            </div>);
        }

        return comp;
    }
}
