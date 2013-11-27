<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="spaces">
	<xsl:param name="index" select="0"/>
	<xsl:param name="tab" select="0"/>
	<xsl:if test="not($index = $tab)">
		<xsl:text>----</xsl:text>
		<xsl:call-template name="spaces">
			<xsl:with-param name="index" select="$index + 1" />
			<xsl:with-param name="tab" select="$tab" />
		</xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template name="page">
	<xsl:param name="tab" select="0"/>
	<xsl:param name="margin" select="0"/>
	<xsl:param name="icon" select="file"/>
	<xsl:param name="parent" select="root"/>
	<li style="margin-left:{$margin}px" parent="{$parent}">
		<xsl:attribute name="path">
			<xsl:value-of select="./@path" />
		</xsl:attribute>
		<xsl:attribute name="modes">
			<xsl:value-of select="./@modes" />
		</xsl:attribute>
		<!--
		<xsl:call-template name="spaces">
			<xsl:with-param name="tab" select="$tab"/>
		</xsl:call-template>
		-->
		<a href="#" class="filelabel">
			<i class="icon-{$icon}"></i>
			<xsl:value-of select="./@name" />
		</a>
		<div class="close">x</div>
	</li>
</xsl:template>

<xsl:template match="/wymprj">
	<ul class="nav nav-list">
	<xsl:for-each select="./group">
		<xsl:call-template name="page">
			<xsl:with-param name="tab" select="0"/>
			<xsl:with-param name="margin" select="0"/>
			<xsl:with-param name="icon" select='"folder-open"'/>
			<xsl:with-param name="parent" select='"root"'/>
		</xsl:call-template>
		<xsl:for-each select="./page">
			<xsl:call-template name="page">
				<xsl:with-param name="tab" select="1"/>
				<xsl:with-param name="margin" select="12"/>
				<xsl:with-param name="icon" select='"file"'/>
				<xsl:with-param name="parent" select="./../@name"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:for-each>
	<xsl:for-each select="./page">
		<xsl:call-template name="page">
			<xsl:with-param name="tab" select="0"/>
			<xsl:with-param name="margin" select="0"/>
			<xsl:with-param name="icon" select='"file"'/>
			<xsl:with-param name="parent" select='"root"'/>
		</xsl:call-template>
	</xsl:for-each>
	</ul>
</xsl:template>

</xsl:stylesheet>
