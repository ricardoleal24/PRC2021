var express = require('express');
var router = express.Router();
var axios = require('axios')

//o IRI da ontologia é local
var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX adv: <http://www.semanticweb.org/ricardoleal24/ontologies/arquivo-musical#> 
`


//Lista Repositórios
router.get('/', function(req, res) {
  axios.get("http://localhost:7200/rest/repositories")
    .then(dados =>{
        console.dir(dados.data)
        repos = dados.data.map(r => {
          return({
            id: r.id,
            tit: r.title,
            uri: r.uri
          })
        })
        res.render('index',{repositorios: repos})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista de Classes
router.get('/:r', function(req, res) {
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE {?s rdf:type owl:Class}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      var classes = dados.data.results.bindings.map(bind => bind.s.value.split('#')[1])
      res.render('classes', {repo: req.params.r, classes: classes})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista de indivíduos
router.get('/:r/enteties/:c', function(req, res) {
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE {?s rdf:type adv:${req.params.c}}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      var enteties = dados.data.results.bindings.map(bind => bind.s.value.split('#')[1])
      res.render('enteties', {classe: req.params.c ,repo: req.params.r, enteties: enteties})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista propiedade indivíduos
router.get('/:r/enteties/:c/individuals/:i', function(req, res) {
  var iri = "<http://www.semanticweb.org/ricardoleal24/ontologies/"+ req.params.r +"#>"
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE {adv:${req.params.i} ?p ?o}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      var datap = dados.data.results.bindings.map(bind => bind.p.value.split('#')[1])
      var datao = dados.data.results.bindings.map(bind => bind.o.type === 'literal' ? bind.o.value :bind.o.value.split('#')[1] )      
      res.render('individuals', {repo: req.params.r, classe: req.params.c,
                                 individual: req.params.i, datap: datap, datao: datao})
    })
    .catch(erro => res.render('error', {error: erro}));
});

module.exports = router;
