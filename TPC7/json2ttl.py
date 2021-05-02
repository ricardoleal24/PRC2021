#!/usr/bin/python3
import sys
import json

with open('dataset.json', 'r', encoding='utf-8') as file:
  data = json.load(file)

out = open('out.ttl', 'w+')


def gera_cidades(cidades):
  for c in cidades:
    out.write(f'''
      ###  http://www.semanticweb.org/ricardoleal24/ontologies/mapa#{c.get('id')}
      :{c.get('id')} rdf:type owl:NamedIndividual ,
              :Cidade ;
     :descricao "{c.get('descrição')}" ;
     :distrito "{c.get('distrito')}" ;
     :nome "{c.get('nome')}" ;
     :populacao {c.get('população')} .
    ''')


def gera_ligacao(ligacoes):
  for l in ligacoes:
    out.write(f'''
    ###  http://www.semanticweb.org/ricardoleal24/ontologies/mapa#{l.get('id')}-{l.get('origem')}-{l.get('destino')}
    :{l.get('id')}-{l.get('origem')}-{l.get('destino')} rdf:type owl:NamedIndividual ,
                     :Ligacao ;
            :temDestino :{l.get('destino')} ;
            :temOrigem :{l.get('origem')} ;
            :distancia {l.get('distância')} .
    ''')

def main():
  gera_cidades(data['cidades'])
  gera_ligacao(data['ligações'])
  out.write('\n')
  out.close()

main()