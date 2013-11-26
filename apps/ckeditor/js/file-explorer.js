var FileExplorer = {
	ID_PREFIX: 'editor-',
    path: require('path'),
    mime: require('mime'),
    gui: require('nw.gui'),
    fs: require('fs'),
    editorHeightOffset: 64,
    rootDir: undefined,
    publicationDir: undefined,
    currentFilepath: undefined,
    nextId: 1,
    editors: {},
    resources: {},
    PLAN_FILENAME: 'plan.wprj',
    availableModes: [
		'abbr',
		'reslink',
		'preparedlinks',
		'resimage',
		'tagmoving',
		'enumerating',
	],
    getEditorByFilepath: function (filepath) {
    	var textarea = $('#workspace > textarea[filepath="' + filepath + '"]');
		return CKEDITOR.instances[textarea.attr('id')];
    },
    ckinit: function (editorId, filedata) {
    	var self = this;
		CKEDITOR.config.allowedContent = true;
		//CKEDITOR.config.format_tags = 'dl;dt;dd';
		CKEDITOR.config.removePlugins = [
			//'scayt', //works only for english
			//'resize', //is not needed, but disaling this plugin removes bottom panel,
			//which is needed for element path displaying
			'elementspath', //using tagmoving instead
		].join(); //the same as join(',')
		CKEDITOR.config.extraAllowedContent = [
			'dl',
			'dt',
			'dd',
		].join(' ');
		$.extend(CKEDITOR.dtd.$editable, {
			//span: 1,
			dt: 1,
			dl: 1,
			dd: 1,
		});
		var modeNamesString = $('#sidebar-left > ul > li > a.current').parent().attr('modes');
		//TODO: default mode as plugin
		//TODO: common mode
		var loadedModes;
		if (modeNamesString == 'default') {
			loadedModes = self.availableModes;
		} else {
			loadedModes = modeNamesString.split(',');
		}
		CKEDITOR.config.extraPlugins = [
			//'contextwidgets',
			//'maxheight', //is not working correctly
		].concat(loadedModes) // plugins for current mode
		.join(); //the same as join(',')
		CKEDITOR.config.disableNativeSpellChecker = false;
		CKEDITOR.config.contentsCss = [
			'ckeditor/contents.css', //default
			'css/ckeditor-contents.css',
		];
		CKEDITOR.replace(editorId, { 
			on: {
				// maximize the editor's height on startup
				'instanceReady' : function( evt ) {
					var height = $(document).height() - self.editorHeightOffset;
					var menu = evt.editor.container.findOne('#menu');
					if (menu) {
						height -= 28;
					}
					evt.editor.resize("100%", height); //$(editorId).clientHeight
				},
			}
		});
		var editor = CKEDITOR.instances[editorId];
		editor.setData(filedata);
		//$.each(loadedModes, function (key, modeName) {
//			filedata = CKEDITOR.plugins.get(modeName).restore(editor.getData());
		//});
		editor['userdata'] = {};
		editor.userdata['loadedModes'] = loadedModes;
    },
    updateStructure: function (callback) {
    	var self = this;
    	
    	xml = self.readFile(self.PLAN_FILENAME, function (filedata) {
    		xmlDoc = $.parseXML(filedata);
        	xmlNode = $(xmlDoc).find('wymprj');
        	xmlNode.find('group,page').each(function (index, element) {
        		$(this).remove();
        	});
        	$('#sidebar-left li[path=""]').each(function (index, element) {
        		var groupElement = $('<group></group>')
    			.attr({
    				'name': $(this).find('> a.filelabel').text(),
    			});
    			$('#sidebar-left li[parent="' + $(this).find('> a.filelabel').text() + '"]').each(function (index, element) {
    				groupElement.append($('<page/>')
		    			.attr({
		    				'path': $(this).attr('path'),
		    				'name': $(this).find('> a.filelabel').text(),
		    				'modes': $(this).attr('modes'),
		    			})
	    			);
    			});
        		xmlNode.append(groupElement);
        	});
        	$('#sidebar-left li[path!=""][parent="root"]').each(function (index, element) {
				xmlNode.append($('<page/>')
	    			.attr({
	    				'path': $(this).attr('path'),
	    				'name': $(this).find('> a.filelabel').text(),
	    				'modes': $(this).attr('modes') || 'default',
	    			})
    			);
			});
        	var xmlText = (new XMLSerializer()).serializeToString(xmlDoc);
        	//Remove stupid automatic insertions in group, page tags
        	xmlText = xmlText.split('xmlns="http://www.w3.org/1999/xhtml" ').join('');
        	//Remove stupid automatic convertion of <page/> to <page></page>
        	xmlText = xmlText.split('></page>').join('/>');
        	xmlText = xmlText.split('><').join('>\n<');
        	xmlText = xmlText.replace(/\n{2,}/g, '\n');
        	self.writeFile(self.PLAN_FILENAME, xmlText, callback);
        });
    },
    create: function (filepath, name, group, modes, filedata) {
    	var self = this;
    	
    	filepath = filepath || 'unnamed.html';
    	name = name || 'unnamed';
    	group = group || 'root';
    	modes = modes || ['default'];
    	filedata = filedata || '';
    	
        self.writeFile(filepath, filedata, function () {
	    	var fileElement = $('<li></li>')
			.attr({
				'path': filepath,
				'parent': group,
				'modes': modes.join(','),
			})
			.css({
				'margin-left': '0px',
			})
			.click(function (e) {
				$('#sidebar-left > ul > li > a.filelabel').removeClass('current');
				$(this).find('> a.filelabel').addClass('current opened');
				$(this).find('> div.close').show();
				self.open($(this).attr('path'));
				e.preventDefault();
			})
			.append($('<a></a>')
				.attr({
					'href': '#',
				})
				.addClass('filelabel')
				.append($('<i></i>')
					.addClass('icon-file')
				)
				.append(name)
			)
			.append($('<div></div>')
				.addClass('close')
				.html('x')
				.click(function (e) {
					var li = $(this).parent();
					var filepath = li.attr('path');
					li.find('> a.filelabel').removeClass('current opened');
					$(this).hide();
					self.close(filepath);
					e.stopPropagation();
				})
			);
			if (group == 'root') {
				$('#sidebar-left > ul').append(fileElement);
			}
			else {
				fileElement.css('margin-left', '12px');
				$('#sidebar-left > ul > li[parent="' + group + '"]').last().after(fileElement);
			}
			self.updateStructure(function () {
				fileElement.click();
			});
		});
    },
    open: function(filepath) {
        var self = this;
        $('#workspace > div').hide();
        if (filepath in self.editors) {
			self.currentFilepath = filepath;
        	var editor = self.editors[self.currentFilepath];
        	$('#workspace > div#cke_' + editor.attr('id')).show();
			self.getCurrentEditor().focus();
        }
        else {
	        self.readFile(filepath, function (filedata) {
            	var self = FileExplorer;
            	self.currentFilepath = filepath;
            	var editorId = self.ID_PREFIX + self.nextId;
				self.editors[self.currentFilepath] = $('<textarea></textarea>')
				.attr({
					'filepath': self.currentFilepath,
					'id': editorId,
					'name': editorId,
					'cols': '80',
					'rows': '40',
				})
				.appendTo($('#workspace'));
				self.ckinit(editorId, filedata);
				self.getCurrentEditor().focus();
				self.nextId++;
        	});
		}
    },
    save: function (filepath, data) {
        var self = this;
        filepath = filepath || self.path.join(self.rootDir, self.currentFilepath);
        var text = data || self.getCurrentEditor().getData();
        if (filepath) {
            self.fs.writeFile(filepath, text, function (err) {
                if (err) {
                    throw err;
                }
                else {
                	//TODO: success notification
                }
            });
        }
        else {
            alert('TODO: enter filename dialog'); //TODO: enter filename dialog
        }
    },
    close: function (filepath) {
        var self = this;
    	var editorId = self.editors[filepath].attr('id');
    	CKEDITOR.instances[editorId].destroy(); //Remove CKeditor instance
    	self.editors[filepath].remove(); //Remove <textarea> element
    	delete self.editors[filepath]; //Remove element from array
    	if (self.currentFilepath == filepath) {
    		self.currentFilepath = undefined;
    	}
    },
    publish: function (filepath) {
    	var self = this;
    	filepath = filepath || self.currentFilepath;
    	var editor = self.getCurrentEditor();
    	var html = editor.getData();
    	for (var i in editor.userdata['loadedModes']) {
    		modeName = editor.userdata['loadedModes'][i];
    		html = CKEDITOR.plugins.get(modeName).publish(html);
    	}
    	self.readFile('publish-template.html', function (filedata) {
	    	var tpl = new CKEDITOR.template(filedata.split('\n').join(''));
	    	var fullHtml = tpl.output({
	    		csspath: 'plan.css',
	    		title: $('#sidebar-left > ul > li[path="' + filepath + '"] > a')[0].childNodes[1].data,
	    		content: html,
	    	});
	    	self.save(self.path.join(self.publicationDir, filepath), fullHtml);
    	});
    	//TODO: copy resource folders
    	$.each(self.resources, function (name, data) {
    		//self.path.join(self.rootDir, data.path)
    		//self.path.join(self.publicationDir, data.path)
    		//self.fs.createReadStream(data.path).pipe(fs.createWriteStream(data.path));
    	});
    },
    readFile: function (filepath, callback) {
    	var self = this;
    	self.fs.readFile(self.path.join(self.rootDir, filepath), function (err, filedata) {
            if (err) {
                throw err;
            }
            else {
            	callback(filedata.toString());
            }
    	});
    },
    writeFile: function (filepath, filedata, callback) {
    	var self = this;
    	self.fs.writeFile(self.path.join(self.rootDir, filepath), filedata, function (err) {
            if (err) {
                throw err;
            }
            else {
            	callback();
            }
    	});
    },
    readDir: function (dir, subDir) {
    	var self = this;
    	
    	dir = self.path.join(dir, subDir);
    	
    	var files = self.fs.readdirSync(dir);
    	
	    var dirs = [];
	    var nondirs = [];
	    for (var i = 0; i < files.length; ++i) {
	        //var filepath = self.path.join(dir, files[i]);
	        var filepath = self.path.join(dir, files[i]);
	        var fileObj = self.mime.stat(filepath);
	        fileObj['filename'] = files[i];
	        fileObj['dir'] = subDir;
	        if (self.fs.lstatSync(filepath).isDirectory()) {
	        	fileObj['gen-type'] = 'folder';
	        	//fileObj['children'] = self.readDir(filepath);
	            dirs.push(fileObj);
	        }
	        else {
	        	fileObj['gen-type'] = 'file';
	        	fileObj['children'] = undefined;
	            nondirs.push(fileObj);
	        }
	    }
	    return dirs.concat(nondirs);
    },
    getCurrentEditor: function () {
    	var self = this;
    	return CKEDITOR.instances[self.editors[self.currentFilepath].attr('id')];
    },
    initResources: function () {
    	var self = this;
    	
		var element = Xslt.getResult(self.PLAN_FILENAME, "xsl/folders.xsl");
		var infoElement = element.querySelectorAll('ul > li');
		$(infoElement).each(function (e) {
			self.resources[$(this).attr('name')] = {
				'dir': $(this).attr('path'),
				'files': self.readDir(self.rootDir, $(this).attr('path')),
			};
		});
		//In current tmp dir create symlinks to resources in rootDir
		//(provide access to images, documents, etc. while editing, not only after publication)
		//TODO: predefined empty separate directory for links to resources?
		$.each(self.resources, function (name, data) {
			self.fs.symlink(self.path.join(self.rootDir, data.dir),
							self.path.join(process.cwd(), data.dir), 'dir', function () {
        	});
		});
    },
    initSidebar: function () {
        var self = this;
        
		$('#sidebar-left').append(Xslt.getResult(self.PLAN_FILENAME, "xsl/pages.xsl"));
		$('#sidebar-left > ul > li[path!=""]').each(function () {
			//self.files[$(this).attr('path')];
			$(this).click(function (e) {
				$('#sidebar-left > ul > li > a.filelabel').removeClass('current');
				$(this).find('> a.filelabel').addClass('current opened');
				$(this).find('> div.close').show();
				self.open($(this).attr('path'));
				e.preventDefault();
			});
		});
		$('#sidebar-left > ul > li > div.close').click(function (e) {
			var li = $(this).parent();
			var filepath = li.attr('path');
			li.find('> a.filelabel').removeClass('current opened');
			$(this).hide();
			self.close(filepath);
			e.stopPropagation();
		});
    },
    copyFile: function (source, target, cb) {
    	var self = this;
    	
		var cbCalled = false;
	
		var rd = self.fs.createReadStream(source);
		rd.on("error", function(err) {
			done(err);
		});
		var wr = self.fs.createWriteStream(target);
		wr.on("error", function(err) {
			done(err);
		});
		wr.on("close", function(ex) {
			done();
		});
		rd.pipe(wr);
	
		function done(err) {
			if (!cbCalled) {
				cb(err);
				cbCalled = true;
			}
		}
	},
    init: function(rootDir) {
        var self = this;
        
        self.rootDir = rootDir || process.cwd();
        self.publicationDir = self.rootDir + '/output'; //TODO: argv possibility
        
    	//In current tmp dir create symlink to the plan.wprj for xslt conversion
    	//cause Xslt.getResult is getting xml over http
		/*
		self.fs.symlink(self.path.join(self.rootDir, self.PLAN_FILENAME),
						self.path.join(process.cwd(), self.PLAN_FILENAME), 'file', function () {
			self.initResources();
        	self.initSidebar();
        });
        */
    	//Blank page appears when opening symlink from local file system on Windows OS
    	//(probably WebKit bug - "https://bugs.webkit.org/show_bug.cgi?id=124893")
    	//Symlinks under Windows XP are not supported at all
    	//So, simply copying file. Sadly...
    	var srcFilepath = self.path.join(self.rootDir, self.PLAN_FILENAME);
    	var dstFilepath = self.path.join(process.cwd(), self.PLAN_FILENAME);
    	self.copyFile(srcFilepath, dstFilepath, function (e) {
    		self.initResources();
        	self.initSidebar();
    	});
    },
};
