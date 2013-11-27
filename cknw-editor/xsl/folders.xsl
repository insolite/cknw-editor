<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/wymprj">
	<ul>
	<xsl:for-each select="./folder">
		<li>
			<xsl:attribute name="path">
				<xsl:value-of select="./@path" />
			</xsl:attribute>
			<xsl:attribute name="name">
				<xsl:value-of select="./@name" />
			</xsl:attribute>
			<!--<xsl:value-of select="./@name" />-->
		</li>
	</xsl:for-each>
	</ul>
</xsl:template>

</xsl:stylesheet>
