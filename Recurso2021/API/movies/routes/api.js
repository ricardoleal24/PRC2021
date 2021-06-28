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
    PREFIX : <http://www.semanticweb.org/ricardoleal24/ontologies/movies#> 
`
var getLink = "http://www.localhost:7200/repositories/Cinema?query="

router.get('/repos', function(req, res) {
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
        res.json(repos)
    })
    .catch(erro => res.render('error', {error: erro}));
});

router.get('/filmes', function(req, res) {
  if(req.query.ano) {
    var query = `
  select ?title where { 
    ?id a :Filme .
    ?id :title ?title .
    ?id :year ?year .
      filter(?year = ${req.query.ano})
  } 
`
  }else if(req.query.gen){
      var query = `
      select ?title where { 
        ?id a :Filme .
        ?id :title ?title .
        ?id :temGénero ?g .
        ?g :nome ?n .
        filter(?n = '${req.query.gen}')
    } order by ?g
      `
  
  }else {
    var query = `
    select ?id ?title ?year (count(?a) as ?natores) where { 
      ?id a :Filme .
        ?id :title ?title .
        ?id :year ?year .
        ?id :temAtor ?a .
    } group by ?id ?title ?year `
    }
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var movies = dados.data.results.bindings.map(e => {
        if(req.query.ano){
          return ({
            title : e.title.value
          })
        }
        else if(req.query.gen){
          return ({
            title : e.title.value
          })
        }
        return({
          id : e.id.value.split('#')[1],
          title : e.title.value,
          year : e.year.value,
          natores : e.natores.value
        })
      })
      console.dir(movies)
      res.json(movies)
    })
    .catch(erro => res.json({error: erro}));
});


router.get('/filmes/:id', function(req, res) {
  var query = `
  select ?title ?year ?cast ?genres where { 
    :${req.params.id} :title ?title ;
    							    :year ?year ;
                      :temAtor ?cast ;
                      :temGénero ?genres .
}
`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var movies = dados.data.results.bindings.map(e => {

        return({
          title : e.title.value,
          year : e.year.value,
          caste : e.cast.value,
          genres : e.genres.value
        })
      })
      console.dir(movies)
      res.json(movies)
    })
    .catch(erro => res.json({error: erro}));
});


router.get('/atores' , function(req, res) {
  
  console.log('entrou...', req.params.id)
  var query = `
  select distinct ?nome where { 
    ?id a :Ator.
  ?id :nome ?nome .
} order by ?nome
`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var atores = dados.data.results.bindings.map(e => {
        return({
          nome : e.nome.value
        })
      })
      console.dir(atores)
      res.json(atores)
    })
    .catch(erro => res.json({error: erro}));
});

router.get('/atores/:id' , function(req, res) {
  console.log('entrou atores id')
  var query = `
  select distinct ?title ?year where { 
    :${req.params.id} :éAtor ?f .
    ?f :title ?title .
    ?f :year ?year .
}
`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      var filmes = dados.data.results.bindings.map(e => {
        return({
          title : e.title.value,
          year : e.year.value
        })
      })
      res.json(filmes)
    })
    .catch(erro => res.json({error: erro}));
});

router.get('/generos' , function(req, res) {
  
  var query = `
  select distinct ?g where { 
    ?id a :Filme .
    ?id :temGénero/:nome ?g .
} order by ?g	
`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      var generos = dados.data.results.bindings.map(e => {
        return({
          genero : e.g.value
        })
      })
      res.json(generos)
    })
    .catch(erro => res.json({error: erro}));
});


module.exports = router;
