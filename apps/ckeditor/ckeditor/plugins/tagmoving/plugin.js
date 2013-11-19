CKEDITOR.plugins.add('tagmoving', {
	//requires: '',
	//lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn',
	//icons: '',
	collapseSelection: false,
	publish: function (html) {
		return html;
		//var element = $('<div>' + html + '</div>');
		//return element.html();
	},
	getLevel: function (element, count) {
		count = count == undefined ? -1 : count;
		if (element) {
			return this.getLevel(element.getParent(), count + 1);
		}
		else {
			return count;
		}
	},
	resetCurrentElement: function (editor) {
		var self = editor; //this;
		editor.currentElement = undefined;
	},
	init: function (editor) {
		var self = this;
		self.resetCurrentElement(editor);
		editor.on('key', function(evt) {
			keyCode = evt.data.keyCode;
			//alert(keyCode);
			var KEYCODE_LEFT = 37,
				KEYCODE_UP = 38,
				KEYCODE_RIGHT = 39,
				KEYCODE_DOWN = 40;
			var KEYCODE_ALEFT = CKEDITOR.ALT + 37,
				KEYCODE_AUP = CKEDITOR.ALT + 38,
				KEYCODE_ARIGHT = CKEDITOR.ALT + 39,
				KEYCODE_ADOWN = CKEDITOR.ALT + 40;
			if (keyCode == KEYCODE_UP || keyCode == KEYCODE_DOWN || keyCode == KEYCODE_LEFT || keyCode == KEYCODE_RIGHT) {
				//If not resetting, Alt selection always continues moving from the last element,
				//even when actual selection totally changed.
				//TODO: reset on click and/or selection event
				self.resetCurrentElement(editor);
			}
			else if (keyCode == KEYCODE_AUP || keyCode == KEYCODE_ADOWN || keyCode == KEYCODE_ALEFT || keyCode == KEYCODE_ARIGHT) {
				var selection = editor.getSelection();
				
				if (!editor.currentElement) {
					newCurrentElement = /*selection.getSelectedElement() || */selection.getStartElement();
					while (!newCurrentElement.getFirst) {
						newCurrentElement = getParent();
					}
					//newCurrentElement = newCurrentElement.getParent();
					if (self.getLevel(newCurrentElement) <= 1) {
						newCurrentElement = undefined;
					}
					editor.currentElement = newCurrentElement;
				}
				
				if (editor.currentElement) {
					var nextElement = undefined;
					if (keyCode == KEYCODE_AUP) {
						nextElement = editor.currentElement.getPrevious();
					}
					else if (keyCode == KEYCODE_ADOWN) {
						nextElement = editor.currentElement.getNext();
					}
					else if (keyCode == KEYCODE_ALEFT) {
						nextElement = editor.currentElement.getParent();
						if (self.getLevel(nextElement) <= 1) { //Prevent moving over body tag
							nextElement = undefined;
						}
					}
					else { //else if (keyCode == KEYCODE_ARIGHT) {
						/*
						nextElement = editor.currentElement.getFirst();
						if (!nextElement.getFirst) { //Prevent moving under leaf
							nextElement = undefined;
						}
						*/
						if (editor.currentElement.getFirst) {
							nextElement = editor.currentElement.getFirst();
							if (nextElement.type != CKEDITOR.NODE_ELEMENT) {
								nextElement = undefined;
							}
						}
						else {
							nextElement = undefined;
						}
					}
					
					if (nextElement) {
						editor.currentElement = nextElement;
						selection.selectElement(editor.currentElement);
						selection = editor.getSelection();
				        
				        ranges = selection.getRanges();
				        
				        if (self.collapseSelection) {
							ranges[0].setStart(editor.currentElement.getFirst(), 0);
							ranges[0].setEnd(editor.currentElement.getFirst(), 0);
							ranges[0].collapse(true);
					    }
				        selection.selectRanges([ranges[0]]);  // putting the current selection there
					}
					//evt.cancel();
				}
			}
		});
	},
});
