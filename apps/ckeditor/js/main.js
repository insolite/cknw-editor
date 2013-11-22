$(window).ready(function () {
	MainMenu.init();
	FileExplorer.init();
	
	$(window).resize(function () {
		FileExplorer.getCurrentEditor().resize("100%", $(window).height() - FileExplorer.editorHeightOffset);
	});
});
