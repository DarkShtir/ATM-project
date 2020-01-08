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
		this.idClient = '';
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
		this.idDeletedPerson = 1;
		this.timerID;
		self = this;
	}
	createAtm(idAtm) {
		return new Atm(idAtm);
	}
	pushAtmInArr(atm) {
		this.arrAtm.push(atm);
	}
	deleteSingleAtm() {
		this.arrAtm.splice(this.idAtm, 1);
		this.idAtm--;
	}
	createSeveralAtm() {
		for (let i = 0; i < this.amountAtm; i++) {
			this.createSingleAtm();
		}
	}
	createSingleAtm() {
		this.idAtm++;
		this.pushAtmInArr(this.createAtm(this.idAtm));
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
	createQueue(amountPerson = 20) {
		let timer = 0;
		let num = amountPerson;
		let iter = 0;

		this.timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				self.addPersonInQueue(self.createPerson());
				self.emitter(
					'personAdded',
					self.queue[self.queue.length - 1].idPerson
				);
				timer = self.randomizer(2);
				this.timerID = setTimeout(create, timer);
			} else {
				clearTimeout(timerID);
			}
		}, timer);
	}

	useAtm(usedAtm) {
		let time = self.queue[0].workWithAtm;
		usedAtm.idClient = self.queue[0].idPerson;
		self.switchState(usedAtm);
		console.log(
			`Теперь банкомат с ID ${usedAtm.idAtm} занят клиентом ${
				usedAtm.idClient
			} на ${time / 1000} секунд`
		);
		setTimeout(() => {
			self.switchState(usedAtm);
		}, time);
	}

	deletePersonFromQueue() {
		self.emitter('deletePerson', this.queue[0].idPerson);
		console.log(
			`Удаляю человека из очереди с ID ${this.queue[0].idPerson}`
		);
		this.queue.splice(0, 1);
	}
	switchState(usedAtm) {
		setTimeout(() => {
			if (usedAtm.isFree) {
				usedAtm.isFree = false;
				self.emitter('changeSwitchFalse', usedAtm);
			} else {
				usedAtm.isFree = true;
				self.emitter('changeSwitchTrue', usedAtm);
			}
		}, 1000);
	}

	//YOU MUST REFRACTOR YOUR CODE AND YOU MUST DO ONE GLOBAL CHECKOUT

	checkPersonInQueue() {
		if (this.queue.length) {
			self.emitter('queueHavePersons');
		} else {
			self.emitter('queueHaveNotPersons');
		}
	}
	checkAtmState() {
		this.arrAtm.find(value => {
			if (
				value.isFree &&
				this.queue.length &&
				this.idDeletedPerson === this.queue[0].idPerson
			) {
				console.log(`ID Удаляемой персоны ${this.idDeletedPerson}`);
				console.log(`ID новой персоны ${this.queue[0].idPerson}`);
				console.log(`ATM with ID ${value.idAtm} is free`);
				this.idDeletedPerson++;
				this.useAtm(value);
				return;
			}
		});
	}

	randomizer(max, min = 1) {
		const rand = 1000 * Math.floor(min + Math.random() * (max + 1 - min));
		return rand;
	}
}
//Controller-Listen event from view and transfer them in Model and backward
class Controller extends EventEmmiter {
	constructor(view, model) {
		super();
		this.view = view;
		this.model = model;
		this.numberOfStarts = 0;
		//Old Events
		model.on('personAdded', personId => this.rebuildQueue(personId));
		model.on('deletePerson', personId =>
			this.deletePersonFromQueue(personId)
		);
		//NEW EVENTS
		model.on('changeSwitchTrue', idAtm => this.changeSwitchTrue(idAtm));
		model.on('changeSwitchFalse', idAtm => this.changeSwitchFalse(idAtm));
		model.on('queueHavePersons', () => this.model.checkAtmState());
	}
	startApp() {
		view.createControl();

		let div = document.querySelector('.control');
		div.addEventListener('click', e => {
			if (e.target.classList.contains('btn-Start')) {
				if (this.numberOfStarts === 0) {
					this.model.amountAtm = 2;
					this.model.createSeveralAtm();
					this.view.createSeveralAtm(this.model.arrAtm.length);
					this.model.createQueue();
					this.view.createQueue();
					this.numberOfStarts++;
				} else {
					return console.log('Вы уже нажали старт!');
				}
			} else if (e.target.classList.contains('btn-Debug')) {
				console.log('Ты нажал на клавишу Debug');
				debugger;
			} else if (e.target.classList.contains('btn-AddATM')) {
				this.model.createSingleAtm();
				this.view.createSingleAtm(this.model.idAtm);
			} else if (e.target.classList.contains('btn-DeleteATM')) {
				if (
					this.model.idAtm > 0 &&
					this.model.arrAtm[this.model.arrAtm.length - 1].isFree
				) {
					this.model.deleteSingleAtm();
					this.view.deleteSingleAtm(this.model.arrAtm.length);
				} else {
					console.log(`Ни одного банкомата не установлено!
					или
					Банкомат еще занят!`);
				}
			}
		});
	}
	rebuildQueue(personId) {
		this.view.createPerson(personId);
		this.model.checkPersonInQueue();
	}
	deletePersonFromQueue(personId) {
		this.view.deletePersonFromQueue(personId);
		this.model.checkPersonInQueue();
	}
	changeSwitchTrue(usedAtm) {
		this.view.switchStateAtm(usedAtm);
		this.view.removeClientInAtm(usedAtm);
		this.model.checkPersonInQueue();
	}
	changeSwitchFalse(usedAtm) {
		this.model.deletePersonFromQueue();
		this.view.switchStateAtm(usedAtm);
		this.view.createClientInAtm(usedAtm);
		this.model.checkPersonInQueue();
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
		let debugBtn = this.createBtn('Debug');
		let addAtm = this.createBtn('AddATM');
		let deleteAtm = this.createBtn('DeleteATM');
		div.append(startBtn);
		div.append(debugBtn);
		div.append(addAtm);
		div.append(deleteAtm);
		fragment.append(div);
		this.body.append(fragment);
	}
	createBtn(name) {
		let btn = document.createElement('button');
		btn.className = `btn-${name} btn pure-button`;
		btn.innerHTML = name;
		return btn;
	}

	createSeveralAtm(countAtm) {
		let fragment = document.createDocumentFragment();
		let divScene = this.createNewElement('div', 'atm-scene');
		for (let i = 1; i < countAtm + 1; i++) {
			let div = this.createNewElement('div', `${i}-atm atm`);
			div.id = i;
			divScene.append(div);
		}
		fragment.append(divScene);
		this.body.append(fragment);
	}

	createSingleAtm(idAtm) {
		let divScene = document.querySelector('.atm-scene');
		console.log(divScene);
		let div = this.createNewElement('div', `${idAtm}-atm atm`);
		div.id = idAtm;
		divScene.append(div);
	}
	deleteSingleAtm(idAtm) {
		document.getElementById(idAtm).remove();
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
		if (deletedPerson === null) {
			console.log(`Нету HTML элемента. Очередь пуста!`);
		} else {
			deletedPerson.remove();
		}
	}
	createNewElement(typeOfElement, nameOFClass = `${typeOfElement}`) {
		let newEl = document.createElement(`${typeOfElement}`);
		newEl.className = nameOFClass;
		return newEl;
	}
	switchStateAtm(usedAtm) {
		let busyAtm = document.getElementById(usedAtm.idAtm);
		if (usedAtm.isFree === true) {
			busyAtm.classList.remove('busy');
		} else {
			busyAtm.classList.add('busy');
		}
	}
	createClientInAtm(usedAtm) {
		let fragment = document.createDocumentFragment();
		let busyAtm = document.getElementById(usedAtm.idAtm);
		let div = this.createNewElement(
			'div',
			`idClient-${usedAtm.idClient} client`
		);
		div.innerHTML = usedAtm.idClient;
		fragment.append(div);
		busyAtm.appendChild(fragment);
	}

	//Repair function removeClientInAtm!!!
	removeClientInAtm(usedAtm) {
		let atm = document.getElementById(`${usedAtm.idAtm}`);
		while (atm.firstChild) {
			atm.removeChild(atm.firstChild);
		}
	}
}
const view = new View();
const model = new Model();
const controller = new Controller(view, model);
controller.startApp();
