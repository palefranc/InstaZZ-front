
import fileData from "./.token";

export default class localStorage {
	
	storageFile = "./.token"
	/*
	setItem(name, obj){
		var jsonData = JSON.parse(fileData);
		
		jsonData[name] = obj;
		
		var fs = require("fs");
		
		if(file != undefined){
			fs.writeFile(file, jsonData);
			fclose(file);
		}
		
	}*/
	
	getItem(name) {
		var jsonData = JSON.parse(fileData);
		
		var token = jsonData.selectToken(name);
		
		return token;
		
	}
	
}