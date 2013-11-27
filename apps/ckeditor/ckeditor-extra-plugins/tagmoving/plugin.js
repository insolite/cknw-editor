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
	tagOptions: {
		'*': [
			{
				type: 'element',
				label: 'Delete',
				click: function (element) {
					element.remove();
				},
			},
		],
		'p': [
			{
				type: 'element',
				label: 'Make bold',
				click: function (element) {
					var html = element.getHtml();
					element.setHtml('');
					var sumElement = new CKEDITOR.dom.element('strong');
					sumElement.setHtml(html);
					element.append(sumElement);
				},
			},
		],
		'a': [
			{
				type: 'element',
				label: 'Make italic',
				click: function (element) {
					var html = element.getHtml();
					element.setHtml('');
					var sumElement = new CKEDITOR.dom.element('i');
					sumElement.setHtml(html);
					element.append(sumElement);
				},
			},
		],
	},
	ignoreTags: [
		'html',
		'body',
		//'thead',
		//'tbody',
		//'br',
	],
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
		var self = this;
		editor.currentElement = undefined;
		var selection = editor.getSelection();
		if (selection) {
			newCurrentElement = /*selection.getSelectedElement() || */selection.getStartElement();
			if (newCurrentElement) {
				while (!newCurrentElement.getFirst) {
					newCurrentElement = getParent();
				}
				//newCurrentElement = newCurrentElement.getParent();
				if (self.getLevel(newCurrentElement) <= 1) {
					newCurrentElement = undefined;
				}
				editor.currentElement = newCurrentElement;
				self.updateElementsPath(editor);
			}
		}
	},
	getPath: function (element) {
		var self = this;
		if (element) {
			//return this.getPath(element.getParent()).push(element.getName()); //not working o_0
			var list = this.getPath(element.getParent());
			if (element.isVisible() && self.ignoreTags.indexOf(element.getName()) < 0) {
				list.push(element);
			}
			return list;
		}
		else {
			return [];
		}
	},
	getNextElement: function (keyCode, element) {
		var self = this;
		var KEYCODE_ALEFT = CKEDITOR.ALT + 37,
			KEYCODE_AUP = CKEDITOR.ALT + 38,
			KEYCODE_ARIGHT = CKEDITOR.ALT + 39,
			KEYCODE_ADOWN = CKEDITOR.ALT + 40;
		var nextElement = element;
		do {
			if (keyCode == KEYCODE_AUP) {
				nextElement = nextElement.getPrevious();
			}
			else if (keyCode == KEYCODE_ADOWN) {
				nextElement = nextElement.getNext();
			}
			else if (keyCode == KEYCODE_ALEFT) {
				nextElement = nextElement.getParent();
			}
			else { //else if (keyCode == KEYCODE_ARIGHT) {
				if (nextElement.getFirst) {
					nextElement = nextElement.getFirst();
				}
				else {
					nextElement = undefined;
				}
			}
		} while (nextElement && (nextElement.type != CKEDITOR.NODE_ELEMENT || self.ignoreTags.indexOf(nextElement.getName()) >= 0));
		//console.log(nextElement);
		return nextElement;
	},
	getDropdownElements: function (elementsInfo, selectedElement, editor) {
		var self = this;
		var elements = [];
		$.each(elementsInfo, function (index, elementInfo) {
			var element = new CKEDITOR.dom.element('li');
			var p = new CKEDITOR.dom.element('p');
			p.setHtml(elementInfo.label);
			if (elementInfo.type == 'element') {
				p.on('click', function (e) {
					elementInfo.click(selectedElement);
					editor.focus();
					self.resetCurrentElement(editor);
				});
			}
			element.append(p);
			elements.push(element);
			if (elementInfo.type == 'container') {
				var ul = new CKEDITOR.dom.element('ul');
				element.append(ul);
				ul.addClass('drop');
				var subElements = self.getDropdownElements(elementInfo.children, selectedElement, editor);
				$.each(subElements, function (index, subElement) {
					ul.append(subElement);
				});
			}
		});
		return elements;
	},
	getElementPathMenu: function (htmlElement, editor) {
		var self = this;
		var menu = new CKEDITOR.dom.element('ul');
		menu.setAttribute('id', 'menu');
		var elementPath = self.getPath(htmlElement);
		$.each(elementPath, function (index, element) {
			var wrappedOptions = [];
			var elementName = element.getName();
			var options = self.tagOptions['*'];
			if (self.tagOptions[elementName]) {
				options = options.concat(self.tagOptions[elementName]);
			}
			if (options) {
				wrappedOptions.push({
					type: 'container',
					label: elementName,
					children: options,
				});
				var menuElements = self.getDropdownElements(wrappedOptions, element, editor);
				$.each(menuElements, function (index, menuElement) {
					menu.append(menuElement);
				});
				var elements = menu.find('li');
				for (var i = 0; i < elements.count(); i++) { //So boring...
					li = elements.getItem(i);
					li.on('mouseenter', function (e) {
						var subMenu = this.findOne('> ul');
						if (subMenu){
							//subMenu.show(); //is not working o_0
							subMenu.setStyle('display', 'block');
						}
					});
					li.on('mouseleave', function (e) {
						var subMenu = this.findOne('> ul');
						if (subMenu){
							//subMenu.hide(); //is not working o_0
							subMenu.setStyle('display', 'none');
						}
					});
				}
			}
		});
		return menu;
	},
	updateElementsPath: function (editor) {
		var self = this;
		/*
		var bottom = editor.ui.space('bottom');//.find('#elements-path');
		if (bottom.find('#elements-path').count() == 0) {
			bottom.append(new CKEDITOR.dom.element('div').setAttribute('id', 'elements-path'));
		}
		bottom = bottom.findOne('#elements-path');
		bottom.setHtml('');
		*/
		var oldMenu = editor.container.findOne('#menu');
		if (oldMenu) {
			oldMenu.remove();
		}
		if (editor.currentElement) {
			var menu = self.getElementPathMenu(editor.currentElement, editor);
			//bottom.append(menu);
			editor.container.append(menu);
		}
	},
	
	init: function (editor) {
		var self = this;
		self.resetCurrentElement(editor);
		
		editor.on('contentDom', function() {
			this.document.on('click', function( evt ) {
				self.resetCurrentElement(editor);
			});
			this.document.on('keyup', function( evt ) {
				keyCode = evt.data.getKeystroke();
				//console.log(keyCode);
				var KEYCODE_LEFT = 37,
					KEYCODE_UP = 38,
					KEYCODE_RIGHT = 39,
					KEYCODE_DOWN = 40;
				var KEYCODE_ALEFT = CKEDITOR.ALT + 37,
					KEYCODE_AUP = CKEDITOR.ALT + 38,
					KEYCODE_ARIGHT = CKEDITOR.ALT + 39,
					KEYCODE_ADOWN = CKEDITOR.ALT + 40;
				if (keyCode == KEYCODE_UP || keyCode == KEYCODE_DOWN || keyCode == KEYCODE_LEFT || keyCode == KEYCODE_RIGHT) {
					self.resetCurrentElement(editor); //TODO: show current element, not previous (move cursor before reset?)
				}
				else if (keyCode == KEYCODE_AUP || keyCode == KEYCODE_ADOWN || keyCode == KEYCODE_ALEFT || keyCode == KEYCODE_ARIGHT) {
					if (!editor.currentElement) {
						self.resetCurrentElement(editor);
					}
					if (editor.currentElement) {
						nextElement = self.getNextElement(keyCode, editor.currentElement);
						
						if (nextElement) {
							var selection = editor.getSelection();
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
							//evt.cancel();
						}
						self.updateElementsPath(editor);
					}
				}
			});
		});
		
		editor.addCommand( 'resimageDialog', new CKEDITOR.dialogCommand( 'resimageDialog' ));
		editor.ui.addButton( 'ResImage', {
			label: 'Insert Image',
			command: 'resimageDialog',
			icon: CKEDITOR.plugins.get('resimage').path + 'icons/resimage.png',
		});
		
		//editor.on('key', function(evt) {
		//});
	},
});
