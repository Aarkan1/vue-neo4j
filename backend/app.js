const express = require('express')
const app = express()
app.use(express.json()) // bodyparser
const { cypher, close } = require('./services/neo4j')

// neo models
const Article = require('./models/Article')

const testNeo = async () => {

  let newArticle = new Article({
    title: 'New Article',
    content: 'lorem ipsum stuff',
    timestamp: Date.now() + ""
  })

  await newArticle.save()

  console.log('saved article', newArticle)

  let articles = await Article.find()
  console.log('found articles:', articles)
}

testNeo()

// rest route to get all articles
app.get('/rest/articles', async (req, res) => {
  // await cypher(`MATCH (a:Article) RETURN a`)
  // same as
  let articles = await Article.find()
  res.json(articles)
})

// rest route to get one article on id
app.get('/rest/articles/:id', async (req, res) => {
  // await cypher(`MATCH (a:Article { id: $id }) RETURN a`, {
  //   id: req.params.id
  // })
  // same as
  let article = await Article.findOne({
    id: req.params.id
  })
  res.json(article)
})

const server = app.listen(3000, () => console.log('Listening on port 3000'))

// gracefully close neo4j database on shutdown
const shutdown = async () => {
  console.log('Closing down');
  await close()
  server.close()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)