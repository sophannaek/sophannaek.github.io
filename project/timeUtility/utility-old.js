/* utility.js */
/* 
The alarm clock works
The stopwatch works
The alarm clock is in progress 
Timer is in progress -- almost done-- just one tiny issue --when click on timer button again, it still shows the start up UI when the 
the timer already started. should hide div1 first setting 

*/
var clock_btn = document.getElementById('clock-btn')
var alarm_btn = document.getElementById('alarm-btn')
var timer_btn = document.getElementById('timer-btn')
var stopwatch_btn = document.getElementById('stopwatch-btn')
var main = document.getElementById('main')
//p element to display the clock - digital 
var clock_time = document.createElement('p')
clock_time.setAttribute('id', 'digital-clock')
//showClock() //need to only show on its first load 
clock_btn.onclick= function(){
	resetMain()
	showClock()
} 
alarm_btn.onclick = function(){
	//hide the digital clock 
	resetMain()
	showAlarm()
}
timer_btn.onclick = function(){
	resetMain()
	showTimer()
}
stopwatch_btn.onclick = function(){
	resetMain()
	showStopwatch()
}
var counter = 0

//add active class to hovered or clicked button 
var menu = document.getElementsByClassName('button')
//loop through the buttons and add the active class to the current/clicked button 
for (var i = 0; i < menu.length; i++){
	menu[i].addEventListener('click',function() { 
		var current = document.getElementsByClassName('active')
		// If there's no active class
		if (current.length > 0) {
			//remove 'active' class
			current[0].className = current[0].className.replace(" active", "")
		}
		// Add the active class to the current/clicked button
		this.className += " active";
	});
}

/*--------------------------- clock -----------------------*/
function showClock(){
	console.log('showClock')
	counter = setInterval(function(){
		//get the current date
		var today = new Date()
		current_hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
		current_min = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes() 
		current_sec = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
		var ampm = current_hour >= 12 ? ' pm' : 'am'
		clock_time.innerHTML = current_hour + " : " + current_min +" "+ ampm
		main.appendChild(clock_time)
},1000)
}

/*-------------------------- stopwatch ----------------------------------*/
var stopwatch_div = document.getElementById('stopwatchDiv')
var lap_btn = document.createElement('button')
var start_btn = document.createElement('button')
var stopwatch_time = document.createElement('p')
var reset_stopwatch = true
lap_btn.setAttribute('class', 'btn')
lap_btn.setAttribute('id', 'lap_btn')
start_btn.setAttribute('class', 'btn')
start_btn.setAttribute('id','stopwatchStart')

var count
var lapCount
var pause = false 
//make this div scrollable since there might be more lap time display 
var lapTimeDiv = document.createElement('div')
lapTimeDiv.setAttribute('id','lapTimeDiv')
lapCount = 0
count = 0
function showStopwatch(){
	clearInterval(counter)//if the clock was shown previously 
	console.log('showStopwatch')
	var p = document.createElement('p')
	var div = document.createElement('div')
	if(reset_stopwatch === true ){
		lap_btn.innerHTML= 'Lap'
		start_btn.innerHTML = 'Start'
	}
	div.appendChild(lap_btn)
	div.appendChild(start_btn)
	stopwatch_time.innerHTML = "00 : 00 : 00" 
	stopwatch_div.appendChild(stopwatch_time)
	console.log(stopwatch_div)
	stopwatch_div.appendChild(div)
	stopwatch_div.appendChild(lapTimeDiv)
	stopwatch_div.style.display='block'
	main.appendChild(stopwatch_div)
	console.log(stopwatch_div)
	
	//start stopwatch 
	var stopwatch_counter = 0
	start_btn.onclick = function(){
		if(start_btn.textContent ==='Start'){
			if(lap_btn.textContent === 'Lap'){
				console.log('starting stopwatch')
				//count = 0
				count = startStopwatch()
				
			}else if(lap_btn.textContent === 'Reset'){
				console.log('resume stopwatch')
				//change the inner text to zero and the count difference 
				//dont have to call the startStopwatch() again cuz it will duplicate the count variable
				lap_btn.textContent = 'Lap'
				pause = false
			}
			start_btn.textContent = 'Stop'
		}else if(start_btn.textContent === 'Stop'){
			pause = true
			start_btn.textContent = 'Start'
			lap_btn.textContent = 'Reset'
		}		
		reset_stopwatch = false
	}//endof Start btn of stopwatch 
	//create lap time interval
	lap_btn.onclick = function(){
		if(lap_btn.textContent === 'Lap'){
			console.log('lapCount ' + lapCount)
			lapCount += 1
			//create lap time
			lapTime(lapCount)
		}else if(lap_btn.textContent ==='Reset'){
			//reset the stopwatch 
			lap_btn.textContent = 'Lap'
			
			stopStopwatch()
			resetLapTime()
		}
	}
}

function startStopwatch(){
	//resume the stopwatch 
	stopwatch_counter = setInterval(function(){
		if(!pause){
				count += 1
			} 
		console.log(pause)
		console.log('count ' + count)
		var times = convertTime(count)
		//current_sec = count > 60 ? 0 : count;
		var current_hour = times[0] < 10 ? "0" + times[0] : times[0]
		var current_min =  times[1] < 10 ? "0" + times[1] : times[1]
		var current_sec =  times[2] < 10 ? "0" + times[2] : times[2]
		//this stopwatch clock lagged by 1 sec
		stopwatch_time.innerHTML = current_hour + " : " + current_min + " : " + current_sec
		
},1000)

	return count
	//main.appendChild(stopwatch_time)	
}
function lapTime(lapCount){
	//lapCount += 1
	console.log("lapCount laptime " + lapCount)
	var times = convertTime(count)
	var current_hour = times[0] < 10 ? "0" + times[0] : times[0]
	var current_min =  times[1] < 10 ? "0" + times[1] : times[1]
	var current_sec =  times[2] < 10 ? "0" + times[2] : times[2]
	var p = document.createElement('p')
	p.setAttribute('id','p-lap')
	p.innerHTML ="Lap " + lapCount + " -- " + current_hour + " : " + current_min + " : " + current_sec
	if(start_btn.textContent !== 'Start'){
		lapTimeDiv.appendChild(p)
	}
}

function resetLapTime(){
	//set stop watch to all zero 
	console.log('reset stopwatch ')
	stopwatch_time.innerHTML = '00 : 00 : 00' 
	document.getElementById('lap_btn').textContent = 'Lap'
	count = 0
	lapCount = 0
	pause = false
	var el = document.getElementById('lapTimeDiv')
	console.log('lapcount '+ lapCount)
	//remove all the p element append in the document 
	while (el.hasChildNodes()){
		console.log(el.firstChild)
		el.removeChild(el.firstChild)
	}
}
//stop stopwatch
function stopStopwatch(){
	console.log('stopping time laps....')
	clearInterval(stopwatch_counter)
	console.log('stopped')
}
//clear the main UI for other options
function resetMain(){
	var el = document.getElementById('main')
	clearInterval(counter)
	while (el.hasChildNodes()){
		el.removeChild(el.firstChild)
	}
}

//convert total sec to hour, min, sec in an array 
function convertTime(totalSeconds){
	var hours = parseInt(totalSeconds /3600)
	var minutes = parseInt((totalSeconds % 3600) /60) 
	var seconds = parseInt((totalSeconds %3600 ) % 60)
	return [hours, minutes, seconds]
}

/*-------------------------- timer ----------------------------*/
var timerDiv = document.getElementById('timerDiv')
var timer_div1 = document.createElement('div')
var timer_div2 = document.createElement('div')
var hr
var min
var sec
var timer_pause = false
var timer_resume = false
var timer_reset = true
function showTimer(){
	console.log('showTimer')
	resetTimer(timer_div1,timer_div2)
	timerDiv.style.display = 'block'
	//create the UI should only happen once 
	var id= ["hr", "min", "sec"]
	var list = ["hourList", "minList", "secList"]
	var label=["hourLabel", "minLabel", "secLabel"]
	var text = ["hr","min","sec"]
	for (var i = 0; i < list.length; i++){
		//create dropdown for timer
		list[i]= document.createElement('select')
		list[i].setAttribute("id",id[i])
		list[i].setAttribute('class', "form-control")
		label[i] = document.createElement('label')
		label[i].innerHTML = text[i]
	}
	
	for (var i=0; i<60; i++){
		if (i < 24){
			var hour = new Option(i, i)
			list[0].appendChild(hour)
		}
		//create minutes menu
		var minute = new Option(i,i)
		//minList.appendChild(min)
		list[1].appendChild(minute)
		//create seconds menu
		var second = new Option(i,i)
		//secList.appendChild(sec)
		list[2].appendChild(second)
	}

	timer_div1.appendChild(list[0])
	timer_div1.appendChild(label[0])
	timer_div1.appendChild(list[1])
	timer_div1.appendChild(label[1])
	timer_div1.appendChild(list[2])
	timer_div1.appendChild(label[2])
	var buttons = ["timer_cancel", "timer_start"]
	var btn_text = ["Cancel", "Start"]
	var btn_id = ["timer_cancel_btn", "timer_start_btn"]
	for(var j =0; j <buttons.length; j++){
		buttons[j] = document.createElement('button')
		buttons[j].setAttribute('id',btn_id[j])
		buttons[j].setAttribute('class','btn')
		buttons[j].innerHTML = btn_text[j]	
	}
	timer_div2.appendChild(buttons[0])
	timer_div2.appendChild(buttons[1])
	timerDiv.appendChild(timer_div1)
	timerDiv.appendChild(timer_div2)
	
	main.appendChild(timerDiv)
	hr = document.getElementById('hr')
	min = document.getElementById('min')
	sec = document.getElementById('sec')
	
	var timer_start = document.getElementById('timer_start_btn')
	var timer_cancel = document.getElementById('timer_cancel_btn')
		
	timer_start.onclick = function(){
		var hour = parseInt(hr.value, 10) //base 10 
		var mins = parseInt(min.value, 10) 
		var secs = parseInt(sec.value , 10) 
		var total_sec = hour * 60 * 60 + mins * 60 + secs 
		console.log('total sec ' + total_sec)
		if(timer_start.textContent === "Start"){
			timer_reset = false
			console.log('starting timer...')
			timer_start.textContent = "Pause"
			resetDiv(timer_div1)
			if(total_sec === 0){
				showTimer()
			}	
			else { 
				//startTimer only when it is the first time start -- not start from resume	
				if(timer_resume){
					console.log('resuming timer....')
					timer_pause = false
				}else{
					startTimer(total_sec,timer_div1)
				}
			}
			
		}else if(timer_start.textContent ==="Pause"){//pause the timer
			console.log('pausing the timer...')
			timer_start.textContent = 'Start'
			timer_pause = true
			timer_resume = true
		}	
	}
	timer_cancel.onclick = function(){
		clearInterval(timeout)
		timer_start.innerHTML = 'Start'
		console.log('canceling timer...')
		resetTimer(timer_div1,timer_div2)
		console.log(timerDiv)
		showTimer()
	}
}


function startTimer(duration, display){
	var  timer = duration// hours, minutes, seconds; 
	console.log(timer_pause)
	timeout = setInterval(function(){
		hours = parseInt(timer/3600,10)
		minutes = parseInt((timer% 3600) / 60, 10)
		seconds = parseInt((timer % 3600) % 60, 10 )
		var hours = hours < 10 ? "0" + hours : hours
		var minutes = minutes < 10 ? "0" + minutes : minutes 
		var seconds = seconds < 10 ? "0" + seconds : seconds 
		display.innerHTML = hours + " : " + minutes + " : " + seconds 
		if(!timer_pause){//if not pause
			console.log(timer)
			timer--	
		}
		 if (timer < 0) {
			timer = 0;
			alert("time is up! ")
			clearInterval(timeout)
			console.log('stopping the timer ...')
			showTimer()
			return 0;
		}
		},1000);
}
function resetTimer(div1,div2){
	resetDiv(div1)
	resetDiv(div2)
}

function resetDiv(divId){
	//remove all the p element append in the document 
	el = divId
	while (el.hasChildNodes()){
		el.removeChild(el.firstChild)//not working
	}
}

/*------------------------- alarm clock -------------------------------*/
var alarmDiv = document.getElementById('alarm-div')
//should also have snooze option
function showAlarm(){
	//show list of active alarm that have been set ! 
	console.log('show alarm clock')
	console.log(alarmDiv)
	resetDiv(alarmDiv)
	alarmDiv.style.display = 'block'
	var alarm_div1 = document.createElement('div')
	
	//create a dropdown menu for the hour and minute 
	var hourList = document.createElement('select')
	var minList = document.createElement('select')
	var hourLabel = document.createElement('label')
	var minLabel = document.createElement('label')
	var ampmList = document.createElement('select')
	hourList.setAttribute('class', "form-control")
	minList.setAttribute('class', "form-control")
	ampmList.setAttribute('class', 'form-control')
	var alarm_start = document.createElement('button')
	alarm_start.setAttribute('id', 'alarmStart')
	alarm_start.setAttribute('class', 'btn')
	alarm_start.innerHTML = 'Start'
	hourLabel.innerHTML = 'hr'
	minLabel.innerHTML = 'min'
	hourList.setAttribute('id', 'hr')
	minList.setAttribute('id', 'mn')
	ampmList.setAttribute('id', 'ampm')
	for(var j = 1; j <= 12 ; j++ ){
		var hour = new Option(j, j)
		hourList.appendChild(hour)
	}
	for(var i =0 ; i < 59 ; i++){	
		var min = new Option(i,i)
		minList.appendChild(min)	
	}
	ampmList.appendChild(new Option('am','am'))
	ampmList.appendChild(new Option('pm', 'pm'))
	alarm_div1.appendChild(hourList)
	alarm_div1.appendChild(hourLabel)
	alarm_div1.appendChild(minList)
	alarm_div1.appendChild(minLabel)
	alarm_div1.appendChild(ampmList)
	alarmDiv.appendChild(alarm_div1)
	main.appendChild(alarmDiv)
	main.appendChild(alarm_start)
	var hr = document.getElementById('hr')
	var mn = document.getElementById('mn')
	var ampms = document.getElementById('ampm')
	
	alarm_start.onclick= function(){
		console.log('starting the alarm')
		var hours = parseInt(hr.value, 10) 
		var mins = parseInt(mn.value, 10)
		console.log("ampms..." + ampms.value)
		createAlarm(hours, mins, ampm, ampms)
		//need to disable the buttons
	}
}
function createAlarm(hours, mins, ampm){
	//need to take ampm into account 
	document.getElementById('alarmStart').style.display = 'none'
	alarmDiv.style.display = 'none'
	var todays = new Date()
	var year = todays.getFullYear()
	var month = todays.getMonth()
	var hour = todays.getHours() 
	var day = todays.getDate()
	var alarm_display = document.createElement('p')
	
	console.log(ampm.value)
	console.log("todays date ---------", todays)
	console.log("year", year)
	console.log("month", month)
	console.log("day", day)
	console.log ("hour", hour)
	console.log("ampm : ", ampm.value)
	//if ampm.value not equal to this pm value 
	if(ampm.value === "pm") {console.log('here....'); hours += 12;}
	console.log(`hours: ${hours}`)
	

	if(hours >= hour ){
		console.log('afternoon alarm clock at ' + hours)
	}else{
		//will be alarm for tomorrow morning
		day += 1
	}

	var newDate = new Date(year, month, day,hours,mins);
	
	var diff = newDate - todays ;//ms
	console.log(`current date ${todays}`);
	console.log(`date diff ${diff/1000}`);
	console.log(`${diff/1000/3600}`)

	console.log(`new date ${newDate}`);
	var d = new Date(year, month, day)//new date for
	if(hours < 10 ){
		hours = "0"+hours
	}
	if(mins <10 ){
		mins = "0"+mins
	}
	alarm_display.innerHTML ="alarm: " + hours +" : "+ mins+" "+ampm.value
	main.appendChild(alarm_display)
	console.log("the alarm will go off at " + hours +" : "+ mins+" " +ampm.value+ " on "+ d )

	//just create a timer up to that date 
//	var timer =hours * 60 * 60 + mins * 60;
	var timer = diff/1000;//in seconds 
	timeout = setInterval(function(){
		timer--
		//console.log(timer)
		if(timer < 0){
			timer = 0; 
			alert('alarm is on! ')
			//should have a snooze option for 10min	
			clearInterval(timeout)
			snooze(alarm_display, parseInt(hours), parseInt(mins), ampm)
		}
	},1000); 
}

function snooze(alarm_display, hours, mins, ampm){
	var d1 = document.createElement('div')
	var d2 = document.createElement('div')
	var b1 = document.createElement('button')
	var b2 = document.createElement('button')
	var p1 = document.createElement('p')
	p1.setAttribute('id','ptext')
	p1.innerHTML = 'Would you like to snooze for another 5 minutes?'
	b1.innerHTML = 'NO' 
	b2.innerHTML = 'YES'
	d1.setAttribute('id', 'snooze')
	d2.setAttribute('id', 'snooze-div')
	b1.setAttribute('id', 'snooze-btn')
	b2.setAttribute('id', 'snooze-btn')
	
	d1.appendChild(p1)
	d2.appendChild(b1)
	d2.appendChild(b2)
	d1.appendChild(d2)
	document.getElementById('main').appendChild(d1)
	
	//if szooze -- go for another 5mins
	b1.onclick = function(){
		//clear the snooze div 
		resetDiv(d1)
		d1.style.display='none'
		document.getElementById('alarmStart').style.display = 'block'
		alarmDiv.style.display = 'block'
		alarm_display.innerHTML = ''
		return; 
	}
	b2.onclick = function(){
		var timer = 5*60 //snooze to 5 mins
		resetDiv(d1)
		d1.style.display='none'
		mins = parseInt(mins + 5)
		mins >= 60 ? (mins = mins % 60, hours += 1) : mins
		hours = hours < 10 ? '0' + parseInt(hours) : hours;
		mins = mins < 10 ? '0' + parseInt(mins) : mins; 
		alarm_display.innerHTML ="alarm: " + hours +" : "+ mins+" "+ampm.value
		timeout = setInterval(function(){
			timer--
			console.log(timer)
			if(timer < 0){
				timer = 0; 
				clearInterval(timeout)
				snooze(alarm_display, hours, mins, ampm)
			}
		},1000); 
	}
}


