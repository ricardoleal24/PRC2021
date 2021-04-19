<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="text" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="obra">
        <!--  -->
        ###  http://www.semanticweb.org/ricardoleal24/ontologies/arquivo-musical#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Obra ;
        :tipo "<xsl:value-of select="tipo"/>" ;
        :titulo "<xsl:value-of select="titulo"/>" .
        
        ###  http://www.semanticweb.org/ricardoleal24/ontologies/arquivo-musical#<xsl:value-of select= "translate(compositor, ' ', '_')"/>
        :<xsl:value-of select= "translate(compositor, ' ', '_')"/> rdf:type owl:NamedIndividual ,
        :Compositor ;
        :compos :<xsl:value-of select="@id"/> ;
        :nome "<xsl:value-of select="compositor"/>" .
        
        <xsl:for-each select="instrumentos/instrumento">
            ###  http://www.semanticweb.org/ricardoleal24/ontologies/arquivo-musical#<xsl:value-of select= "translate(designacao, ' ', '_')"/>
            :<xsl:value-of select= "translate(designacao, ' ', '_')"/> rdf:type owl:NamedIndividual ;
            :eInstrumento :<xsl:value-of select="../../@id"/> ;
            :nome "<xsl:value-of select="designacao"/>" .
            
            ###  http://www.semanticweb.org/ricardoleal24/ontologies/arquivo-musical#<xsl:value-of select="partitura/@path"/>
            :<xsl:value-of select="partitura/@path"/> rdf:type owl:NamedIndividual ,
            :Partitura ;
            :ePartitura :<xsl:value-of select= "translate(designacao, ' ', '_')"/> ;
            :path "<xsl:value-of select="partitura/@path"/>" ;
            :type "<xsl:value-of select="partitura/@type"/>" .
        </xsl:for-each>
        
        
    </xsl:template>
    
    
</xsl:stylesheet>