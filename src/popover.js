export default class Popover {
	constructor(triggerElement, options = {}) {
		if (!triggerElement) {
			throw new Error('Popover requires a trigger element');
		}

		const { title, content, distance = 8 } = options;

		this.triggerElement = triggerElement;
		this.title = title ?? triggerElement.getAttribute('data-popover-title') ?? '';
		this.content = content ?? triggerElement.getAttribute('data-popover-content') ?? '';
		this.distance = distance;

		this.popoverElement = null;
		this.isVisible = false;

		this.handleTriggerClick = this.handleTriggerClick.bind(this);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleWindowUpdate = this.handleWindowUpdate.bind(this);

		this.triggerElement.addEventListener('click', this.handleTriggerClick);
	}

	createPopoverIfNeeded() {
		if (this.popoverElement) return;

		const popover = document.createElement('div');
		popover.className = 'popover';
		popover.setAttribute('role', 'tooltip');
		popover.setAttribute('data-hidden', 'true');

		const arrow = document.createElement('div');
		arrow.className = 'arrow';

		const titleEl = document.createElement('div');
		titleEl.className = 'popover-title';
		titleEl.textContent = this.title;

		const contentEl = document.createElement('div');
		contentEl.className = 'popover-content';
		contentEl.textContent = this.content;

		popover.appendChild(titleEl);
		popover.appendChild(contentEl);
		popover.appendChild(arrow);

		document.body.appendChild(popover);
		this.popoverElement = popover;
	}

	show() {
		this.createPopoverIfNeeded();
		if (!this.popoverElement) return;
		this.popoverElement.setAttribute('data-hidden', 'false');
		this.isVisible = true;
		this.updatePosition();
		document.addEventListener('click', this.handleDocumentClick, { capture: true });
		window.addEventListener('scroll', this.handleWindowUpdate, true);
		window.addEventListener('resize', this.handleWindowUpdate);
	}

	hide() {
		if (!this.popoverElement) return;
		this.popoverElement.setAttribute('data-hidden', 'true');
		this.isVisible = false;
		document.removeEventListener('click', this.handleDocumentClick, { capture: true });
		window.removeEventListener('scroll', this.handleWindowUpdate, true);
		window.removeEventListener('resize', this.handleWindowUpdate);
	}

	toggle() {
		if (this.isVisible) this.hide(); else this.show();
	}

	updatePosition() {
		if (!this.popoverElement) return;
		const triggerRect = this.triggerElement.getBoundingClientRect();
		const popRect = this.popoverElement.getBoundingClientRect();
		const scrollX = window.scrollX || window.pageXOffset || 0;
		const scrollY = window.scrollY || window.pageYOffset || 0;

		const left = Math.round(triggerRect.left + scrollX + (triggerRect.width / 2) - (popRect.width / 2));
		const top = Math.round(triggerRect.top + scrollY - popRect.height - this.distance);

		this.popoverElement.style.left = `${left}px`;
		this.popoverElement.style.top = `${top}px`;
	}

	handleTriggerClick(event) {
		event.preventDefault();
		event.stopPropagation();
		this.toggle();
	}

	handleDocumentClick(event) {
		const target = event.target;
		if (!this.popoverElement) return;
		if (target === this.triggerElement) return;
		if (this.popoverElement.contains(target)) return;
		this.hide();
	}

	handleWindowUpdate() {
		if (this.isVisible) {
			this.updatePosition();
		}
	}

	destroy() {
		this.hide();
		this.triggerElement.removeEventListener('click', this.handleTriggerClick);
		if (this.popoverElement && this.popoverElement.parentNode) {
			this.popoverElement.parentNode.removeChild(this.popoverElement);
		}
		this.popoverElement = null;
	}
}