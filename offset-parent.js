// Custom implementation of HTMLElement.offsetParent, specifically for d2l-tooltip, to detect shadow ancestors in Firefox
// Implementation of draft proposal: https://drafts.csswg.org/cssom-view/#dom-htmlelement-offsetparent
// Original implementation: https://www.w3.org/TR/cssom-view/#dom-htmlelement-offsetparent
const getOffsetParent = function(ele) {
	// Fallback to built-in
	if (!window.ShadowRoot) {
		return ele.offsetParent;
	}

	if (
		!getParent(ele) ||
		ele.tagName === 'BODY' ||
		window.getComputedStyle(ele).position === 'fixed'
	) {
		return null;
	}

	let currentEle = getParent(ele);
	while (currentEle) {
		const position = window.getComputedStyle(currentEle).position;
		const tagName = currentEle.tagName;

		if (
			position !== 'static' ||
			tagName === 'BODY' ||
			position === 'static' && (tagName === 'TD' || tagName === 'TH' || tagName === 'TABLE')
		) {
			return currentEle;
		}
		currentEle = getParent(currentEle);
	}

	return null;
};

const getParent = function(ele) {
	// Check if slotted
	if (ele.assignedSlot) {
		return ele.assignedSlot.parentElement;
	}

	// Check if at top of shadow dom
	if (!ele.parentElement && ele.parentNode instanceof ShadowRoot) {
		return ele.parentNode.host;
	}

	return ele.parentElement;
};

export { getOffsetParent };
