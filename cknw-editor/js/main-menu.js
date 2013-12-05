var MainMenu = {
	elements: {
	    'file': {
	        'new': {
	            'tooltip': 'Create new file',
	            'icon': 'document',
	            onclick: function (event) {
	            	$('#file-create-dialog').dialog("open");
	            }
	        },
	        'save': {
	            'tooltip': 'Save file',
	            'icon': 'disk',
	            onclick: function (event) {
	            	if (FileExplorer.currentFilepath) {
	                	FileExplorer.save();
	                }
	                else {
	                	alert('Open file first');
	                }
	            }
	        },
	        'export': {
	            'tooltip': 'Publish document',
	            'icon': 'note',
	            onclick: function (event) {
	            	if (FileExplorer.currentFilepath) {
	                	FileExplorer.publish();
	                }
	                else {
	                	alert('Open file first');
	                }
	            }
	        },
	    },
	},
	update: function () {
		var self = this;
	    $.each(self.elements, function (j, section) {
	        $.each(section, function (i, element) {
	        	var button = $('<button></button>')
	        	.attr({
	                'title': element['tooltip']
	            })
	        	.button({
			    	icons: {
			    		primary: "ui-icon-" + element['icon'],
			    	},
			    	text: false
			    })
			    .click(function (event) {
	                element.onclick(event);
	            });
	            $('#main-menu').append(button);
	        });
	        $('#main-menu').append($('<div></div>')
	            .addClass('split')
	        );
	    });
	},
	init: function () {
		var self = this;
		self.update();
	},
};
