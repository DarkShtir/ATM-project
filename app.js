const arrQueue = [];
const arrRoom = [];

class Atm {
	constructor(idAtm) {
		this.idAtm = idAtm;
	}
	isFree = true;
}

class Person {
	constructor(idPerson) {
		this.idPerson = idPerson;
	}
	workWithAtm = randomize(3, 1);
}

function startApp() {
	createScene();
	// startQueue();
}

function createScene() {
	const scene = createAllAtm(3);
	createArrPersons(5);
	console.log(scene);
}

function createAtm(idAtm) {
	let atm = new Atm(idAtm);
	return atm;
}

function createAllAtm(amountAtm) {
	let arrAtm = [];
	for (let i = 0; i < amountAtm; i++) {
		arrAtm.push(createAtm(i + 1));
	}
	return arrAtm;
}

function randomize(max, min = 1) {
	const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
	console.log(rand);
	return rand;
}

function createPerson(idPerson) {
	return new Person(idPerson);
}

function createArrPersons(num) {
	for (let i = 0; i < num; i++) {
		addedPersonsInRoom(i + 1);
	}
}
function addedPersonsInRoom(i) {
	arrRoom.push(createPerson(i));
	console.log(arrRoom);
}

function createQueue(i) {
	arrQueue.push(arrRoom[i]);
	console.log(arrQueue);
}

function checkQueue() {
	for (let i = 0; arrQueue.length < arrRoom.length; i++) {
		arrQueue.push(arrRoom[i]);
		console.log(arrQueue);
		// setTimeout(() => {
		// 	createQueue(i);
		// }, randomize(5));
	}
}
checkQueue();
startApp();
