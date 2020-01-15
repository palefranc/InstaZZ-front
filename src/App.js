import React from 'react';
import logo from './logo.svg';
import './App.css';
import Publication from "./composants/Publication";
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
const Users = () =>  <h2>Users</h2>;

function App() {
  return (
    <Router>
     <div>
     <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
       <Switch>
         <Route path="/" exact component={Index}/>
         <Route path="/about/" component={About}/>
         <Route path="/users/" component={Users}/>
       </Switch>

     </div>
   </Router>
 );
}



export default App;
