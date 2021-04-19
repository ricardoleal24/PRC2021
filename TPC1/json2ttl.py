#!/usr/bin/python3
import sys
import json

#with statement ensures that the file is closed when the block inside the with statement is exited
with open('dataset.json', 'r', encoding='utf-8') as file:
  data = json.load(file)

out = open('out.ttl', 'w+')

def gera_alunos(alunos):
  for aluno in alunos:
    out.write(f'''
:{aluno.get('number')} rdf:type owl:NamedIndividual ;
    :frequenta
    ''')
    ucs_size = len(aluno.get('ucs'))
    for index,uc in (enumerate(aluno.get('ucs'))):
      if(index<ucs_size-1):
        out.write(' :'+uc+',')
      else:
        out.write(' :'+uc+';')
    out.write(f'''
    :nome "{aluno.get('fullname')}" .
    ''')

def gera_profs(profs):
  for prof in profs:
    out.write(f'''
:{prof.get('id')} rdf:type owl:NamedIndividual ,
            :Professor ;
  :ensina :{prof.get('ensina')} ;
  :nome "{prof.get('nome')} .
    ''')

def gera_ucs(ucs):
  for uc in ucs:
    out.write(f''' 
:{uc.get('id')} rdf:type owl:NamedIndividual ,
              :UnidadeCurricular ;
    :anoLetivo "{uc.get('anoLetivo')}" ;
    :designação "{uc.get('designacao')}" .
    ''')

def gera_header():
  out.write('''
@prefix : <http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc> .

<http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc> rdf:type owl:Ontology .

#################################################################
#    Object Properties
#################################################################

###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#ensina
:ensina rdf:type owl:ObjectProperty ;
        owl:inverseOf :éEnsinadaPor ;
        rdfs:domain :Professor ;
        rdfs:range :UnidadeCurricular .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#frequenta
:frequenta rdf:type owl:ObjectProperty ;
           owl:inverseOf :éFrequentadaPor ;
           rdfs:domain :Aluno ;
           rdfs:range :UnidadeCurricular .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#éAlunoDe
:éAlunoDe rdf:type owl:ObjectProperty ;
          owl:inverseOf :éProfessorDe .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#éEnsinadaPor
:éEnsinadaPor rdf:type owl:ObjectProperty .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#éFrequentadaPor
:éFrequentadaPor rdf:type owl:ObjectProperty .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#éProfessorDe
:éProfessorDe rdf:type owl:ObjectProperty ;
              owl:propertyChainAxiom ( :ensina
                                       :éFrequentadaPor
                                     ) .


#################################################################
#    Data properties
#################################################################

###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#anoLetivo
:anoLetivo rdf:type owl:DatatypeProperty .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#designação
:designação rdf:type owl:DatatypeProperty .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#nome
:nome rdf:type owl:DatatypeProperty .


#################################################################
#    Classes
#################################################################

###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#Aluno
:Aluno rdf:type owl:Class ;
       rdfs:subClassOf [ rdf:type owl:Restriction ;
                         owl:onProperty :frequenta ;
                         owl:someValuesFrom :UnidadeCurricular
                       ] .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#Professor
:Professor rdf:type owl:Class ;
           rdfs:subClassOf [ rdf:type owl:Restriction ;
                             owl:onProperty :ensina ;
                             owl:someValuesFrom :UnidadeCurricular
                           ] .


###  http://www.semanticweb.org/ricardoleal24/ontologies/prc2021/uc#UnidadeCurricular
:UnidadeCurricular rdf:type owl:Class .
  ''')

def run():
  gera_header()
  out.write('''
#################################################################
#    Individuals
#################################################################
  ''')
  gera_ucs(data['UCs'])
  gera_profs(data['Professores'])
  gera_alunos(data['Alunos'])

run()
out.write('\n')
out.close()