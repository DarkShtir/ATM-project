//Model-business logic
class Model {
	constructor(controller) {
		this.controller = controller;
		this.arrAtm = [];
		this.queue = [];
		this.amountPerson = 0;
		this.amountAtm = 0;
		this.idPerson = 0;
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
		let rand = this.randomizer(3, 1);
		return new Person(this.idPerson++, rand);
	}
	createQueue() {
		let rand = this.randomizer(5);
		let num = this.amountPerson;
		let iter = 0;
		let timerID = setTimeout(function create() {
			if (iter < num) {
				iter++;
				this.addPersonInQueue(this.createPerson());
				rand = this.randomizer(5);
				timerID = setTimeout(create, rand);
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
		console.log('Work in progress!');
	}
	createControl() {
		let fragment = document.createDocumentFragment();
		let div = this.createNewElement('div', 'control');
		let startBtn = this.createBtn('Start');
		let finishBtn = this.createBtn('Finish');
		let addAtm = this.createBtn('AddATM');
		div.append(startBtn);
		div.append(finishBtn);
		div.append(addAtm);
		fragment.append(div);
		this.body.append(fragment);
	}
	createBtn(name) {
		let btn = document.createElement('button');
		btn.className = `btn-${name}`;
		btn.innerHTML = name;
		return btn;
	}

	createAtm(arr) {
		let fragment = document.createDocumentFragment();
		arr.forEach(currentVal => {
			let div = document.createElement('div');
			div.className = `${currentVal.idAtm} atm`;
			fragment.append(div);
		});
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
		workWithAtm = rand;
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
