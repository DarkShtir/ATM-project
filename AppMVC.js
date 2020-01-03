//EventEmmiter - create events and listener them
class EventEmmiter {
	constructor() {
		this.events = {};
	}
	on(event, listener) {
		(this.events[event] || (this.events[event] = [])).push(listener);
		return this;
	}
	emitter(event, arg) {
		(this.events[event] || []).slice().forEach(lsn => lsn(arg));
	}
}
//Model-business logic
class Model extends EventEmmiter {
	constructor(controller) {
		super();
		this.controller = controller;
		this.arrAtm = [];
		this.queue = [];
		this.amountPerson = 0;
		this.amountAtm = 0;
		this.idPerson = 0;
		self = this;
	}
	createAtm() {
		return new Atm(this.amountAtm + 1);
	}
	pushAtmInArr(atm) {
		this.arrAtm.push(atm);
	}
	removeAtmFromArr() {
		this.arrAtm.splice(this.arrAtm.length - 1, 1);
	}
	createScene(num = 3) {
		for (let i = 0; i < num; i++) {
			this.pushAtmInArr(this.createAtm());
		}
	}
	deletePersonFromQueue() {
		this.queue.splice(0, 1);
	}
	// addPersonInQueue(person) {
	// 	this.queue.push(person);
	// }
	// createPerson() {
	// 	let rand = this.randomizer(3);
	// 	console.log(this);
	// 	let newPerson = new Person(++this.idPerson, rand);
	// 	return newPerson;
	// }

	// createQueue() {
	// 	let rand = this.randomizer(5);
	// 	let num = this.amountPerson;
	// 	let iter = 0;

	// 	let timerID = setTimeout(create => {
	// 		if (iter < num) {
	// 			iter++;
	// 			let pers = self.createPerson();
	// 			this.addPersonInQueue(pers);
	// 			rand = this.randomizer(5);
	// 			timerID = setTimeout(create, rand);
	// 		} else {
	// 			clearTimeout = timerID;
	// 		}
	// 	}, rand);
	// }

	createQueue(queue) {
		let timer = self.randomizer(5);
		let num = this.amountPerson;
		let iter = 0;

		let timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				let newPerson = new Person(iter, self.randomizer(3));
				console.log('Person created');
				queue.push(newPerson);
				console.log('Person added in queue');
				self.emitter('personAdded', queue[iter - 1].idPerson);
				timer = self.randomizer(5);
				timerID = setTimeout(create, timer);
			} else {
				clearTimeout = timerID;
			}
		}, timer);
	}

	useAtm(idAtm) {
		let time = this.queue[0].workWithAtm;
		let numAtm = this.arrAtm[idAtm];
		numAtm.switchState();
		console.log(`Atm ${numAtm} is busy`);
		setTimeout(() => {
			numAtm.switchState();
		}, time);
	}

	randomizer(max, min = 1) {
		const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
		console.log(rand);
		return rand;
	}
}

//View-render DOM
class View {
	constructor() {
		this.body = document.querySelector('body');
	}
	render() {
		this.createControl();
		console.log('Work in progress!');
	}
	createControl() {
		let fragment = document.createDocumentFragment();
		let div = this.createNewElement('div', 'control');
		let startBtn = this.createBtn('Start');
		let finishBtn = this.createBtn('Finish');
		let addAtm = this.createBtn('AddATM');
		let deleteAtm = this.createBtn('DeleteAtm');
		div.append(startBtn);
		div.append(finishBtn);
		div.append(addAtm);
		div.append(deleteAtm);
		fragment.append(div);
		this.body.append(fragment);
	}
	createBtn(name) {
		let btn = document.createElement('button');
		btn.className = `btn-${name} btn`;
		btn.innerHTML = name;
		return btn;
	}

	createAtm(arr) {
		let fragment = document.createDocumentFragment();
		let divScene = this.createNewElement('div', 'atm-scene');
		arr.forEach((currentVal, index) => {
			let div = this.createNewElement('div', `${index + 1}-atm atm`);
			divScene.append(div);
		});
		fragment.append(divScene);
		this.body.append(fragment);
	}
	createPerson(personID) {
		let fragment = document.createDocumentFragment();
		let queueDiv = document.querySelector('.queue');
		let div = this.createNewElement('div', `personID-${personID} person`);
		div.innerHTML = personID;
		fragment.append(div);
		queueDiv.appendChild(fragment);
		console.log(queueDiv);
	}
	createQueue() {
		let fragment = document.createDocumentFragment();
		let divQueue = this.createNewElement('div', 'queue');
		fragment.append(divQueue);
		this.body.append(fragment);
	}
	createNewElement(typeOfElement, nameOFClass = `${typeOfElement}`) {
		let newEl = document.createElement(`${typeOfElement}`);
		newEl.className = nameOFClass;
		return newEl;
	}
	addElement() {
		console.log('Work in progress!');
	}
	deleteElement() {
		console.log('Work in progress!');
	}
}
//Controller-Listen event from view and transfer them in Model and backward
class Controller extends EventEmmiter {
	constructor(view, model) {
		super();
		this.view = view;
		this.model = model;
		model.on('personAdded', personId => this.rebuildQueue(personId));
	}
	rebuildQueue(personId) {
		console.log(`My person ID: ${personId}`);
		this.view.createPerson(personId);
	}
	startEvent() {
		let div = document.querySelector('.control');
		console.log(div);
		div.addEventListener('click', e => {
			console.log(e.target.className);
			if (e.target.className == 'btn-Start btn') {
				console.log('You press Start');
				this.model.amountPerson = 5;
				this.model.createScene();
				this.view.createAtm(this.model.arrAtm);
				this.view.createQueue();
				this.model.createQueue(this.model.queue);
			} else if (e.target.className === 'Finish') {
			}
		});
	}
}

class Atm {
	constructor(idAtm) {
		this.idAtm = idAtm;
		this.isFree = true;
	}
	switchState() {
		this.isFree ? false : true;
	}
}

class Person {
	constructor(idPerson, rand) {
		this.idPerson = idPerson;
		this.workWithAtm = rand;
	}
}

const view = new View();
view.render();
const model = new Model();
const controller = new Controller(view, model);
controller.startEvent();
