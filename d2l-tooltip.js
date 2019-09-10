/**
`d2l-tooltip`
Polymer-based web component for a D2L tooltip

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { getOffsetParent } from '@brightspace-ui/core/helpers/dom.js';
import { clearDismissible, setDismissible } from '@brightspace-ui/core/helpers/dismissible.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-tooltip">
	<template strip-whitespace="">
		<style>
			:host {
				-moz-user-select: none;
				-ms-user-select: none;
				-webkit-user-select: none;

				@apply --d2l-body-compact-text;

				background-color: var(--d2l-tooltip-background-color, var(--d2l-color-ferrite));
				border: var(--d2l-tooltip-border, 1px solid);
				border-color: var(--d2l-tooltip-border-color, var(--d2l-color-ferrite));
				border-radius: 5px;
				box-sizing: border-box;
				color: #ffffff;
				cursor: default;
				display: none;
				left: 0;
				line-height: 1.4rem;
				outline: none;
				padding: 8px;
				pointer-events: none;
				position: absolute;
				text-align: left;
				top: calc(100% + var(--d2l-tooltip-verticaloffset, 20px));
				user-select: none;
				z-index: 1000; /* position on top of floating buttons */

				@apply --d2l-tooltip-mixin; /* needs to be down here to override any of the properties above */
			}

			:host([showing]), :host([force-show]) {
				display: inline-block;
			}

			:host([force-show]),
			:host([showing]):not([force-show]),
			:host([position="bottom"]) {
				-webkit-animation: d2l-tooltip-bottom-animation 200ms ease;
				animation: d2l-tooltip-bottom-animation 200ms ease;
			}

			:host([position="top"]) {
				-webkit-animation: d2l-tooltip-top-animation 200ms ease;
				animation: d2l-tooltip-top-animation 200ms ease;
			}

			:host([position="left"]) {
				-webkit-animation: d2l-tooltip-left-animation 200ms ease;
				animation: d2l-tooltip-left-animation 200ms ease;
			}

			:host([position="right"]) {
				-webkit-animation: d2l-tooltip-right-animation 200ms ease;
				animation: d2l-tooltip-right-animation 200ms ease;
			}

			:host .d2l-tooltip-triangle {
				clip: rect(-5px, 21px, 8px, -3px);
				display: inline-block;
				left: calc(50% - 8px);
				position: absolute;
				top: -7px;
				z-index: 1;
			}

			:host .d2l-tooltip-triangle > div {
				-webkit-transform: rotate(45deg);

				background-color: var(--d2l-tooltip-background-color, var(--d2l-color-ferrite));
				border: var(--d2l-tooltip-border, 1px solid) var(--d2l-tooltip-border-color, var(--d2l-color-ferrite));
				border-radius: 0.1rem;
				height: 16px;
				transform: rotate(45deg);
				width: 16px;
			}

			:host([position="top"]) .d2l-tooltip-triangle {
				bottom: -8px;
				clip: rect(9px, 21px, 22px, -3px);
				top: auto;
			}

			:host([position="left"]) {
				top: calc(50% + 10px);
			}

			:host([position="left"]) .d2l-tooltip-triangle {
				clip: rect(-3px, 22px, 21px, 8px);
				left: auto;
				right: -8px;
				top: calc(50% - 9px);
			}

			:host([position="right"]) .d2l-tooltip-triangle {
				clip: rect(-3px, 8px, 22px, -4px);
				left: -8px;
				right: auto;
				top: calc(50% - 9px);
			}

			:host-context([dir="rtl"]) {
				left: auto;
				right: 0;
				text-align: right;
			}
			:host(:dir(rtl)) {
				left: auto;
				right: 0;
				text-align: right;
			}

			@keyframes d2l-tooltip-top-animation {
				0% { transform: translate(0,-10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-bottom-animation {
				0% { transform: translate(0,10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-left-animation {
				0% { transform: translate(-10px,0); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-right-animation {
				0% { transform: translate(10px,0); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-tooltip-top-animation {
				0% { -webkit-transform: translate(0,-10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-tooltip-bottom-animation {
				0% { -webkit-transform: translate(0,10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-tooltip-bottom-animation {
				0% { -webkit-transform: translate(0,10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-tooltip-bottom-animation {
				0% { -webkit-transform: translate(0,10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}

		</style>

		<div id="tooltip">
			<div class="d2l-tooltip-triangle">
				<div></div>
			</div>
			<slot></slot>
		</div>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);

Polymer({
	is: 'd2l-tooltip',

	hostAttributes: {
		role: 'tooltip',
		tabindex: -1
	},

	behaviors: [
		IronResizableBehavior
	],

	properties: {
		for: {
			type: String,
			observer: '_findTarget'
		},

		// An object with width, height, top, and left. If the property is present and
		// is not equal to undefined, it will use the customTarget object for positioning.
		customTarget: {
			type: Object,
			observer: 'updatePosition'
		},

		position: {
			type: String,
			value: 'bottom',
			reflectToAttribute: true
		},

		offset: {
			type: Number,
			value: 8
		},

		showing: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		tooltipPadding: {
			type: Number,
			value: 0
		},

		tapToggle: {
			type: Boolean,
			value: false
		},

		boundary: {
			type: Object,
			value: null
		},

		disableFocusLock: {
			type: Boolean,
			value: false
		},

		_tappedOn: {
			type: Boolean,
			value: false
		},

		_focusLock: {
			type: Boolean,
			value: false
		},

		forceShow: {
			type: Boolean,
			value: false,
			reflectToAttribute: true,
			observer: '_updateForceShow'
		},
		tooltipDelay: {
			type: Number,
			value: 0,
			reflectToAttribute: true
		},
		_pendingToolTip: {
			type: Object
		}

	},

	listeners: {
		'iron-resize': '_onIronResize'
	},

	get target() {
		var parentNode = dom(this).parentNode;
		var ownerRoot = dom(this).getOwnerRoot();

		var target;
		if (this.for) {
			target = dom(ownerRoot).querySelector('#' + this.for);
			target = target || (ownerRoot && ownerRoot.host && dom(ownerRoot.host).querySelector('#' + this.for));
		} else if (this.customTarget !== undefined) {
			// Set to undefined because it is not used - target is a DOM node, whereas customTarget is an object
			target = undefined;
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}

		return target;
	},

	attached: function() {
		this._findTarget();
	},

	detached: function() {
		this._removeListeners();
		if (this._dismissibleId) {
			clearDismissible(this._dismissibleId);
			this._dismissibleId = null;
		}
	},

	show: function() {
		if (this.showing) {
			return;
		}
		/* There seems to be an issue in Polymer v2, within Chrome, while using the wc-shadydom=true flag
		   which results in the textContent property not containing the element text. Instead the only
		   place it can be found is on this.innerText. */
		if (dom(this).textContent.trim() === ''
		&& (this.innerText && this.innerText.trim() === '')) {
			var allChildrenEmpty = true;
			var effectiveChildren = dom(this).getEffectiveChildNodes();
			for (var i = 0; i < effectiveChildren.length; i++) {
				if (effectiveChildren[i].textContent.trim() !== ''
				|| (effectiveChildren[i].innerText && effectiveChildren[i].innerText.trim() !== '')) {
					allChildrenEmpty = false;
					break;
				}
			}

			if (allChildrenEmpty) {
				return;
			}
		}
		clearTimeout(this._pendingToolTip);
		this._pendingToolTip = setTimeout( ()=> {
			this.showing = true;
			this.dispatchEvent(new CustomEvent(
				'd2l-tooltip-show', { bubbles: true, composed: true }
			));
			this._dismissibleId = setDismissible(() => {
				this._tappedOn = false;
				this.hide();
			});
			this.updatePosition();
		}, this.tooltipDelay);
	},

	hide: function() {
		clearTimeout(this._pendingToolTip);
		if (this._tappedOn || !this.showing || this._focusLock) {
			return;
		}
		this.showing = false;
		this.dispatchEvent(new CustomEvent(
			'd2l-tooltip-hide', { bubbles: true, composed: true }
		));
		if (this._dismissibleId) {
			clearDismissible(this._dismissibleId);
			this._dismissibleId = null;
		}
		this.unlisten(this.document, 'tap', '_documentClickListener');
	},

	updatePosition: function() {
		const offsetParent = getOffsetParent(this);
		if (!this.customTarget && (!this._target || !offsetParent)) {
			return;
		}

		var targetRect = this.customTarget ? this.customTarget : this._target.getBoundingClientRect();
		var thisRect = this.getBoundingClientRect();
		var parentRect = (this.customTarget || offsetParent.tagName === 'BODY') ?
			{ left: 0, top: 0, right: 0, bottom: 0 } :
			offsetParent.getBoundingClientRect();

		var targetPositions = this._getTargetPositions(targetRect, parentRect);
		var tooltipPositions = this._getTooltipPositions(targetPositions, thisRect, targetRect);

		var boundaryParent = offsetParent ? offsetParent.getBoundingClientRect() : { left: 0, top: 0, right: 0, bottom: 0 };
		var boundaryShifts = this._updateTooltipPositionsForBoundary(tooltipPositions, boundaryParent);

		this._setTooltipStyle(tooltipPositions, targetPositions);
		this._setTriangleStyle(thisRect, tooltipPositions, targetPositions, boundaryShifts);
	},

	_onFocus: function() {
		if (!this.disableFocusLock) {
			this._focusLock = true;
		}
		this.show();
	},

	_onBlur: function() {
		this._focusLock = false;
		this.hide();
	},

	_updateForceShow: function(forceShow) {
		if (forceShow) {
			this.async(function() { this.updatePosition(); }.bind(this));
		} else {
			this.hide();
		}
	},

	_getScrollVals: function() {
		const offsetParent = getOffsetParent(this);
		if (offsetParent) {
			var parentStyle = window.getComputedStyle(offsetParent);
			return (parentStyle && parentStyle.getPropertyValue('position') === 'static') ?
				{ xScroll: window.pageXOffset, yScroll: window.pageYOffset } :
				{ xScroll: 0, yScroll: 0 };
		} else {
			return { xScroll: 0, yScroll: 0 };
		}

	},

	_getOffsets: function(targetRect, thisRect) {
		return {
			horizontalCenterOffset: (targetRect.width - thisRect.width) / 2,
			verticalCenterOffset: (targetRect.height - thisRect.height) / 2
		};
	},

	_getTargetPositions: function(targetRect, parentRect) {
		var left = targetRect.left - parentRect.left;
		var right = Math.abs(parentRect.right - targetRect.right);
		return {
			left: left,
			right: right,
			horizontalCenter: (right - left) / 2,
			top: targetRect.top - parentRect.top
		};
	},

	get boundaryWidth() {
		return this.boundary.right - this.boundary.left;
	},

	_getTooltipPositions: function(targetPositions, thisRect, targetRect) {
		var offsets = this._getOffsets(targetRect, thisRect);
		var scrollVals = this._getScrollVals();

		var tooltipLeft, tooltipTop, tooltipRight;
		switch (this.position) {
			case 'top':
				tooltipLeft = targetPositions.left + offsets.horizontalCenterOffset;
				tooltipRight = targetPositions.right + offsets.horizontalCenterOffset;
				tooltipTop = targetPositions.top - thisRect.height - this.offset;
				break;
			case 'bottom':
				tooltipLeft = targetPositions.left + offsets.horizontalCenterOffset;
				tooltipRight = targetPositions.right + offsets.horizontalCenterOffset;
				tooltipTop = targetPositions.top + targetRect.height + this.offset;
				break;
			case 'left':
				tooltipLeft = targetPositions.left - thisRect.width - this.offset;
				tooltipTop = targetPositions.top + offsets.verticalCenterOffset;
				break;
			case 'right':
				tooltipLeft = targetPositions.left + targetRect.width + this.offset;
				tooltipTop = targetPositions.top + offsets.verticalCenterOffset;
				break;
		}

		tooltipLeft += scrollVals.xScroll;
		tooltipTop += scrollVals.yScroll;

		return {
			top: tooltipTop,
			left: tooltipLeft,
			right: tooltipRight
		};
	},

	_useBoundaries: function() {
		// Boundaries currently only supported with top/bottom positions
		return this.boundary && (this.position === 'top' || this.position === 'bottom');
	},

	_updateTooltipPositionsForBoundary: function(tooltipPositions, parentRect) {
		if (!this._useBoundaries()) {
			return;
		}

		var prevLeft = tooltipPositions.left;
		var prevRight = tooltipPositions.right;
		tooltipPositions.left = Math.max(this.boundary.left, tooltipPositions.left);
		tooltipPositions.right = Math.max(parentRect.width - this.boundary.right, tooltipPositions.right);

		return {
			leftShift: tooltipPositions.left - prevLeft,
			rightShift: tooltipPositions.right - prevRight
		};
	},

	_shouldPositionUsingLeft: function(targetPositions) {
		return !this._useBoundaries() || targetPositions.horizontalCenter > this.boundaryWidth / 4;
	},

	_setTooltipStyle: function(tooltipPositions, targetPositions) {
		if (this._shouldPositionUsingLeft(targetPositions)) {
			this.style.left = tooltipPositions.left + 'px';
			this.style.right = 'auto';
		} else {
			this.style.left = 'auto';
			this.style.right = tooltipPositions.right  + 'px';
		}

		this.style.top = tooltipPositions.top + 'px';

		if (this.boundary) {
			this.style.maxWidth = this.boundaryWidth + 'px';
		}

		if (this.tooltipPadding) {
			this.$.tooltip.style.padding = this.tooltipPadding + 'px';
		}
	},

	_setTriangleStyle: function(thisRect, tooltipPositions, targetPositions, boundaryShifts) {
		if (!this._useBoundaries()) {
			return;
		}

		var tooltipTriangle = this.$$('.d2l-tooltip-triangle');

		if (this._shouldPositionUsingLeft(targetPositions)) {
			var triangleLeft = this._calculateTriangleShift(thisRect, boundaryShifts.leftShift);
			tooltipTriangle.style.left = triangleLeft + 'px';
			tooltipTriangle.style.right = 'auto';
		} else {
			var triangleRight = this._calculateTriangleShift(thisRect, boundaryShifts.rightShift);
			tooltipTriangle.style.left = 'auto';
			tooltipTriangle.style.right = triangleRight + 'px';
		}
	},

	_calculateTriangleShift: function(thisRect, shiftVal) {
		return Math.max((thisRect.width / 2) - shiftVal - 8, 8);
	},

	get document() {
		if (this.ownerDocument.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			return this.ownerDocument.host;
		}
		return this.ownerDocument;
	},

	_addListeners: function() {
		if (this._target && !this.forceShow) {
			this.listen(this._target, 'mouseenter', 'show');
			this.listen(this._target, 'focus', '_onFocus');
			this.listen(this._target, 'mouseleave', 'hide');
			this.listen(this._target, 'blur', '_onBlur');
			this.listen(this._target, 'tap', '_toggle');
		}
	},

	_toggle: function() {
		if (!this.tapToggle) {
			this.hide();
			return;
		}
		this._tappedOn = !this._tappedOn;
		if (!this._tappedOn) {
			this.hide();
		} else {
			setTimeout(function() { this.listen(this.document, 'tap', '_documentClickListener'); }.bind(this), 0);
			this.show();
		}
	},

	_documentClickListener: function(e) {
		if (e.target.id !== this._target.id) {
			this._tappedOn = false;
			this.hide();
		}
	},

	_findTarget: function() {
		this._removeListeners();
		this._target = this.target;
		if (this._target) {
			this.id = this.id || getUniqueId();
			this._target.setAttribute('aria-live', 'polite');
			this._target.setAttribute('aria-describedby', this.id);
			if (this.tapToggle) {
				this._target.style.cursor = 'pointer';
			}
		}
		this._addListeners();
	},

	_removeListeners: function() {
		if (this._target) {
			this.unlisten(this._target, 'mouseenter', 'show');
			this.unlisten(this._target, 'focus', '_onFocus');
			this.unlisten(this._target, 'mouseleave', 'hide');
			this.unlisten(this._target, 'blur', '_onBlur');
			this.unlisten(this._target, 'tap', '_toggle');
		}
	},

	_onIronResize: function() {
		this.updatePosition();
	}

});
