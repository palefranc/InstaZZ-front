import React, { Component } from "react";
import ImagesUploader from 'react-images-upload';
import axios from '../url/url_bdd';
import './Publication.css';
import logo_like from '../assets/logo_like.png';

const jwt = require('jsonwebtoken');


export default class Publication extends Component {
  constructor(props) {
    super(props);
      this.state = {
		  image: undefined,
          post: props.post,
          modifiable: props.modifiable,
		  new_commentaire: "",
		  desc_new_post: "",
		  message: ""
      };
  }

  test() {
    alert(this.state.message);
  }
  
  componentDidMount() {
	  //var token_id = localStorage.getItem("token_id");
	  //this.setState({idUser: token_id});
	  //this.setState({ post: { date: "", description: "", image: "", likes: [], comments:[] } })
  }
  
	parseImage(imgString)
	{
		var img = undefined;
		
		const attributes = imgString.split(';');
		console.log(attributes.length);
		console.log(attributes[0]);
		console.log(attributes[1]);
		console.log(attributes[2]);
		
		img = 
		{
			path: attributes[1],
			src: imgString
		}
		
		
		return img;
	}
  
	getImage(ev, img, context) {
		
		//context.parseImage(img[0])

		console.log("image chargée");
		//console.log(img);

		context.setState({
		  image: img[0]
		});
	}
	
	showImage()
	{
		var comp = undefined;
		
		if(this.state.image)
		{
			comp = <img className="apercuImage" src={this.state.image}/>
		}
		
		return comp;
	}
  
	async publicatePost(ev, context){
		
		ev.preventDefault();
		
		const formDatas = new FormData(ev.target);
	  
		const datePubli = new Date();
	  
		const token = localStorage.getItem("token");
	  
		if(token)
		{
			const optionReq = {
				method: 'PUT',
				headers: {
					Authorization: "Bearer "+token,
					"Content-Type": "multipart/form-data",
				},
				data: formDatas,
				url: "http://localhost:5000/posts/"
			}
			
			try
			{
				const res = await axios(optionReq);
				console.log(res);
				
				if(res)
				{
					const newPost = res.data;
					console.log(res.data);
					
					if(newPost)
					{
						window.location = "http://localhost:3000/profil/";
					}
				}
			}
			catch(err)
			{
				if(err.response)
				{
					if(err.response.data)
					{
						if(err.response.data.error)
						{
							if(err.response.data.error.message)
							{
								console.log(err.response.data.error.message);
								if(err.response.data.error.message == "Echec de l'Authentification"){
									localStorage.removeItem("token");
									window.location = "http://localhost:3000/auth";
								}
								else
								{
									console.error(err.response.data.error.message);
								}
								this.setState({ message: err.response.data.error.message });
							}
							else
							{
								this.setState({ message: err.response.data.error });
							}
						}
						else
						{
							this.setState({ message: err.response.data });
						}
					}
				}
			}
			
		}
		
	  
	}

	updatePost(message) {
		this.setState({ desc_new_post: message });
	}
  
	getLikes()
	{
		const context = this;
		
		var comp = undefined;
		const token = localStorage.getItem("token");
		
		if(token)
		{
			const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
			
			
			if(this.state.post.refUser == decoded.userId)
			{
				comp = <div className="like">
					<img className="like_logo" src={logo_like} />
					{this.state.post.likes.length}
				</div>;
			}
			else
			{
				if(this.state.post.likes.includes(decoded.userId))
				{
					comp = <div className="like on"
							onClick={(ev, context) => this.removeLike(ev, this)}>
						<img className="like_img"
							src={logo_like}
						/>
						: {this.state.post.likes.length}
					</div>;
				}
				else
				{
					comp = <div className="like off" 
							onClick={(ev, context) => this.addLike(ev, this)}>
						<img className="like_img"
							src={logo_like}
						/>
						: {this.state.post.likes.length}
					</div>;
				}
			}
			
		}
		
		return comp;
	}
	
	async addLike(ev, context)
	{
		const token = localStorage.getItem("token");
		
		var optionReq = {
			method: 'POST',
			headers: {
				Authorization: "Bearer "+token
			},
			data: {
				id: context.state.post._id
			},
			url: "http://localhost:5000/posts/addLike/"
		}
		
		try
		{
			const res = await axios(optionReq);
			
			if(res){
				console.log(res);
				console.log(res.data);
				
				const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
				
				if(decoded)
				{
					var newPost = context.state["post"];
					
					newPost.likes.push(decoded.userId);
					context.setState({ post: newPost });
				}
				else
				{
					console.error("Problème de décodage");
				}
			}
		}
		catch (err)
		{
			if(err.response)
			{
				if(err.response.data.message == "Echec de l'Authentification"){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/auth";
				}
				else
				{
					console.error(err.response.data.message);
				}
				context.setState({ message:err.response.data.message });
			}
		}
	}
	
	async removeLike(ev, context)
	{
		
		const token = localStorage.getItem("token");
		
		var optionReq = {
			method: 'POST',
			headers: {
				Authorization: "Bearer "+token
			},
			data: {
				id: context.state.post._id
			},
			url: "http://localhost:5000/posts/removeLike/"
		}
		
		try
		{
			const res = await axios(optionReq);
			
			if(res){
				
				const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
				
				if(decoded)
				{
					var newPost = context.state["post"];
					
					newPost.likes = res.data.likes;
					
					
					context.setState({ post: newPost });
					
					console.log(context.state.post.likes);
				}
				else
				{
					console.error("Problème de décodage");
				}
			}
			
		}
		catch (err)
		{
			if(err.response)
			{
				if(err.response.data.message == "Echec de l'Authentification"){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/auth";
				}
				else
				{
					console.error(err.response.data.message);
				}
				context.setState({ message:err.response.data.message });
			}
		}
	}
	
	async addCommentaire(ev, context)
	{
		const token = localStorage.getItem("token");
		
		console.log(context.state["new_commentaire"]);
		
		if(token)
		{
			const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
			
			var optionReq = {
				method: 'POST',
				headers: {
					Authorization: "Bearer "+token
				},
				data: {
					id: context.state.post._id,
					text: context.state["new_commentaire"]
				},
				url: "http://localhost:5000/posts/addComment/"
			}
			
			try
			{
				const res = await axios(optionReq);
				
				if(res){
					console.log(res);
					console.log(res.data);
					
					var newPost = this.state["post"];
					
					if(res.data && res.data != "")
					{
						newPost.comments.push(res.data);
					}
					else
					{
						newPost.comments.push({
							refUser: decoded.userId,
							date: new Date(),
							text: context.state["new_commentaire"]
						})
					}
					
					this.setState({ post: newPost });
					
					context.setState({ new_commentaire:"" });
				}
				
			}
			catch (err)
			{
				if(err.response)
				{
					if(err.response.data.message == "Echec de l'Authentification"){
						localStorage.removeItem("token");
						window.location = "http://localhost:3000/auth";
					}
					else
					{
						console.error(err.response.data.message);
					}
					context.setState({ message:err.response.data.message });
				}
			}
		}
		
		
	}
	
	changeCommentaire(ev, context)
	{
		if(ev && ev.target)
		{
			context.setState({
				new_commentaire: ev.target.value
			})
		}
	}
	
	async removeCommentaire(ev, context, idComm)
	{
		const token = localStorage.getItem("token");
		
		var optionReq = {
			method: 'POST',
			headers: {
				Authorization: "Bearer "+token
			},
			data: {
				id: context.state.post._id,
				idComment: idComm
			},
			url: "http://localhost:5000/posts/removeComment/"
		}
		
		try
		{
			const res = await axios(optionReq);
			
			if(res){
				
				context.setState({ post:res.data });
				
			}
			
		}
		catch (err)
		{
			if(err.response)
			{
				if(err.response.data.message == "Echec de l'Authentification"){
					localStorage.removeItem("token");
					window.location = "http://localhost:3000/auth";
				}
				else
				{
					console.error(err.response.data.message);
				}
				
				context.setState({ message:err.response.data.message });
			}
		}
	}
	
	getAddCommentaire()
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		
		if(token)
		{
			const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
			
			
			if(this.state.post.refUser != decoded.userId)
			{
				comp = (<div className="input_commentaire">
					<textarea
						id="input_text_commentaire"
						className="form-control mb-4"
						rows="3" cols="25"
						placeholder="Commentaire..."
						value={this.state.new_commentaire} 
						onChange={(ev, context) => this.changeCommentaire(ev, this)}
					/>
					<button className="btn btn-info my-4 btn-block button_commentaire"
						onClick={(ev, context) => this.addCommentaire(ev, this)}>
						Publier
					</button>
				</div>);
			}
			
		}
		
		return comp;
	}
	
	getCommentaireAffichage(commentaire)
	{
		var comp = undefined;
		
		const token = localStorage.getItem("token");
		
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
		
		if(decoded)
		{
			if(commentaire.refUser != decoded.userId)
			{
				comp = (<div className="commentaire" >{commentaire.text}</div>);
			}
			else
			{
				comp = (<div className="commentaire" >
					{commentaire.text}
					<button className="remove_commentaire" 
						onClick={(ev, context, idCom) => this.removeCommentaire(ev, this, commentaire._id)}>
						Supprimer
					</button>
				</div>);
			}
		}
		
		return comp;
	}

    render() {
        var comp;
		
		const context = this;

        if (this.state.modifiable || this.state.post == undefined) {
            comp = (<div className="ajout_publication">
				<div className="errorMessage">{this.state.message}</div>
				<form onSubmit={(ev, context) => {this.publicatePost(ev, this)}}>
					<ImagesUploader
						name="postImage"
						withIcon={true}
						multiple={false}
						optimisticPreviews
						buttonText='Chargez une image'
						onChange={(ev, img) => this.getImage(ev, img, this)}
						imgExtension={['.jpg', '.gif', '.png', '.gif']}
						maxFileSize={5242880}
					/>
					{this.showImage()}
					<br />
					<textarea
						type="text"
						name="description"
						rows="3" cols="25"
						placeholder="Ecrivez ici"
						className="input_description"
						value={this.state.desc_new_post}
						onChange={event => this.updatePost(event.target.value)}
					/>
					<div className="button_action">
						<button type="submit"
							className="btn btn-info my-4 btn-block button_publication">
							Publier
						</button>
						<button className="btn btn-info my-4 btn-block button_annuler" 
							onClick={() => window.location="http://localhost:3000/profil"} >
							Retour
						</button>
					</div>
				</form>
            </div>);
        }
        else {
			
			const d = new Date(this.state.post.date);
			
            comp = (<div className="publication">
                <img src={"http://localhost:5000" + this.state.post.image}
					alt={"http://localhost:5000" + this.state.post.image} 
					className="image_publication"/>
                <p>
					{d.toISOString().substring(0,10)} à {d.toISOString().substring(11,16)} <br />
					{this.state.post.description} <br />
				</p>
				{this.getLikes()}
				{this.getAddCommentaire()}
                {this.state.post.comments.map(function (comment) {
					return (context.getCommentaireAffichage(comment));
				})}
            </div>);
        }

        return comp;
    }
}
