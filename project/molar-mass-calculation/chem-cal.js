/**
 ** Author: Sophanna Ek
 ** About: Chemistry Molar Mass Calculator
 ** Features: 
 	* molar mass calculation
 	* mass percent calculation
 ** Test Cases: 
 *** NaCl
 *** Ba(OH)2
 *** Al(ClO)3
 *** Al(OH)(CH3)2
 **/

let description = document.getElementById('description')
let elements = []
let table = []
let numOfParen = 0//take care the number of groups in the given formula 
let submit = document.getElementById('submit')

const api = "https://periodic-table-api.herokuapp.com/"

//submit.addEventListener('click','cal')

function cal(){
	elements = []//empty the obj array for new calculation 
	resetDesc()
	var inp = document.getElementById('input')
	console.log(inp.value)
	var el = inp.value
	var startIndex = 0
	var endIndex = 1	
	//if 2AlCl3 or weird special characters-- 
	if(!el.charAt(0).match("^[a-zA-Z]*$")){
		alert('Please Leave out coefficient and/or unncessary parenthesis!')
	}else{
		//make an api request
		getData(api, function(data){
			//save all elements in the array for further formula tokenization
			var count = Object.keys(data).length;
			for(var i = 0; i< count; i++){
				var name = data[i].name
				var symbol = data[i].symbol
				var atomicMass = data[i].atomicMass
				var ell = new chemicalElement(symbol, name, atomicMass)
				table.push(ell)
			}
			var ell = new chemicalElement(el,' ', 0)
			//tokenize input into elements 
			tokenize(ell, startIndex, endIndex, table)//should pass the table 
			calculateMass(elements)
		});
	}
}
//recursive split --tokenize it works -- el should be an object 
function tokenize(el,startIndex, endIndex, allElements){

	if(endIndex === el.symbol.length + 1){
		return
	}
	var data = el.symbol.substring(startIndex, endIndex)
	console.log("symbol: " + data)
	var Found = isElement(data, allElements)
	var isFound = Found[0]
	var foundEl = Found[1]
	//need to check if it is a group -- update the multiplier should pass the obj
	if(isFound){
		var newEl = new chemicalElement(foundEl.symbol, foundEl.name, foundEl.atomicMass)
		if(el.group){
			//if it is a group -- keep its group multiplier 
			newEl.multiplier = el.multiplier
		}
		elements.push(newEl)
		tokenize(el, endIndex, endIndex + 1, allElements)
	}else{//Unknown element in the table
		//Not a character --> A number or ()
		if(!data.match("^[a-zA-Z]*$")){
			if(data ==='('){ 
				console.log('it is a ()')
				numOfParen++ 
				//search for right parenthesis 
				//this will be example:  OH)2
				var temp = el.symbol.substring(startIndex + 1, el.length)
				var rightParen = el.symbol.indexOf(")",startIndex)			
				var group = el.symbol.substring(startIndex + 1, rightParen)
				//just a create a new object and add it to the obj array
		
				var groupObj = new chemicalElement(group, 'group', 0)
				groupObj.group = true 
				elements.push(groupObj)
		//		console.log('left over from group ...'+ el.symbol.substring(rightParen + 1,el.length))
				tokenize(el, rightParen + 1, rightParen + 2, allElements)
			}else{//symbol is a number -- a subscript for previous element/group
				//pop out the last one that just added and add the number of multiplier 
				var temp = elements.pop()
				console.log(temp)
				temp.multiplier = parseInt(data) * el.multiplier
				elements.push(temp)
				if(startIndex !== el.symbol.length){
					tokenize(el,startIndex+1, startIndex+2, allElements)
				}
			}
		}else{
			if(elements.length != 0 ){
				elements.pop()
				tokenize(el,startIndex-1, endIndex, allElements)
			}else {
				//Very first character of the input text of the formula
				tokenize(el,startIndex, endIndex + 1, allElements)
			}
		}
	}
}
//it works 
function isElement(ch, allElements){
	var exist = false
	var newEl= ''
	//use the api request for specific element-- not the whole elements
	for(var i = 0; i < allElements.length; i++){
		var el = allElements[i]
			if(ch === el.symbol){
			//	console.log('element is ' + el)
				exist = true
				newEl = el
				break
			}
		} 
	return [exist, newEl]
}
//calculate molar mass of the whole group
function calculateMass(obj){
	var sum = 0
	console.log('calculating atomic mass.....')
	for (var i = 0; i < obj.length ;i++){
		if(obj[i].group){
			tokenize(obj[i], 0,1 , table) //tokenize the group
		}else{
			sum += parseFloat(obj[i].atomicMass) * obj[i].multiplier
		}
	}
	console.log('the total sum...'+sum.toFixed(3))
	console.log(obj)
	if(sum == 0){
		alert('Please check your formula. Make sure it is written in the standard form!')
	}else{
		display(obj, sum)
	}
	
}
//take an array of obj in the list
function display(obj, sum){
	//var desc = document.getElementById('description')
	var tb = document.createElement('table')
	var tr = document.createElement('tr')
	var th1 = document.createElement('th')
	var th2 = document.createElement('th')
	var th3 = document.createElement('th')
	var th4 = document.createElement('th')
	var th5 = document.createElement('th')
	th1.innerHTML = 'Element'
	th2.innerHTML = 'Name'
	th3.innerHTML = 'Atomic Mass'
	th4.innerHTML = 'Multiplier'
	th5.innerHTML = 'Total Mass'
	tr.appendChild(th1)
	tr.appendChild(th2)
	tr.appendChild(th3)
	tr.appendChild(th4)
	tr.appendChild(th5)
	tb.appendChild(tr)

	for(var i =0; i<obj.length; i++){
		if(!obj[i].group){
			var tr1 = document.createElement('tr')
			var td1 = document.createElement('td')
			var td2 = document.createElement('td')
			var td3 = document.createElement('td')
			var td4 = document.createElement('td')
			var td5 = document.createElement('td')
			//var td = document.createElement('td')
			td1.innerHTML = obj[i].symbol
			td2.innerHTML = obj[i].name
			td3.innerHTML = parseFloat(obj[i].atomicMass).toFixed(3)
			td4.innerHTML = obj[i].multiplier
			td5.innerHTML = (parseFloat(obj[i].atomicMass)* parseFloat(obj[i].multiplier)).toFixed(3)
			tr1.appendChild(td1)
			tr1.appendChild(td2)
			tr1.appendChild(td3)
			tr1.appendChild(td4)
			tr1.appendChild(td5)
			tb.appendChild(tr1)
		}
	}
	//create the last row
	var tr2 = document.createElement('tr')
	var td6 = document.createElement('td')
	//td6.setAttribute('id','last_row')
	td6.colSpan = 4
	var td7 = document.createElement('td')
	td6.innerHTML = 'Total Atomic Mass'
	td7.innerHTML = sum.toFixed(3)
	tr2.appendChild(td6)
	tr2.appendChild(td7)
	tb.appendChild(tr2)
	description.appendChild(tb)

}
function chemicalElement(symbol, name , atomicMass ){
	this.symbol = symbol
	this.name = name 
	this.atomicMass = atomicMass
	this.group = false
	this.multiplier= 1
}
function getData(url,callback){
	var xhr = new XMLHttpRequest();
	var json
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyStatus < 4){
			showLoading();
		}
		if(xhr.readyState == 4 && xhr.status == 200){
			json = JSON.parse(xhr.responseText);
			callback(json)
		}
	}
	xhr.send(); 
}

function resetDesc(){
	while(description.hasChildNodes()){
		description.removeChild(description.firstChild)
	}
}






	
