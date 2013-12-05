<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="page" match="page">
	<xsl:param name="parent" select="root"/>
	<li parent="{$parent}">
		<xsl:attribute name="path">
			<xsl:value-of select="./@path" />
		</xsl:attribute>
		<xsl:attribute name="modes">
			<xsl:value-of select="./@modes" />
		</xsl:attribute>
		<a href="#" class="filelabel">
			<xsl:value-of select="./@name" />
		</a>
		<div class="close"><span class="ui-icon ui-icon-close"></span></div>
	</li>
</xsl:template>

<xsl:template name="group" match="group">
	<xsl:call-template name="page">
		<xsl:with-param name="parent" select='"root"'/>
	</xsl:call-template>
	<xsl:for-each select="./page">
		<xsl:call-template name="page">
			<xsl:with-param name="parent" select="./../@name"/>
		</xsl:call-template>
	</xsl:for-each>
</xsl:template>

<xsl:template match="/wymprj">
	<ul>
	<xsl:apply-templates select="./group|./page">
		<xsl:with-param name="parent" select='"root"'/>
	</xsl:apply-templates>
	</ul>
</xsl:template>

</xsl:stylesheet>
