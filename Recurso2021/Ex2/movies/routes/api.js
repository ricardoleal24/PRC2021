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
  }else{
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

router.get('/atores/:id ' , function(req, res) {
  console.log('entrou...', req.params.id)
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
      console.dir(dados.data.results.bindings)
      var filmes = dados.data.results.bindings.map(e => {
        return({
          title : e.title.value,
          year : e.year.value
        })
      })
      console.dir(filmes)
      res.json(filmes)
    })
    .catch(erro => res.json({error: erro}));
});


//GET /api/modalidades/:id - Devolve a lista de EMD referentes à modalidade passada como parâmetro;
router.get('/api/modalidades/:id' , function(req, res) {
  console.log('entrou...', req.params.id)
  var query = `
  select ?s ?m ?n where {
    ?s :temModalidade ?m .
    ?m :nome ?n .
    FILTER (?n = '${req.params.id}')
    }	
`
// Ou
//select ?emd where {
// :m_BTT ^:temModalidade ?emd .
//}

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var emds = dados.data.results.bindings.map(e => {
        return({
          emd : e.s.value.split('emd_')[1]
        })
      })
      console.dir(emds)
      res.json(emds)
    })
    .catch(erro => res.json({error: erro}));
});

// GET /api/atletas?gen=F - Devolve uma lista ordenada alfabeticamente com os nomes dos atletas de género feminino;
// GET /api/atletas?clube=X - Devolve uma lista ordenada alfabeticamente com os nomes dos atletas do clube X
router.get('/api/atletas' , function(req, res) {
  console.log('req.params.query...', req.query.gen, req.query.clube)

  if(req.query.gen){
    var query = `
    select ?n where {
      ?s a :Emd;
         :temAtleta ?a .
      ?a :nome ?n .
      ?a :genero ?g.
    
      FILTER(?g = '${req.query.gen}')
 
    } ORDER BY ASC(?n)
    `
    var encoded = encodeURIComponent(prefixes + query)
    axios.get(getLink + encoded)
      .then(dados =>{
        console.dir(dados.data.results.bindings)
        var atletasf = dados.data.results.bindings.map(e => {
          return({
            nomef : e.n.value
          })
        })
        console.dir(atletasf)
        res.json(atletasf)
      })
      .catch(erro => res.json({error: erro}));
    }
    else if(req.query.clube){

      var query = `
      select ?na where {
        ?s a :Emd;
          :temClube ?c .
   	    ?c  :nome ?n .
        ?s :temAtleta ?a .
        ?a :nome ?na.
          FILTER(?n = '${req.query.clube}')
      } ORDER BY ASC(?n)
      `
      var encoded = encodeURIComponent(prefixes + query)

      axios.get(getLink + encoded)
        .then(dados =>{
          console.dir(dados.data.results.bindings)
          var atletasc = dados.data.results.bindings.map(e => {
            return({
              nomea : e.na.value
            })
          })
          console.dir(atletasc)
          res.json(atletasc)
        })
        .catch(erro => res.json({error: erro}));

    }
    else{
      res.status(400).json({error: erro})
    }
});


module.exports = router;
