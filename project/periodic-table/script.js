
 //search element button
var button = document.getElementById('ajax-button');
button.addEventListener("click", getElement);

var btn_show = false;//the fullList not shown yet 
//need to add a toggle switch to change text of show all button 
document.getElementById('showFull').onclick = function(){
	//get the text value of the button 
	console.log(document.getElementById('showFull').firstChild.nodeValue);//works
	//	change the text-value of the button
	if(!btn_show){
		document.getElementById('showFull').firstChild.nodeValue="close";
		showAll(); 
		btn_show = true;
	}
	else{
		document.getElementById('showFull').firstChild.nodeValue="see all elements";
		//hide the fullList div if it is previously shown 
		reset(document.getElementById('fullList'));
		btn_show = false;	
	}
	
	console.log(document.getElementById('showFull').textContent);//works 
	
}
var error = document.getElementById('error');
var display = document.getElementById('display');
//get an element based on the query
function getElement(){
	reset(document.getElementById("display")); //hide the full List
	reset(document.getElementById("fullList")); //hide the full List 
	document.getElementById('showFull').textContent = "see all elements";
	var api='https://periodic-table-api.herokuapp.com/atomicSymbol/';
	var elementSymbol = document.getElementById('elementSymbol');
	if(elementSymbol.value ==""){
		console.log("no symbol was entered");
		error.innerHTML="Please enter an element symbol!";
	}else{
		error.innerHTML = "";
		var url = api + elementSymbol.value ; 
		var displayMode = 1;
		getData(url, displayMode);
	}

}
function showAll(){
	var api = "https://periodic-table-api.herokuapp.com/"; 
	var displayMode = 2;
	getData(api, displayMode);
}
/*
 * getData: retrieve data from http request 
 */
function getData(url, displayMode){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyStatus < 4){
			showLoading();
		}
		if(xhr.readyState == 4 && xhr.status == 200){
			var json = JSON.parse(xhr.responseText);
			console.log(json);
			
			switch(displayMode){
				case 1 :
					if(json.status == false){
						console.log(' element not found');	
						error.innerHTML="There is no such element in the periodic table. Please check your element symbol!";
					} 
					else{
					//	error.innerHTML="";
						displaySingleElement(json);
					} 
					
					break;
				case 2 : 
					console.log("showAll");
					displayAll(json);
					break;
			}	
		}
	}
	xhr.send(); 
}

/* display an element data based on the element symbol the user enters in the 
 * search box
 */
function displaySingleElement(json){
	
	var table = document.createElement('table');
	var tr= document.createElement("tr"); 
	var td_left = document.createElement("td");
	var td_right = document.createElement("td");
	var div_left = document.createElement('div');
	var div_right = document.createElement('div');			
	var p1 = document.createElement('p');
	var p2 = document.createElement('p');
	var p3 = document.createElement('p');
	var p4 = document.createElement('p');
	var p5 = document.createElement('p');
	var p6 = document.createElement('p');
	var p7 = document.createElement('p');
	var p8 = document.createElement('p');
	var p9 = document.createElement('p');
	//retrieve group Block for each element
	var block = json.groupBlock;
	switch(block){
		case "noble gas":
			block = "noblegas";
			break;
		case 'transition metal':
			block = 'transitionMetal';
			break;
		case 'alkali metal':
			block ='alkaliMetal' ; 
			break;
		case 'alkaline earth metal':
			block = 'alkaline';
			break;
	}
	//highlight the block div based on element group block
	blockHighlight(block,div_left);
	div_left.setAttribute("class", block);
	div_left.setAttribute("id", "card");
	div_right.setAttribute("id", "right");
	p1.innerHTML = json.atomicNumber;
	p1.setAttribute("id","atomicNumber");
	p2.setAttribute("id", "symbolBlock");
	p2.innerHTML = json.symbol;
	p3.innerHTML = json.name;
	p3.setAttribute("id", "name");
	p4.innerHTML = "<b>atomic mass: </b>" + json.atomicMass;
	p5.innerHTML = "<b> group block: </b>" + block; 
	p6.innerHTML = "<b>standard state: </b>"+ json.standardState;
	p7.innerHTML = "<b>electronegativity: </b>"+ json.electronegativity;
	p8.innerHTML = "<b>atomic radius: </b>" + json.atomicRadius; 
	p9.innerHTML = "<b>year discovered: </b>"+ json.yearDiscovered;
	
	p4.setAttribute("class","p-tag");
	p5.setAttribute("class","p-tag");
	p6.setAttribute("class","p-tag");
	p7.setAttribute("class","p-tag");
	p8.setAttribute("class","p-tag");
	p9.setAttribute("class","p-tag");
	
	div_left.appendChild(p1);
	div_left.appendChild(p2);
	div_left.appendChild(p3);
	
	div_right.appendChild(p4);
	div_right.appendChild(p5);
	div_right.appendChild(p6);
	div_right.appendChild(p7);
	div_right.appendChild(p8);
	div_right.appendChild(p9);

	td_left.appendChild(div_left);
	td_right.appendChild(div_right);
	tr.appendChild(td_left);
	tr.appendChild(td_right);
	table.appendChild(tr);
	display.appendChild(table);
	//document.body.appendChild(display);
	console.log(table);
}

function displayAll(json){
	error.innerHTML="";//clear any error on the page
	var btn = document.getElementById("showFull");
	btn.value = "close";

	var count = Object.keys(json).length;
	var p_list = document.createElement("p");
	p_list.innerHTML = "LIST OF ELEMENTS IN ASCENDING ORDER OF ATOMIC NUMBER";
	fullList.appendChild(p_list);
	//create a table 
	var table = document.createElement('table');
	var tr_head = document.createElement("tr"); 
	var td_head1 = document.createElement("th");
	var td_head2 = document.createElement("th");
	var td_head3 = document.createElement("th");
	tr_head.setAttribute("class","tb_row");
	td_head1.innerHTML = "Elements";
	td_head2.innerHTML = "Name"; 
	td_head3.innerHTML = "Chemical Group Block"; 
	tr_head.appendChild(td_head1);
	tr_head.appendChild(td_head2);
	tr_head.appendChild(td_head3);
	table.appendChild(tr_head);
	//iterate through json array to display each element
	for(i=0; i< count ; i++){
		var tr = document.createElement('tr');//create row 
		tr.setAttribute("class","tb_row");
		var td_1 = document.createElement('td'); //create column
		var td_2 = document.createElement('td'); //create column
		var td_3 = document.createElement('td'); //create column
		
		var div_left = document.createElement('div');
		div_left.setAttribute("id", "left-div");
		var block = json[i].groupBlock;//retrieve group Block for each element
		//highlight the element according to its group block
		blockHighlight(block,div_left);
		var div_right = document.createElement('div');
		div_right.setAttribute("id", "right-div");
		
		var p1 = document.createElement('p');
		p1.innerHTML = json[i].atomicNumber;
		var p2 = document.createElement('p');
		p2.setAttribute("id", "symbol");
		p2.innerHTML = json[i].symbol;
		var p3 = document.createElement('p');
		p3.innerHTML = json[i].name;
		var p4 = document.createElement('p');
		p4.innerHTML = json[i].groupBlock;
		div_left.appendChild(p1);
		div_left.appendChild(p2);
		div_right.appendChild(p3);

		td_1.appendChild(div_left);
		td_2.appendChild(div_right);
		td_3.appendChild(p4);
		tr.appendChild(td_1);
		tr.appendChild(td_2);
		tr.appendChild(td_3);
		table.appendChild(tr);
	}
	fullList.appendChild(table);
	
}

/* function to highlight each chemical element based on its group block
 * block: group block of the element
 * div_left: the div id 
 */

function blockHighlight(block, div_left){
	switch (block){
		case "nonmetal": 
			div_left.setAttribute("class", "nonmetal");
			break;
		case "noble gas":
			div_left.setAttribute("class", "noblegas");
			break;
		case "metalloid" :
			div_left.setAttribute("class", "metalloid");
			break;
		case "alkaline earth metal":
			div_left.setAttribute("class","alkaline");
			break;
		case "alkali metal":
			div_left.setAttribute("class", "alkaliMetal");
			break; 
		case "transition metal":
			div_left.setAttribute("class", "transitionMetal");
			break;
		case "metal":
			div_left.setAttribute("class", "metal");
			break;
		case "halogen":
			div_left.setAttribute("class", "halogen");
			break;
		case "lanthanoid" :
			div_left.setAttribute("class", "lanthanoid");
			break;
		case "actinoid": 
			div_left.setAttribute("class", "actinoid");
			break;
		default: 
			div_left.setAttribute("class", "metal");
			break;
	}			
}

function showLoading(){
	var target = document.getElementById('location');
	target.innerHTML = 'Loading...'; 
}
 //dispay: is an id of a div
function reset(display){
	let element = display;
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
 }

