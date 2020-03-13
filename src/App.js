import React from 'react';
import logo from './assets/logo_transparent.png';
import './App.css';
import dotenv from "dotenv";
import Publication from "./composants/Publication";
import ListPublications from "./composants/ListPublications";
import User from "./composants/User";
import Users from "./composants/Users";
import Demandes from "./composants/Demandes";
import AuthRouter from "./composants/AuthRouter";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';


const Index = () =>  <Publication/>;
const About = () =>  <h2>About</h2>;
var users_list = () =>  <Users list_type="research"/>;
var users_list_abonnees = () =>  <Users list_type="abonnes"/>;
var users_list_abonnements = () =>  <Users list_type="abonnements"/>;
var users_list_demandes = () =>  <Demandes />;
const user_profil = () =>  <User />;
const posts_list = () =>  <ListPublications on_mur={true}/>;
const new_post = () => <Publication modifiable={true} />;
const auth = () => <AuthRouter authentified={false} signup={false} />;
const auth_signup = () => <AuthRouter authentified={false} signup={true} />;


//var textRech = "";

function setText(ev) {
	localStorage.setItem("token_search", ev.target.value)
}

function search(ev) {
	window.location = "http://localhost:3000/users/";
}

function deconnexion(ev){
	localStorage.removeItem("token");
	window.location = "http://localhost:3000/";
}

function App() {
	dotenv.config();
  return (
    <Router>
     <div>
     <Navbar bg="dark" variant="dark">
		<a href="http://localhost:3000/">
			<img src={logo}
				alt="InstaZZ" id="logo"/>
		</a>
        <Nav className="mr-auto">
          <Nav.Link href="http://localhost:3000/profil/">Profil</Nav.Link>
          <Nav.Link href="http://localhost:3000/posts/">Mur</Nav.Link>
          <Nav.Link href="http://localhost:3000/users/demandes/">Demandes</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Cherchez un utilisateur" className="mr-sm-2" onChange={setText}/>
          <Button variant="outline-info" onClick={search}>Rechercher</Button>
        </Form>
		<Button variant="outline-info" id="deconnexion" onClick={deconnexion}>Deconnexion</Button>
		
      </Navbar>
       <Switch>
		 <Route path="/" exact component={auth}/>
         <Route path="/auth" exact component={auth}/>
		 <Route path="/auth/signup" exact component={auth_signup}/>
         <Route path="/about/" component={About}/>
         <Route path="/profil/:idUser" component={User}/>
         <Route path="/profil/" component={user_profil}/>
         <Route path="/users/demandes" component={users_list_demandes}/>
         <Route path="/users/abonnements" component={users_list_abonnements}/>
         <Route path="/users/abonnes" component={users_list_abonnees}/>
         <Route path="/users/" component={users_list}/>
         <Route path="/posts/" component={posts_list}/>
		 <Route path="/addpost/" component={new_post}/>
       </Switch>

     </div>
   </Router>
 );
}



export default App;
