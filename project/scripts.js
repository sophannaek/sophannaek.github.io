var api='https://periodic-table-api.herokuapp.com/atomicSymbol/';

function findElementName(){
	var elementSymbol = document.getElementById('elementSymbol');
	var symbol = document.getElementById('symbol');
		//create a request 
	var url = api + elementSymbol.value;
	var xhr = new XMLHttpRequest(); 
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyStatus< 4) {
			showLoading();
		}
		if(xhr.readyState == 4 && xhr.status == 200){
			console.log(xhr.status);
		//	console.log(xhr.responseText);
			var json = JSON.parse(xhr.responseText);
			//console.log(json)
			if(json.status == false){
				console.log(' element not found')
				var error = document.getElementById('error')
				error.innerHTML="There is no such element in the periodic table. Please check your spelling";
			} 
			else outputName(xhr.responseText);
		};
		
	}
	xhr.send(); 
	
}
function showLoading(){
	var target = document.getElementById('location');
	target.innerHTML = 'Loading...'; 
}

function outputName(data){
	
	var title = document.getElementById('title');
	var symbol = document.getElementById('symbol');
	var name = document.getElementById('name');
	var atomicNumber = document.getElementById('atomicNumber');
	var atomicMass = document.getElementById('atomicMass');
	var atomicRadius = document.getElementById('atomicRadius');
	var groupBlock = document.getElementById('groupBlock');
	var oxidationState = document.getElementById('oxidationState');
	var electroNegativity = document.getElementById('electroNegativity');
	var boilingPoint = document.getElementById('boilingPoint');
	var bondingType = document.getElementById('bondingType');
	var electronAffinity = document.getElementById('electronAffinity');
	
	if(data== null) symbol.innerHTML = 'Please enter the element before clicking submit'; 
	//convert the requested data in json format
	var json = JSON.parse(data);
	title.innerHTML = json.symbol;
	symbol.innerHTML ='symbol: '+ json.symbol;
	name.innerHTML = 'name: '+ json.name;
	atomicNumber.innerHTML = 'atomic number: '+ json.atomicNumber; 
	atomicMass.innerHTML = 'atomic mass: '+ json.atomicMass; 
	atomicRadius.innerHTML = 'atomic radius: '+ json.atomicRadius; 
	groupBlock.innerHTML = 'group block: ' + json.groupBlock; 
	oxidationState.innerHTML = 'oxidation state: '+ json.oxidationStates;
	electroNegativity.innerHTML = 'electronegativity: '+ json.electronegativity; 
	boilingPoint.innerHTML = 'boiling point: '+ json.boilingPoint;
	bondingType.innerHTML = '<b>bonding type: </b> '+ json.bondingType; 
	electronAffinity.innerHTML = '<b>electron affinity: </b>' + json.electronAffinity;
}
//this function capitalizes the first character of chemical element. I don't need this one in this script 
function capitalizeElement(string){
	return string[0].toUpperCase() + string.slice(1);
}
var button = document.getElementById('ajax-button');
button.addEventListener("click", findElementName);