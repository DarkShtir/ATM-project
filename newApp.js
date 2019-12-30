class Atm {
	constructor(idAtm) {
		this.idAtm = idAtm;
	}
	user = [];
	isFree = true;
	switchState() {
		this.isFree ? false : true;
	}
}

class Person {
	constructor(idPerson) {
		this.idPerson = idPerson;
	}
	workWithAtm = randomize(3, 1);
	useAtm() {
		switchState();
		//изменение состояния АТМ в пользователе.
		//по сути логика проста АТМ извлекает пользователя из очереди
		//пользователь меняет состояние АТМ на isFree=false
		//по истечении workWithAtm состояние меняется на isFree=true
		//следующий пользователь из очереди готов к извлечению.
		setTimeout(() => {
			switchState();
		}, this.workWithAtm);
	}
}

let scene = [];
let queue = [];

function createScene(amountATM, amountPersonInQueue) {
	scene = createAllAtm(amountATM);
	queue = createQueue(amountPersonInQueue);
	console.log(scene);
	console.log(queue);
}

function createAtm(idAtm) {
	return new Atm(idAtm);
}

function createAllAtm(amountAtm) {
	let arrAtm = [];
	for (let i = 0; i < amountAtm; i++) {
		arrAtm.push(createAtm(i + 1));
	}
	return arrAtm;
}

function createQueue(num) {
	const arrQueue = [];

	let rand = randomize(5);
	let iter = 0;
	let timerID = setTimeout(function create() {
		if (iter < num) {
			iter++;
			pushPerson(createPerson(iter), arrQueue);
			console.log(arrQueue);
			rand = randomize(5);
			timerID = setTimeout(create, rand);
		} else {
			clearTimeout = timerID;
		}
	}, rand);
	return arrQueue;
}

function createPerson(idPerson) {
	console.log('Person is created');
	return new Person(idPerson);
}

function pushPerson(person, arr) {
	console.log('Person added in queue');
	arr.push(person);
}

function randomize(max, min = 1) {
	const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
	console.log(rand);
	return rand;
}

function createEvent() {
	const myEvent = new CustomEvent('AtmFree', {
		detail: {
			state: free,
		},
	});
	return myEvent;
}
function addCustomEvent(arr) {
	for (let i = 0; i < arr.length; i++) {
		let event = createEvent();
		arr[i].dispatchEvent(event);
		console.log('event Added!');
	}
}
addCustomEvent(scene);

function useAtm(idAtm, idPerson) {
	scene[idAtm - 1].user = queue.shift();
	switchState();
	//изменение состояния АТМ в пользователе.
	//по сути логика проста АТМ извлекает пользователя из очереди
	//пользователь меняет состояние АТМ на isFree=false
	//по истечении workWithAtm состояние меняется на isFree=true
	//следующий пользователь из очереди готов к извлечению.
	setTimeout(() => {
		switchState();
		scene[idAtm - 1].user = [];
	}, scene[idAtm - 1].user.workWithAtm);
}

createScene(3, 5);
