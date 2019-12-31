//Model-business logic
class Model {
	constructor(controller) {
		this.controller = controller;
		this.arrAtm = [];
		this.queue = [];
		this.amountPerson = 0;
		this.amountAtm = 0;
	}
	createAtm() {
		return new Atm(this.amountAtm + 1);
		console.log('Work in progress!');
	}
	pushAtmInArr(atm) {
		this.arrAtm.push(atm);
	}
	removeAtmFromArr() {
		this.arrAtm.splice(this.arrAtm.length - 1, 1);
	}
	addPersonInQueue(person) {
		this.queue.push(person);
		console.log('Work in progress!');
	}
	deletePersonFromQueue() {
		this.queue.splice(0, 1);
		console.log('Work in progress!');
	}
	createPerson() {
		return new Person(this.amountPerson++);
		console.log('Work in progress!');
	}
	useAtm(idAtm) {
		let time = this.queue[0].workWithAtm;
		let numAtm = this.arrAtm[idAtm];
		numAtm.switchState();
		console.log(`Atm ${numAtm} is busy`);
		setTimeout(() => {
			numAtm.switchState();
		}, time);
		console.log('Work in progress!');
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
	constructor(idPerson) {
		this.idPerson = idPerson;
		workWithAtm = randomize(3, 1);
	}
}

class Btn {
	constructor(name) {
		this.name = name;
	}
	createBtn() {
		let btn = document.createElement('button');
		btn.className(`btn-${this.name}`);
		btn.innerHTML(this.name);
		return btn;
	}
	deleteBtn() {
		console.log('Work in progress!');
	}
}
