var FileExplorer = {
	ID_PREFIX: 'editor-',
    path: require('path'),
    mime: require('mime'),
    gui: require('nw.gui'),
    fs: require('fs'),
    editorHeightOffset: 50,
    rootDir: undefined,
    publicationDir: undefined,
    currentFilepath: undefined,
    nextId: 1,
    editors: {},
    resources: {},
    PLAN_FILENAME: 'plan.wprj',
    getEditorByFilepath: function (filepath) {
    	var textarea = $('#workspace > textarea[filepath="' + filepath + '"]');
		return CKEDITOR.instances[textarea.attr('id')];
    },
    ckinit: function (editorId, filedata) {
    	var self = this;
		//CKEDITOR.config.allowedContent = true;
		//CKEDITOR.config.format_tags = 'dl;dt;dd';
		CKEDITOR.config.removePlugins = [
			//'font',
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
		var modeNames = $('#sidebar-left > ul > li > a.current').parent().attr('modes');
		//TODO: default mode as plugin
		//TODO: common mode
		var loadedModes = [
			'abbr',
			'reslink',
			'preparedlinks',
			'resimage',
			'tagmoving',
		];
		//modeNames = modeNames == '' ? ['default'] : modeNames.split(',');
		modeNames = (modeNames == '' || modeNames == 'default') ? loadedModes : modeNames.split(',');
		CKEDITOR.config.extraPlugins = [
			//'contextwidgets',
		].join() //the same as join(',')
		.concat(modeNames); // plugins for current mode
		CKEDITOR.replace(editorId, { 
			on: {
				// maximize the editor's height on startup
				'instanceReady' : function( evt ) {
					evt.editor.resize("100%", $(document).height() - self.editorHeightOffset); //$(editorId).clientHeight
				}
			}
		});
		var editor = CKEDITOR.instances[editorId];
		editor.setData(filedata);
		editor['userdata'] = {};
		editor.userdata['loadedModes'] = loadedModes;
    },
    create: function (filepath, filedata) {
        var self = this;
        self.currentFilepath = filepath;
        CKEDITOR.instances.editor.setData(filedata);
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
        filepath = filepath || (self.rootDir + '/' + self.currentFilepath);
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
	    	self.save(self.publicationDir + '/' + filepath, fullHtml);
    	});
    	//TODO: copy resource folders
    	$.each(self.resources, function (name, data) {
    		//self.rootDir + '/' + data.path
    		//self.publicationDir + '/' + data.path
    		//self.fs.createReadStream(data.path).pipe(fs.createWriteStream(data.path));
    	});
    },
    readFile: function (filepath, callback) {
    	var self = this;
    	self.fs.readFile(self.rootDir + '/' + filepath, function (err, filedata) {
            if (err) {
                throw err;
            }
            else {
            	callback(filedata.toString());
            }
    	});
    },
    readDir: function (dir) {
    	var self = this;
    	
    	var files = self.fs.readdirSync(dir);
    	
	    var dirs = [];
	    var nondirs = [];
	    for (var i = 0; i < files.length; ++i) {
	        //var filepath = self.path.join(dir, files[i]);
	        var filepath = dir + '/' + files[i];
	        var fileObj = self.mime.stat(filepath);
	        fileObj['rel-path'] = files[i];
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
				'files': self.readDir(self.rootDir + '/' + $(this).attr('path')),
			};
		});
		//In current tmp dir create symlinks to resources in rootDir
		//(provide access to images, documents, etc. while editing, not only after publication)
		//TODO: predefined empty separate directory for links to resources?
		$.each(self.resources, function (name, data) {
			self.fs.symlink(self.rootDir + '/' + data.dir,
							process.cwd() + '/' + data.dir, 'dir', function () {
        	});
		});
    },
    initSidebar: function () {
        var self = this;
		$('#sidebar-left').append(Xslt.getResult(self.PLAN_FILENAME, "xsl/pages.xsl"));
		$('#sidebar-left > ul > li[path!=""]').click(function (e) {
			$('#sidebar-left > ul > li > a.filelabel').removeClass('current');
			$(this).find('> a.filelabel').addClass('current opened');
			$(this).find('> div.close').show();
			self.open($(this).attr('path'));
			e.preventDefault();
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
    init: function() {
        var self = this;
        
        self.rootDir = self.gui.App.argv[0];
        self.publicationDir = self.rootDir + '/output'; //TODO: argv possibility
        
    	//In current tmp dir create symlink to the plan.wprj for xslt conversion
    	//cause Xslt.getResult is getting xml over http
		self.fs.symlink(self.rootDir + '/' + self.PLAN_FILENAME,
						process.cwd() + '/' + self.PLAN_FILENAME, 'file', function () {
        });
        
        self.initResources();
        self.initSidebar();
    },
};
