import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Publication from "./composants/Publication";
import ListPublications from "./composants/ListPublications";
import User from "./composants/User";
import Users from "./composants/Users";
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

const listId = new Array("5e25ecbe9bbc3f0b989b9bd4");

const Index = () =>  <Publication/>;
const About = () =>  <h2>About</h2>;
var users_list = () =>  <Users />;
const user_profil = () =>  <User />;
const posts_list = () =>  <ListPublications on_mur={true}/>;
const new_post = () => <Publication modifiable={true} />;
const auth = () => <AuthRouter authentified={false} />;


//var textRech = "";

function setText(ev) {
	localStorage.setItem("token_search", ev.target.value)
}

function search(ev) {
	window.location = "http://localhost:3000/users/";
}

function deconnexion(ev){
	localStorage.removeItem("token_id");
	localStorage.removeItem("token_mail");
	localStorage.removeItem("token_pwd");
	window.location = "http://localhost:3000/";
}

function App() {
  return (
    <Router>
     <div>
     <Navbar bg="dark" variant="dark">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png"
            alt="InstaZZ" id="logo"/>
        <Nav className="mr-auto">
          <Nav.Link href="http://localhost:3000/auth/">Profil</Nav.Link>
          <Nav.Link href="http://localhost:3000/posts/">Mur</Nav.Link>
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
         <Route path="/about/" component={About}/>
         <Route path="/profil/" component={user_profil}/>
         <Route path="/users/" component={users_list}/>
         <Route path="/posts/" component={posts_list}/>
		 <Route path="/addpost/" component={new_post}/>
       </Switch>

     </div>
   </Router>
 );
}



export default App;
