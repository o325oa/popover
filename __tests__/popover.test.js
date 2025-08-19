import Popover from '../src/popover';

describe('Popover', () => {
	test('creates and toggles visibility on click', () => {
		document.body.innerHTML = '<button id="btn" data-toggle="popover" data-popover-title="T" data-popover-content="C">Btn</button>';
		const trigger = document.getElementById('btn');
		const pop = new Popover(trigger);

		expect(pop.isVisible).toBe(false);

		trigger.click();
		expect(pop.isVisible).toBe(true);
		expect(pop.popoverElement).toBeTruthy();
		expect(pop.popoverElement.getAttribute('data-hidden')).toBe('false');

		const outside = document.createElement('div');
		document.body.appendChild(outside);
		outside.click();
		expect(pop.isVisible).toBe(false);
		expect(pop.popoverElement.getAttribute('data-hidden')).toBe('true');
	});

	test('positions above and centers horizontally', () => {
		document.body.innerHTML = '<button id="btn" data-toggle="popover" data-popover-title="T" data-popover-content="C">Btn</button>';
		const trigger = document.getElementById('btn');

		trigger.getBoundingClientRect = () => ({
			left: 100,
			top: 200,
			right: 150,
			bottom: 220,
			width: 50,
			height: 20
		});

		const pop = new Popover(trigger, { distance: 8 });
		pop.show();

		pop.popoverElement.getBoundingClientRect = () => ({
			left: 0,
			top: 0,
			right: 200,
			bottom: 100,
			width: 200,
			height: 100
		});

		pop.updatePosition();

		expect(pop.popoverElement.style.left).toBe('25px');
		expect(pop.popoverElement.style.top).toBe('92px'); 
	});
});