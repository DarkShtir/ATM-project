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

class Atm {
	constructor(idAtm) {
		this.idAtm = idAtm;
		this.isFree = true;
	}
}

class Person {
	constructor(idPerson, rand) {
		this.idPerson = idPerson;
		this.workWithAtm = rand;
	}
}

//Model-business logic
class Model extends EventEmmiter {
	constructor() {
		super();
		this.arrAtm = [];
		this.queue = [];
		this.amountPerson = 0;
		this.amountAtm = 0;
		this.idAtm = 0;
		this.idPerson = 0;
		self = this;
	}
	createAtm(idAtm) {
		return new Atm(idAtm);
	}
	pushAtmInArr(atm) {
		this.arrAtm.push(atm);
	}
	removeAtmFromArr() {
		this.arrAtm.splice(this.arrAtm.length - 1, 1);
	}
	createScene() {
		for (let i = 0; i < this.amountAtm; i++) {
			this.idAtm++;
			this.pushAtmInArr(this.createAtm(this.idAtm));
		}
	}
	createPerson() {
		self.idPerson++;
		let rand = self.randomizer(10);
		let newPerson = new Person(self.idPerson, rand);
		return newPerson;
	}
	addPersonInQueue(person) {
		self.queue.push(person);
	}
	createQueue(amountPerson = 10) {
		let timer = 0;
		let num = amountPerson;
		let iter = 0;

		let timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				self.addPersonInQueue(self.createPerson());
				self.emitter(
					'personAdded',
					self.queue[self.queue.length - 1].idPerson
				);
				timer = self.randomizer(2);
				timerID = setTimeout(create, timer);
			} else {
				clearTimeout = timerID;
			}
		}, timer);
	}

	// checkAtm() {
	// 	this.arrAtm.forEach(value => {
	// 		if (value.isFree) {
	// 			console.log(`ATM with ID ${value.idAtm} is free`);
	// 			self.emitter('iAmFreeAtm', value.idAtm);
	// 		}
	// 	});
	// }

	useAtm(idAtm) {
		let usedAtm = self.arrAtm[idAtm - 1];
		console.log(usedAtm.isFree);
		console.log(`Используется АТМ с ID ${idAtm}`);
		let time = self.queue[0].workWithAtm;
		self.arrAtm[idAtm - 1] = self.switchState(usedAtm);
		console.log(`Теперь банкомат с ID ${idAtm} занят`);
		this.emitter('deletePerson');
		setTimeout(usedAtm => {
			self.arrAtm[idAtm - 1] = self.switchState(usedAtm);

			// self.checkAtm();
		}, time);
	}

	deletePersonFromQueue() {
		setTimeout(() => {
			if (this.queue.length > 0) {
				self.emitter('personDeleted', this.queue[0].idPerson);
				console.log('Im deleted');
				this.queue.splice(0, 1);
			}
		}, 1000);
	}
	// iAmFirst() {
	// 	if (this.queue.length <= this.arrAtm.length) {
	// 		this.checkAtm();
	// 	}
	// }
	switchState(usedAtm) {
		if (usedAtm.isFree) {
			usedAtm.isFree = false;
			self.emitter('changeSwitchFalse', usedAtm);
			return usedAtm;
		} else {
			usedAtm.isFree = true;
			self.emitter('changeSwitchTrue', usedAtm);
			return usedAtm;
		}
		// this.isFree ? (this.isFree = false) : (this.isFree = true);
	}

	//YOU MUST REFRACTOR YOUR CODE AND YOU MUST DO ONE GLOBAL CHECKOUT

	checkPersonInQueue() {
		if (this.queue.length > 0) {
			self.emitter('queueHavePersons');
		} else {
			self.emitter('queueHaveNotPerson');
		}
	}
	checkAtmState() {
		this.arrAtm.forEach(value => {
			if (value.isFree) {
				console.log(`ATM with ID ${value.idAtm} is free`);
				self.emitter('iAmFreeAtm', value.idAtm);
				return value.idAtm;
			} else {
				self.emitter('allAtmBusy');
			}
		});
	}

	randomizer(max, min = 1) {
		const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
		// console.log(rand);
		return rand;
	}
}
//Controller-Listen event from view and transfer them in Model and backward
class Controller extends EventEmmiter {
	constructor(view, model) {
		super();
		this.view = view;
		this.model = model;
		//Old Events
		model.on('personAdded', personId => this.rebuildQueue(personId));
		model.on('personDeleted', personId =>
			this.deletePersonFromQueue(personId)
		);
		model.on('deletePerson', () => this.model.deletePersonFromQueue());
		model.on('changeSwitch', idAtm => this.changeSwitch(idAtm));

		//NEW EVENTS
		model.on('changeSwitchTrue', idAtm => this.changeSwitchTrue(idAtm));
		model.on('changeSwitchFalse', idAtm => this.changeSwitchFalse(idAtm));
		model.on('queueHavePersons', () => this.model.checkAtmState());
		model.on('iAmFreeAtm', idAtm => this.model.useAtm(idAtm));
	}
	startApp() {
		view.createControl();

		let div = document.querySelector('.control');
		div.addEventListener('click', e => {
			if (e.target.className == 'btn-Start btn') {
				this.model.amountAtm = 3;
				this.model.createScene();
				this.view.createAtm(this.model.arrAtm);
				this.model.createQueue();
				this.view.createQueue();
			}
		});
	}
	rebuildQueue(personId) {
		this.view.createPerson(personId);
		this.model.checkPersonInQueue();
		// this.model.iAmFirst();
		// this.model.checkAtm();
	}
	deletePersonFromQueue(personId) {
		this.view.deletePersonFromQueue(personId);
		this.model.checkPersonInQueue();
		// this.model.checkAtm();
	}
	changeSwitchTrue(usedAtm) {
		this.view.switchStateAtm(usedAtm, true);
	}
	changeSwitchFalse(usedAtm) {
		this.view.switchStateAtm(usedAtm, false);
	}
}

//View-render DOM
class View {
	constructor() {
		this.body = document.querySelector('body');
	}
	render() {
		this.createControl();
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
		arr.forEach((val, index) => {
			let div = this.createNewElement('div', `${index + 1}-atm atm`);
			div.id = val.idAtm;
			divScene.append(div);
		});
		fragment.append(divScene);
		this.body.append(fragment);
	}
	createPerson(idPerson) {
		let fragment = document.createDocumentFragment();
		let queueDiv = document.querySelector('.queue');
		let div = this.createNewElement('div', `idPerson-${idPerson} person`);
		div.innerHTML = idPerson;
		fragment.append(div);
		queueDiv.appendChild(fragment);
	}
	createQueue() {
		let fragment = document.createDocumentFragment();
		let divQueue = this.createNewElement('div', 'queue');
		fragment.append(divQueue);
		this.body.append(fragment);
	}
	deletePersonFromQueue(idPerson) {
		let deletedPerson = document.querySelector(`.idPerson-${idPerson}`);
		deletedPerson.parentNode.removeChild(deletedPerson);
		console.log(`Удаляю человека из очереди с ID ${idPerson}`);
	}
	createNewElement(typeOfElement, nameOFClass = `${typeOfElement}`) {
		let newEl = document.createElement(`${typeOfElement}`);
		newEl.className = nameOFClass;
		return newEl;
	}
	switchStateAtm(usedAtm, state) {
		let busyAtm = document.getElementById(usedAtm.idAtm);
		if (state === true) {
			busyAtm.classList.remove('busy');
		} else {
			busyAtm.classList.add('busy');
		}
	}
}
const view = new View();
const model = new Model();
const controller = new Controller(view, model);
controller.startApp();
