const express = require('express')
const app = express()
app.use(express.json()) // bodyparser
const { cypher, close } = require('./services/neo4j')

// neo models
const Article = require('./models/Article')
const User = require('./models/User')

const testNeo = async () => {

  // let newArticle = new Article({
  //   title: 'New Article',
  //   content: 'lorem ipsum stuff',
  //   timestamp: Date.now() + ""
  // })

  // await newArticle.save()

  // console.log('saved article', newArticle)


  // let user = new User({
  //   name: 'Loke',
  //   from: 'Sweden',
  //   articles: [
  //     newArticle
  //   ]
  // })

  let loke = await User.findOne({
    id: '1d09ef49-f985-4fba-b529-a205a0370d20'
  })

  // loke.from = 'England'
  // await loke.save()

  await loke.populate(['articles'])

  // loke.articles = loke.articles.map(a => new Article(a))

  // loke.articles[0] = new Article(loke.articles[0])
  // await loke.detach(loke.articles[0])

  console.log(loke);

  await loke.delete()

  // await User.delete({
  //   name: 'Loke'
  // })

  // await user.save()


  // let articles = await Article.find()
  // console.log('found articles:', articles)
}

// testNeo()

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