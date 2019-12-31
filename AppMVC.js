//Model-business logic
class Model {
	constructor(controller) {
		this.controller = controller;
		this.arrAtm = [];
		this.queue = [];
		this.amountPerson = 0;
		this.amountAtm = 0;
		this.idPerson = 0;
		// this.createPerson = this.createPerson.bind(this);
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
	addPersonInQueue(person) {
		this.queue.push(person);
	}
	deletePersonFromQueue() {
		this.queue.splice(0, 1);
	}
	createPerson() {
		let rand = this.randomizer(3);
		console.log(this);
		return new Person(++this.idPerson, rand);
	}

	createQueue() {
		let rand = this.randomizer(5);
		let num = this.amountPerson;
		let iter = 0;

		let timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				this.addPersonInQueue(this.createPerson());
				rand = self.randomizer(5);
				timerID = setTimeout(this.create.bind(this), rand);
			} else {
				clearTimeout = timerID;
			}
		}, rand);
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
class Controller {
	constructor(view, model) {
		this.view = view;
		this.model = model;
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
				this.model.createQueue();
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

class Btn {
	constructor(name) {
		this.name = name;
	}

	deleteBtn() {
		console.log('Work in progress!');
	}
}

const view = new View();
view.render();
const model = new Model();
const controller = new Controller(view, model);
controller.startEvent();
