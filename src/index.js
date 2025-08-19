import './styles.css';
import './popover.css';
import Popover from './popover';

document.addEventListener('DOMContentLoaded', () => {
	const trigger = document.querySelector('[data-toggle="popover"]');
	if (trigger) {
		const title = trigger.getAttribute('data-popover-title') || 'Popover title';
		const content = trigger.getAttribute('data-popover-content') || 'And here’s some amazing content. It’s very engaging. Right?';
		new Popover(trigger, { title, content });
	}
});