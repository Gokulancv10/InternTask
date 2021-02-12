

var cBtn = document.querySelector('#completedbth');

var listItem = document.querySelector('#completedItems');

var upItem = document.querySelector('#upcomingItem');

function completed(){
	document.body.style.backgroundColor = 'green';
}


function completedItem(){
	document.getElementById('completedItems').innerHtml = document.getElementById('#upcomingItem');

}