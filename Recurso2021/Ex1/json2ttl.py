#!/usr/bin/python3
import sys
import json
import re

with open('movies.json', 'r', encoding='utf-8') as file:
  data = json.load(file)

out = open('individuals.ttl', 'w+')

def normalize_string(data:str):
  for c in [' ','\s', '\t', '\\', '/', '&', '[', ']', '(', ')', '.', '…', '\'', ',', '?', '!', ':', ';', '\"', '"', '\n', '-', '|', '\|', '$', '\$', '~', '\-', '–', '’', '\’', '*', '+', '%', '\%']:
    data = data.replace(c, '')
  data = re.sub('[^A-Za-z0-9]+', '', data)
  return data.replace(' ', '_').lower()

def normalize_string_name(data:str):
  for c in ['"', '\"']:
    data = data.replace(c, '')
  return data

# for p in property:
#           p_formated = normalize_string(p)
#           if(p in plataform_list):
#             data += f'''\t\t:temPlataform :plataform_{p_formated} ;\n'''
#           elif(p in category_list):
#             data += f'''\t\t:temCategory :category_{p_formated} ;\n'''
#           elif(p in industry_list):
#             data += f'''\t\t:temIndustry :industry_{p_formated} ;\n'''

def gera_ttl(movies):
  for movie in movies:
    id_m = normalize_string(movie.get('title'))
    out.write(f'''
###  http://www.semanticweb.org/ricardoleal24/ontologies/movies#filme_{id_m}
:filme_{id_m} rdf:type owl:NamedIndividual ,
                                    :Filme ;
                           :title "{normalize_string_name(movie.get('title'))}" ;
                           :year "{movie.get('year')}"^^xsd:int .
''')
    
    for cast in movie.get('cast'):
      id_c = normalize_string(cast)
      out.write(f'''
###  http://www.semanticweb.org/ricardoleal24/ontologies/movies#ator_{id_c}
:ator_{id_c} rdf:type owl:NamedIndividual ,
                              :Ator ;
                     :éAtor :filme_{id_m} ;
                     :nome "{normalize_string_name(cast)}" .

''')

    for genre in movie.get('genres'):
        id_g = normalize_string(genre)
        out.write(f'''
###  http://www.semanticweb.org/ricardoleal24/ontologies/movies#género_{id_g}
:género_{id_g} rdf:type owl:NamedIndividual ,
                        :Género ;
               :éGénero :filme_{id_m} ;
               :nome "{normalize_string_name(genre)}" .

    
    ''')
    


def main():
  gera_ttl(data)
  out.write('\n')
  out.close()

main()

