var Xslt = {
	loadXMLDoc: function(dname) {
		if (window.ActiveXObject) {
			xhttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
		}
		else {
			xhttp = new XMLHttpRequest();
		}
		xhttp.open("GET", dname, false);
		xhttp.send("");
		return xhttp.responseXML;
	},

	getResult: function(xmlUrl, xslUrl) {
		xml = this.loadXMLDoc(xmlUrl);
		xsl = this.loadXMLDoc(xslUrl);
		// code for IE
		if (window.ActiveXObject) {
			return xml.transformNode(xsl);
		}
		// code for Mozilla, Firefox, Opera, etc.
		else if (document.implementation && document.implementation.createDocument) {
			xsltProcessor = new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			return xsltProcessor.transformToFragment(xml, document);
		}
	},
};
