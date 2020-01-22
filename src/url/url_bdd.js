// JavaScript source code

import axios from 'axios';

export default axios.create({
    //baseURL: 'mongodb://asmaadb:asmaadb@myappdb-shard-00-00-ygnlh.mongodb.net:27017,myappdb-shard-00-01-ygnlh.mongodb.net:27017,myappdb-shard-00-02-ygnlh.mongodb'
    baseURL: 'https://localhost:5000',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

    }
})