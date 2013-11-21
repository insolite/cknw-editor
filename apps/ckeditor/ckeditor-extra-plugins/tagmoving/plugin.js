CKEDITOR.plugins.add('tagmoving', {
	requires: 'richcombo',
	//lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn',
	//icons: '',
	collapseSelection: false,
	ignoreTags: [
		'html',
		'body',
		//'thead',
		//'tbody',
		//'br',
	],
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
	tagOptions: {
		'*': [
			{
				label: 'Delete',
				click: function (element) {
					element.remove();
				},
			},
			/*
			{
				label: 'Unwrap',
				click: function (element) {
					//var child = element.getFirst();
					//element.renameNode('i');
					//var parent = element.getParent();
					//parent.setHtml(element.getHtml());
				},
			},
			*/
		],
		'p': [
			{
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
	updateElementsPath: function (editor) {
		var self = this;
		var elementPath = self.getPath(editor.currentElement);
		var bottom = editor.ui.space('bottom');//.find('#elements-path');
		if (bottom.find('#elements-path').count() == 0) {
			bottom.append(new CKEDITOR.dom.element('div').setAttribute('id', 'elements-path'));
		}
		bottom = bottom.find('#elements-path').getItem(0);
		bottom.setHtml('');
		if (editor.currentElement) {
			html = '';
			$.each(elementPath, function (index, element) {
				var tagElement = new CKEDITOR.dom.element('a');
				tagElement.setAttribute('href', '#');
				tagElement.setHtml(element.getName());
				tagElement.on('click', function (e) {
					var elementName = element.getName();
					var options = self.tagOptions['*'];
					if (self.tagOptions[elementName]) {
						options = options.concat(self.tagOptions[elementName]);
					}
					if (options != undefined) {
						var dropdownMenu = new CKEDITOR.dom.element('div');
						dropdownMenu.addClass('tag-element-dd');
						dropdownMenu.on('mouseleave', function (event) {
							this.remove();
						});
						$.each(options, function (index, option) {
							var ddElement = new CKEDITOR.dom.element('p');
							//ddElement.setAttribute('href', '#');
							ddElement.setHtml(option.label);
							ddElement.on('click', function (e) {
								option.click(element);
								editor.focus();
								self.resetCurrentElement(editor);
								this.getParent().remove();
							});
							dropdownMenu.append(ddElement);
						});
						editor.container.append(dropdownMenu);
						var cPos = editor.container.getDocumentPosition();
						var pX = e.data.$.pageX - cPos.x - 16;
						var pY = e.data.$.pageY - cPos.y - dropdownMenu.getSize('height') + 20;
						dropdownMenu.setStyle('left', pX + 'px');
						dropdownMenu.setStyle('top', pY + 'px');
					}
					e.cancel();
				});
				//else unknown tag, or no options for tag
				bottom.append(tagElement);
				bottom.appendHtml('&nbsp;&nbsp;');
			});
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
