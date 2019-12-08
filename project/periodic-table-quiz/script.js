/*
	File: scirpt.js - JavaScript for periodic table quiz
	Author: Sophanna Ek

*/


//get references to select list and display textbox
var sel = document.getElementById('game-option');
var game_option = document.getElementById('game-option');
var game_display = document.getElementById('game-display');
var game_heading_text = document.getElementById('game-heading');
var fb = document.getElementById('fb');
var give_up_btn = document.getElementById('give_up');
var element_info = document.getElementById('element-info');
var total_elements = 118; 
var nextGame = false ; 
var max_score = 0; 
var score_display =document.getElementById('score');
var score = 0; 
var correctColor = '#89EFB2';
var count = 0; 

document.getElementById('score').innerHTML = score;
document.getElementById('play').onclick = function(){
	reset();
	game_option = sel.value;
	showGame(game_option)
}

function showGame(game_option){
	game_heading_text.innerHTML = "You are Playing " + game_option
	switch(game_option){
		case 'atomic_number':
			quiz_numbers(); 
			break; 
		case 'elementSymbol' : 
			find_element_symbol();
			break;
	}
}

function randomize(number){
	var random_number = Math.floor(Math.random() * number ) + 1 ; 
	return random_number;
}
document.getElementById('quit').onclick = function(){
	prev = false; 
	prevId='';
	quit(); 
	
};

document.getElementById('try_again').onclick = function(){
	
	element_info.innerHTML = '';
	document.getElementById('input_ans').disabled = false;
	//need to change the try_again to give up 
	document.getElementById('try_again').style.display = 'none'; 
	document.getElementById('give_up').style_display= 'block';
	quiz_numbers();
}

function quit(){
	fb.innerHTML=''; 
	document.getElementById('input_ans').disabled = true;
	document.getElementById("ans_btn").disabled = true;
	document.getElementById('quit-message').style.display = 'block';
	if(score > 0){
		document.getElementById('quit-message').innerHTML = "<span style='color:green'>Your max score is "+ score + ". Keep working!</span>";
	}else{
		document.getElementById('quit-message').innerHTML = "<span style='color:red'>You did not do well! Please review how to read the periodic table and come back!</span>";
	}
	updateScore(max_score);
	//disabled the periodic table for the 2nd quiz 
	var buttons = document.getElementsByClassName('btn');
	for (var i = 0; i < buttons.length; i++){
		document.getElementById(buttons[i].id).disabled = true;
	}
}

/**/
function resetAnswer(){
	fb.innerHTML=''; 
	count = 0; 
	game_display.style.display = 'block';
	document.getElementById('input_ans').value = ''; 
	document.getElementById('ans_btn').disabled = false;
	//for quiz 2 -- enable the periodic table again if quit was clicked previously 
	var buttons = document.getElementsByClassName('btn');
	for (var i = 0; i < buttons.length; i++){
		document.getElementById(buttons[i].id).disabled = false;
	}
}
function reset(){
	score = 0; 
	updateScore(score);
	fb.innerHTML = '';
	document.getElementById('input_ans').disabled = false;
	document.getElementById("ans_btn").disabled = false;
	hideDiv('quit-message');
}

function updateScore(score){
		if(score <= 0 )
			document.getElementById('score').innerHTML = "<span style='color: red'><b> "+ score+'<b></span>';
		else{
			document.getElementById('score').innerHTML = "<span style='color: green'><b>"+ score+'<b></span>';
		}
		if(max_score < score ){ max_score = score;  } 	
}
//getData from the api
function getData(atomic_number, callback){

	var elementObj;
	var url = 'https://periodic-table-api.herokuapp.com/';
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyStatus < 4){
			showLoading();
		}
		if(xhr.readyState == 4 && xhr.status == 200){
			try{
				var json = JSON.parse(xhr.responseText);
				var count = Object.keys(json).length;
				for(var i = 0; i < count; i++ ){
					if(json[i].atomicNumber == atomic_number){
						elementObj = json[i];
						
					}
				}
			} catch(err){
				console.log(err.message + " in " + xmlhttp.responseText);
				return;
			}
			callback(elementObj);//return the json object
		}
	};
	xhr.open('GET', url, true);
	xhr.send(); 
}

function getSelectedOption(sel) {
	var opt;
	for ( var i = 0, len = sel.options.length; i < len; i++ ) {
		opt = sel.options[i];
		if ( opt.selected === true ) {
			break;
		}
	}
	return opt;
}
function showLoading(){
	var message = document.createElement('p')
	message.innerHTML = "it is loading.....";
	document.body.appendChild(message);
}
function findPeriod(eleConfig){
	var config = eleConfig.split(' ');
	var lastConfig = config[config.length -1]; //last config group
	var period = (lastConfig.split(/(\d+)/))[1];
	console.log("elec config "+ config +" length " + config.length)
	console.log(config[config.length -1 ]); //
	return period;
}
function hideDiv(divID){
	document.getElementById(divID).style.display = 'none';
}
function showDiv(divID){
	document.getElementById(divID).style.display = 'inline-block'; 
}

/* change the color of the element that has been clicked */
function btnColor(btn, color){
	var property = document.getElementById(btn);
	if(property.className !== 'toggled'){
		property.classList.add('toggled')
		property.style.backgroundColor = color; 
		
	}
	
}
/* To unhighlight all the buttons those have been clicked  */
function resetButtonHighlight(){
	var buttons  = document.getElementsByClassName('toggled');
	for (var i = 0; i < buttons.length; i++){
		var button = buttons[i];//each element button in the table 
		button.classList.remove('toggled');
		btnColor(button.id,"")//default color -- should have used css for class color 
	}
}

//don't need it
function display (name, symbol,groupBlock, atomicNumber){
	var p3 = document.createElement('p');
	p3.innerHTML = "name: " + name; 
	game_heading_text.appendChild(p3); 
}

/*************************************** quiz 1 and quiz 2 options *******************************************/
//first quiz option 
function quiz_numbers(){
	var element_number = randomize(total_elements);//pick an element
	var question_number = randomize(5); //pick question
	var p1 = document.createElement('p');
	var atomicNumber; var name; var groupBlock; var symbol; var ionRadius; var charge; 
	//check if the charge between +2 and -2 --> can ask for charge questions
	var q_phrase; var q_charge; var neutral; 	
	resetAnswer(); 
	showDiv('game-display');
	showDiv('input_ans');
	showDiv('ans_btn');
	hideDiv('p-table');//hide the p-table

	getData(element_number, function(data){
		atomicNumber = data.atomicNumber; 
		name = data.name; 
		groupBlock = data.name; 
		symbol = data.symbol; 
		ionRadius = data.ionRadius; 
		var leftParen = ionRadius.indexOf('(');
		var rightParen = ionRadius.indexOf(')');		
		charge = ionRadius.substring(leftParen + 1, rightParen );
		switch(question_number){
			case 1: 
				p1.innerHTML = "What is the atomic number of " + data.name +" ( "+ data.symbol + " ) ?";
				q_phrase = 'What is the atomic number';
				break;
			case 2: 
				p1.innerHTML = "How many electrons does this neutral " + data.name +" ( "+ data.symbol + " ) "+ " has?";
				q_phrase = 'How many electrons does this neutral '; 
				break;
			case 3: 
				p1.innerHTML = "How many protons does this neutral " + data.name +" ( "+ data.symbol + " ) "+ " has?";
				q_phrase = 'How many protons does this neutral ';
				break;
			case 4: 
				if(charge > 0 ){
					p1.innerHTML = "How many protons does this " + data.name +" with a (+1) charge ( "+ data.symbol + " ) "+ " has?";	
				}else if(charge < 0 ){
					p1.innerHTML = "How many protons does this " + data.name +" with a (-1) charge ( "+ data.symbol + " ) "+ " has?";		
				}else if (charge == ''){
					quiz_numbers();		
				}
				neutral = false; 
				q_phrase = 'How many protons does this ';
				break;
			case 5: 
				if(charge > 0 ){
					p1.innerHTML = "How many electrons does this " + data.name +" with a (+1) charge ( "+ data.symbol + " ) "+ " has?";
				}else if(charge < 0 ){
					p1.innerHTML = "How many electrons does this " + data.name +" with a (-1) charge ( "+ data.symbol + " ) "+ " has?";				
				} else if (charge == ''){
					quiz_numbers();
				}
				q_phrase = 'How many electrons does this '; 
				break;
		}//endofswitch
		
	});//endof getData
	//answer processing: 
	document.getElementById('ans_btn').onclick = function(){
		input_ans = document.getElementById('input_ans').value; 
		var answer; 
		if(question_number == 1 || question_number == 2 || question_number == 3 || question_number == 4){
			answer = atomicNumber; 
		}else{//question #5
			if(charge > 0){
					answer = atomicNumber - 1;
			}
			else {
					answer = atomicNumber + 1; 
			}
		}
		//process the answer 
		if(input_ans == answer){
			fb.innerHTML= "Great Job! "; 
			updateScore(++score);
			//display the answer if it is correct
			p1.innerHTML = "<span style='color:green'>"+ q_phrase + name +" ( "+ symbol + " ) "+ " has ? <b>" + input_ans +
	 "</b> correct! </span> "	;
			//load the next question! 
			quiz_numbers(); 
		} else if(input_ans ==''){
			if(count == 0 ){
				count++; 
				alert("Make sure you enter the answer!");//IF 
			}else {
				fb.innerHTML = "Make sure you enter answer before you click submit! "; 
				updateScore(--score);
			}
			} else if(Math.abs(input_ans - answer ) <= 3) {
					fb.innerHTML="You are close!";
					updateScore(--score);
					give_up_btn.style.display = 'block'; 
			}else {
				updateScore(score--);
				fb.innerHTML='You answer is not correct. Please try again!' ;
				give_up_btn.style.display = 'block'; 
			}

	}//endof answer processing
	game_heading_text.appendChild(p1);
	
	document.getElementById('give_up').onclick = function(){
		fb.innerHTML=''; 
		hideDiv('give_up');
		showDiv('try_again');
		document.getElementById('input_ans').disabled = true; 
		var p2 = document.createElement('p');
		//display the answer
		p2.innerHTML ="<h4>"+ name + " ( " + symbol +" ) is in "+ groupBlock+" group. It has <i><b>"+ atomicNumber +" </b></i>number of protons! </h4>" ; 
	//	display(name,symbol,groupBlock,atomicNumber);
		game_heading_text.appendChild(p2);
	}//endof give_up()
}//endofquiz1


//2nd quiz option 
function find_element_symbol(){	
	var atomicNumber; var groupBlock; var name; var ionRadius; var symbol; 
	var eleConfig; var period; var q_phrase; 
	var prevId=''; var prev= false;
	var element_number = randomize(total_elements);//pick an element
	var question_number = randomize(3); //pick question
	var p3 = document.createElement('p');
	showDiv('p-table');
	showDiv('game-display');
	hideDiv('ans_btn');
	hideDiv('input_ans');
	
	resetAnswer();
	resetButtonHighlight();//clear highlight on previously selected elements
	getData(element_number, function(data){
		//check if it is negative charge or positive charge 
		switch(question_number){
			case 1: 
				q_phrase = "What is the element symbol of " + data.name +" ?";
				break;
			case 2: 
				q_phrase = "What is the element that has an atomic number of " + data.atomicNumber +" ?";
				break;
			case 3: 
				q_phrase = "Select an element that belongs to " + data.groupBlock +" groupBlock ?";
				break;	
			case 4: 
				q_phrase = "Select an element that belongs to period " + period +" ?";
				break;	
				
		}
		atomicNumber = data.atomicNumber; 
		name = data.name; 
		groupBlock = data.groupBlock; 
		symbol = data.symbol; 
		ionRadius = data.ionRadius; 
		eleConfig = data.electronicConfiguration;
		var leftParen = ionRadius.indexOf('(');
		var rightParen = ionRadius.indexOf(')');		
		charge = ionRadius.substring(leftParen + 1, rightParen );
	
		period = findPeriod(eleConfig);
		p3.innerHTML = q_phrase;
	});//endof getData()
		game_heading_text.appendChild(p3);
	//answer processing 
		var ans; var studentGroupBlock; var studentPeriod; var studentAtomicNumber;
	
				
		$("button").unbind('click').click(function() {
			ans = $(this).val(); //atomic number of the click element
			var but = document.getElementsByClassName('btn')
			var element = document.getElementById(this.id)
			//change the background color of the each element that gets clicked
			if( element.classList.contains('btn')){
				//btnColor(this.id, 'lightblue');
				btnColor(this.id, 'yellow');
				if(prev === true) // $(prevId).css('background-color', 'lightblue');
				{	
					btnColor(prevId, '#FE642E')
					//btnColor(prevId, 'gray')
				}
				prevId = this.id;
				prev=true;
			}

	//*** only enable this if the click on the elements, not on other buttons like play -- quit button ! 
		if (element.classList.contains('btn')){
			getData(ans, function(studentData){
				studentGroupBlock= studentData.groupBlock; 
				studentPeriod = findPeriod(studentData.electronicConfiguration);
				studentAtomicNumber = ans; 
				
				
				if(question_number === 1 ){
					if(studentAtomicNumber === atomicNumber){
						
						btnColor(prevId, correctColor);
						fb.innerHTML='';
						p3.innerHTML = "<span style='color:green'>What is the element symbol of " + name +" ? correct! </span>";
						updateScore(++score);
						setTimeout(function(){
							find_element_symbol(); 
						}, 3000);
					}else{
						
						updateScore(--score);
						fb.innerHTML = "Your selected answer is not correct ! " 
						
					}
				}else if(question_number === 2){
					if(studentAtomicNumber === atomicNumber){		
						updateScore(++score);
						fb.innerHTML='';
						p3.innerHTML = "<span style='color:green'>What is the element that has an atomic number of " + atomicNumber +" ? Correct </span>";
						btnColor(prevId, correctColor)
						setTimeout(function(){
								find_element_symbol(); 
							}, 3000);	
					} else{
						updateScore(--score);
						fb.innerHTML = "Your selected answer is not correct ! " 
					}
				}
				
				else if(question_number === 3){
						if(studentGroupBlock === groupBlock){
							
							fb.innerHTML='';
							updateScore(++score);
							p3.innerHTML = "<span style='color:green'>Select an element that belongs to " + groupBlock +" groupBlock ? Correct!</span>";
							btnColor(prevId, correctColor)
							setTimeout(function(){
								find_element_symbol(); 
							}, 3000);
						}
						else{
							
							updateScore(--score);
							fb.innerHTML = "Your answer is not correct! ";
						}
				} else if(question_number === 4){
					if(studentPeriod === period){
						
						updateScore(++score);
						p3.innerHTML = "<span style='color:green'>Select an element that belongs to period " + period +" ? Correct! </span>";
						btnColor(prevId, correctColor)
						setTimeout(function(){
							find_element_symbol(); 
						}, 3000);
					}else{
						updateScore(--score);
						fb.innerHTML = "Your selected answer is not correct! " ;
					}
				}

			});//endof getData
			} //end of if it is the element buttons
	});//endof button-clicked event 
	game_heading_text.appendChild(p3);
	
}//endofQuiz2
