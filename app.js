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

class Scene {
	// arrQueue = [];
	arrRoom = [];

	createScene() {
		const scene = this.createAllAtm(3);
		this.createQueue(5);
		console.log(scene);
	}

	createAtm(idAtm) {
		let atm = new Atm(idAtm);
		return atm;
	}

	createAllAtm(amountAtm) {
		let arrAtm = [];
		for (let i = 0; i < amountAtm; i++) {
			arrAtm.push(this.createAtm(i + 1));
		}
		return arrAtm;
	}

	createQueue(num) {
		const arrQueue = [];
		function createPerson(idPerson) {
			console.log('Person is created');
			return new Person(idPerson);
		}

		function pushPerson(person) {
			console.log('Person added in queue');
			arrQueue.push(person);
		}

		let rand = randomize(5);
		let iter = 0;
		let timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				pushPerson(createPerson(iter));
				console.log(arrQueue);
				rand = randomize(5);
				timerID = setTimeout(create, rand);
			} else {
				clearTimeout = timerID;
			}
		}, rand);
	}

	// createArrPersons(num) {
	// 	for (let i = 0; i < num; i++) {
	// 		addedPersonsInRoom(i + 1);
	// 	}
	// }

	// addedPersonsInRoom(i) {
	// 	setTimeout(i => {
	// 		arrRoom.push(createPerson(i));
	// 		console.log(arrRoom);
	// 	}, randomize(5));
	// }

	// createQueue(i) {
	// 	arrQueue.push(arrRoom[i]);
	// 	console.log(arrQueue);
	// }

	startApp() {
		this.createScene();
		// startQueue();
	}
}

function randomize(max, min = 1) {
	const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
	console.log(rand);
	return rand;
}

const newScene = new Scene();
newScene.startApp();
