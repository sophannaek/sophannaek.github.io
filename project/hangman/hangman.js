/** 
 ** About: Hangman Game
 **	Features:
	* Hint: Upto 2 characters will be given.
	* Previous chosen incorrect character will be disabled
 ** Written By: Sophanna EK 
**/


//first start with the hanger! it will take 5 times to lose the game 
var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
drawHanger(ctx)

let root = document.getElementById('root')
let play_again = document.getElementById('play-again')
let hint = document.getElementById('hint')
play_again.addEventListener('click', loadGame)
hint.addEventListener('click', showHint)


let dictionary =['car', 'pathetic','banjo','awkward','go','morning','slack','zombie','wave','syndrome','vodka','chicken','winter','beach','mountain','hiking','jogging','moon','baloon','cloud','train','vehicle','google','apple','monkey','wait','money','lover','computer','England'] 
let objs = [] //obj to hold letter object in each hang-man word
let prev_num = -1
let count = 0 
let correctCount = 0
let hintCount = 0
var correctWord
var test 
//get random number 
var random_number = Math.floor(Math.random() * (dictionary.length) ) 
console.log('random number: ' + random_number)
prev_num = localStorage.getItem('prev_num')
console.log('prev number: ' + prev_num)
//not working for word count
//var wordCount = localStorage.getItem('correctWordCount')
console.log('number of correct words : '+  localStorage.getItem('correctWordCount'))
if(random_number === prev_num) {
	console.log("same previous number")
	random_number = Math.floor(Math.random() * (dictionary.length))
}
	
let word = dictionary[random_number]
//to prevent same word back to back
localStorage.setItem('prev_num',random_number)//save the number locally 
console.log('session...' + sessionStorage.getItem('correctss'))

//should make sure the same word appears back to back 
console.log(word)
let len = word.length
correctWord = 0
for (var i=0; i <len; i++){
	
	//create text input for the puzzle word
	var p1= document.createElement('input')
	p1.setAttribute('id',i)
	p1.setAttribute('class','input_field')
	p1.setAttribute('maxlength','1')
	//create an letter obj for each character in the hang man word
	var obj = new letter(word.charAt(i), i)
	objs.push(obj)
	root.appendChild(p1)

}
//get all the buttons of characters
var buttons = document.getElementsByClassName('btn')
var ans

$(".btn").click(function(){
	ans=$(this).text()
	console.log(ans.toLowerCase())
	isExisted(ans.toLowerCase(), $(this))
})

function isExisted(c, div){
	var correct = false
	for (var i = 0; i <objs.length; i++){
		var letter = objs[i].character
		//if the guessing character is in given word
		if(c === letter){
			console.log('existed...')
			//put it in the input field 
			var input_field = document.getElementsByClassName('input_field')
			console.log(document.getElementById(i))
			document.getElementById(i).value = c
			objs[i].used = true
			//highlight the button green with it is correct 
			correct = true
			correctCount += 1		
		}
	}
	if(correct){
		markedCorrect(div)
	}else{
		count += 1
		//start drawing the man
		markedWrong(div)
		drawMan(ctx,count)	
	}
	//disable all buttons when the puzzle is solved 
	if (correctCount === (objs.length - hintCount) || count == 6){
		disable()
		play_again.style.display = 'block'
		console.log('hintCount ' + hintCount)
		if(correctCount == (objs.length -hintCount) ){
			correctWord =parseInt(localStorage.getItem('correctWordCount'))+ 1 //need to perform math here 
			console.log('correct words...' +correctWord)
			localStorage.setItem('correctWordCount',correctWord)
			
			sessionStorage.setItem('correctss',parseInt(sessionStorage.getItem('correctss')) + 1) 
			console.log(sessionStorage.getItem('correctss'))
			
			alert("You Got It")
		}else if(count == 6){
			alert("You lose!")
			displayAns()
		}
		console.log(correctWord)
	}
}
//marked answer correct 
function markedCorrect(div){
	div.addClass('correct')
}

function markedWrong(div){
	console.log('marking incorrect ....')
	div.addClass('incorrect')
}

//create letter obj
function letter(character, position){
	this.character = character
	this.position = position
	this.used = false
}

function disable(){
	for(var i = 0; i< buttons.length ; i++){
		buttons[i].disabled = true
	}
}
function disableButton(letter){
	console.log("disable button in letter " + letter)
	for(var i = 0; i < buttons.length; i++){
		if((buttons[i].textContent).toLowerCase() === letter){
			buttons[i].disabled = true
			buttons[i].classList.add('correct')
		}
	}
}
function compare(char1, char2){
	return char1=== char2
}

//reset the game 
function loadGame(){
	console.log('loading the game again ....')
	//false flag will re-execute the website without reloading anything from the web whch is cached locally (clear all the caches) 
	window.location.reload(false);
	
}

function displayAns(){
	for (var i = 0; i <objs.length; i++){
	//	console.log(objs[i].character)
		var letter = objs[i].character
		//put it in the input field 
			var input_field = document.getElementsByClassName('input_field')
			document.getElementById(i).value =  letter
	}
}

window.onload=function(){
	console.log('window is loading...')
}
/*
window.onbeforeunload = function() {
  return "There are unsaved changes. Leave now?";
};
*/
function showHint(){
	var random_number = Math.floor(Math.random() * objs.length )
	var letter = objs[random_number].character
	//need to give all letter with they occur in multiple place
	if(!objs[random_number].used){
		hintCount += 1
		document.getElementById(random_number).value = letter
		//disable the text input field for hinted character 
		document.getElementById(random_number).disabled = true 
		objs[random_number].used = true
		//disable the character button 
		disableButton(letter)
		for (var i = 0; i < objs.length ; i++ ){
			if(letter === objs[i].character && (i != random_number) ){
				document.getElementById(i).value = letter
				document.getElementById(i).disabled = true
				objs[i].used = true
				hintCount +=1
			}
		}
	}
	
	console.log('hintcount '+ hintCount)
	if(hintCount === 2){
		hint.disabled = true
	}
}

function drawHanger(ctx){
	//var ctx1= canvas.getContext('2d')
	ctx.moveTo(20,200)
	ctx.lineTo(100,200)//draw horizontal line
	ctx.moveTo(60,200)
	ctx.lineTo(60,0)//draw vertical line 
	ctx.moveTo(60,20)
	ctx.lineTo(80,0)
	ctx.moveTo(60,0)
	ctx.lineTo(120,0)
	ctx.lineTo(120,20)
	ctx.stroke()
}
function drawMan(ctx, count ){
	//draw a man
	ctx.beginPath()
	switch(count){
		case 1: 
			ctx.arc(120, 30, 10, 0, 2 * Math.PI,true)//draw the circle
			break
		case 2: 
			//draw body
			ctx.moveTo(120,40)
			ctx.lineTo(120,90)
			break
		case 3: 
			//draw left hand
			ctx.moveTo(120,50)
			ctx.lineTo(100,60)
			break
		case 4: 
			ctx.moveTo(120,50)
			ctx.lineTo(140,60)
			break
		case 5: 
			//draw right hand
			ctx.moveTo(120,90)
			ctx.lineTo(100,110)
			break
		case 6: 
			ctx.moveTo(120,90)
			ctx.lineTo(140,110)
			break
	}
	ctx.stroke();
}
//not working
for (let i = 0; i < localStorage.length; i++){
  let key = localStorage.key(i);
  let value = localStorage.getItem(key);
  console.log(key, value);
}
