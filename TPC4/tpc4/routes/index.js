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
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#> 
`
var getLink = "http://www.localhost:7200/repositories/tabela-periodica?query="

//Página Inicial
router.get('/', function(req, res) {
  console.log('router get /')
  res.render('index')
});

//Lista Repositórios
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
        res.render('index',{repositorios: repos})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista de Elementos
router.get('/elementos', function(req, res) {
  var query = `
  SELECT * WHERE { 
      ?s a :Element ;
      :name ?name ;
      :symbol ?symb ;
      :atomicNumber ?anumber .
    }
  ORDER BY ASC(?name)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var elementos = dados.data.results.bindings.map(e => {
        return({
          name : e.name.value,
          symb : e.symb.value,
          anumber : e.anumber.value
        })
      })
      console.dir(elementos)
      res.render('elementos', {elementos: elementos})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Elemento
router.get('/elementos/:e', function(req, res) {
  var query = `
  SELECT DISTINCT ?name ?symb ?anumber ?aweight ?group ?period ?block ?color ?sstate ?crid ?classi WHERE {  
    :Ac ?p ?o ;
        :name ?name ; 
        :symbol ?symb ; 
        :atomicNumber ?anumber ;
        :atomicWeight ?aweight ;
        :group ?group ; 
        :period ?period ;
        :block ?block ;
        :color ?color ; 
        :standardState ?sstate ;
        :casRegistryID ?crid ; 
        :classification ?classi .    
  }
  ORDER BY ASC(?name)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var elemento = dados.data.results.bindings.map(e => {
        return({
          name : e.name.value, 
          symb : e.symb.value, 
          anumber : e.anumber.value,
          aweight : e.aweight.value,
          group : e.group.value.split('#')[1].split('_')[1], 
          period : e.period.value.split('#')[1].split('_')[1],
          block : e.block.value.split('#')[1].split('-')[0],
          color : e.color.value, 
          sstate : e.sstate.value.split('#')[1],
          crid : e.crid.value, 
          classi : e.classi.value.split('#')[1]
        })
      })
      console.dir(elemento[0])
      res.render('elemento', {e: elemento[0]})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista de Grupos
router.get('/grupos', function(req, res) {
  var query = `
  SELECT ?s ?name ?number WHERE {  
    ?s a :Group.
    OPTIONAL{
       ?s :name ?name.
       ?s :number ?number.
    }
  }
  ORDER BY DESC (?name)`
  var encoded = encodeURIComponent(prefixes + query)
  console.log(query)
  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var grupos = dados.data.results.bindings.map(g => {
        return({
          id: g.s.value.split('#')[1],
          name : g.name ? g.name.value : '-'
        })
      })
      
      res.render('grupos', {grupos: grupos})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Grupo
router.get('/grupos/:g', function(req, res) {
  var query = `
  SELECT DISTINCT ?name ?number WHERE {  
    :group_15 ?p ?o;
              :name ?name;
              :number ?number;
}`
  var encoded = encodeURIComponent(prefixes + query)
  console.log(query)
  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var grupo = dados.data.results.bindings.map(g => {
        return({
          id: req.params.g,
          name : g.name ? g.name.value : '-',
          number : g.number ? g.number.value : '-'
        })
      })
      console.dir(grupo)
      res.render('grupo', {g: grupo[0]})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Lista de Periodos
router.get('/periodos', function(req, res) {
  var query = `
  SELECT * WHERE { 
    ?s a :Period;
       :number ?number .
}
ORDER BY ASC(?number)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var periodos = dados.data.results.bindings.map(p => {
        return({
          id : p.s.value.split('#')[1],
          number : p.number.value
        })
      })
      console.dir(periodos)
      res.render('periodos', {periodos: periodos})
    })
    .catch(erro => res.render('error', {error: erro}));
});

//Periodo
router.get('/periodos/:p', function(req, res) {
  var query = `
  SELECT DISTINCT ?number ?element ?name WHERE { 
    :${req.params.p} ?p ?o;
       :number ?number ;
       :element ?element .
    ?element :name ?name
}
ORDER BY ASC(?element)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados =>{
      console.dir(dados.data.results.bindings)
      var periodo = dados.data.results.bindings.map(p => {
        return({
          element : p.element.value.split('#')[1],
          name : p.name.value
        })
      })
      console.dir(periodo)
      res.render('periodo', {pnumber : req.params.p.split('_')[1], periodo: periodo})
    })
    .catch(erro => res.render('error', {error: erro}));
});

module.exports = router;
