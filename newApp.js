class Atm {
	constructor(idAtm) {
		this.idAtm = idAtm;
	}
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

createScene(3, 5);
