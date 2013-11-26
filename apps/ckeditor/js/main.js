$(window).ready(function () {
	MainMenu.init();
	FileExplorer.init(location.hash.slice(1));
	
	$(window).resize(function () {
		//editor.maximizeHeightNow(); //is not working correctly
		var height = $(window).height() - FileExplorer.editorHeightOffset;
		var editor = FileExplorer.getCurrentEditor();
		if (editor) {
			var menu = editor.container.findOne('#menu');
			if (menu) {
				height -= 28;
			}
			FileExplorer.getCurrentEditor().resize("100%", height);
		}
	});
	
	$('#file-create-dialog').dialog({
		modal: true,
		autoOpen: false,
		title: 'File preferences',
		buttons: {
			"Cancel": function() {
				$(this).dialog("close");
			},
			"OK": function() {
				var filepath = $(this).find('form > [name="filepath"]').val();
				//TODO: check if file exists
				var filename = $(this).find('form > [name="filename"]').val();
				var group = $(this).find('form > [name="group"]').val();
				group = group == '' ? 'root' : group;
				var modes = [];
				if ($(this).find('form [name="mode-default"]')[0].checked) {
					modes.push('default');
				}
				else {
					$(this).find('form [name="mode[]"]').each(function (index, element) {
						if (this.checked) {
							modes.push($(this).val());
						}
					});
				}
				console.log(modes);
				FileExplorer.create(filepath, filename, group, modes, '');
				$(this).dialog("close");
			},
		},
		open: function () {
			$(this).html('');
			var form = $('<form></form>');
			
			form.append($('<label></label>')
				.attr({
					'for': 'filepath',
				})
				.html('File path')
			);
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'filepath',
				})
			);
			
			form.append($('<label></label>')
				.attr({
					'for': 'filename',
				})
				.html('File name')
			);
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'filename',
				})
			);
			
			form.append($('<label></label>')
				.attr({
					'for': 'group',
				})
				.html('Group')
			);
			var groupSelectElement = $('<select></select>')
			.attr({
				'name': 'group',
			});
			groupSelectElement.append($('<option></option>')
				.attr({
					'value': 'root',
				})
				.html('None')
			);
			$('#sidebar-left > ul > li[path=""] > a.filelabel').each(function (index, element) {
				groupSelectElement.append($('<option></option>')
					.attr({
						'value': $(this).text(),
					})
					.html($(this).text())
				);
			});
			form.append(groupSelectElement);
			
			form.append($('<label></label>')
				.attr({
					'for': 'mode-default',
				})
				.html('Modes')
			);
			form.append($('<label></label>')
				.append($('<input/>')
					.attr({
						'type': 'checkbox',
						'name': 'mode-default',
						'checked': 'checked',
					})
					.click(function (e) {
						var check = this.checked;
						$(this).parent().parent().find('input[type="checkbox"][name="mode[]"]').each(function (index, element) {
							this.checked = check;
						});
					})
				)
				.append('default')
			);
			$.each(FileExplorer.availableModes, function (index, mode) {
				form.append($('<label></label>')
					.append($('<input/>')
						.attr({
							'type': 'checkbox',
							'name': 'mode[]',
							'checked': 'checked',
						})
						.val(mode)
						.click(function (e) {
							if (!this.checked) {
								$(this).parent().parent().find('input[type="checkbox"][name="mode-default"]').each(function (index, element) {
									this.checked = false;
								});
							}
						})
					)
					.append(mode)
				);
			});
			
			$(this).append(form);
		}
	});
});
