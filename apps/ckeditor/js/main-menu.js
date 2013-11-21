var MainMenu = {
	elements: {
	    'file': {/*
	        'new': {
	            'tooltip': 'Create new file',
	            'icon': 'file',
	            onclick: function (event) {
	                FileExplorer.create(undefined, '');
	            }
	        },*/
	        'save': {
	            'tooltip': 'Save file',
	            'icon': 'hdd',
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
	            'icon': 'eye-open',
	            onclick: function (event) {
	            	FileExplorer.publish();
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
	            .addClass('btn')
	            .append($('<i></i>')
	                .addClass('icon-' + element['icon'])
	            )
	            .click(function (event) {
	                $(this).blur(); //Firefox workarond (focus is not lost after alert, so tooltip is showing until we click anywhere)
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
