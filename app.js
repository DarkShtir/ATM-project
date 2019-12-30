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
	createScene() {
		const scene = this.createAllAtm(3);
		const queue = this.createQueue(5);
		console.log(scene);
		console.log(queue);
	}

	createAtm(idAtm) {
		return new Atm(idAtm);
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
		return arrQueue;
	}

	startApp() {
		this.createScene();
	}
}

class Render {
	createButton() {
		const body = document.querySelector('body');
		let div = document.createElement('div');
		let btnStart = document.createElement('button');
		btnStart.innerText = 'Start';
		div.appendChild(btnStart);
		body.appendChild(div);
	}
}

class Controller {
	startApp() {
		const btn = document.querySelector('button');
		btn.addEventListener('click', () => {
			const newScene = new Scene();
			newScene.startApp();
		});
	}
}

class Model {}

function randomize(max, min = 1) {
	const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
	console.log(rand);
	return rand;
}

// const newScene = new Scene();
// newScene.startApp();
const render = new Render();
render.createButton();
const controller = new Controller();
controller.startApp();
