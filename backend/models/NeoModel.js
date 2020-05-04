const { cypher } = require('../services/neo4j')
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const crypto = require('crypto')

const uuid = () => { // unique to 30 million iterations
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16))
}

const getParams = async props => {
  if(!props) return ''
  let models = ['model']
  for(let key in props) {
    Array.isArray(props[key]) && models.push(key)
  }
  let keys = Object.keys(props).filter(k => !models.includes(k))
  return '{' + keys.map(key => key + ': $' + key).join(', ') + '}'
}

module.exports = class NeoModel {
  constructor(props) {
    this.model = this.name || this.constructor.name
    Object.assign(this, props)
  }

  async save() {
    if(!this.id) this.id = uuid()
    
    await cypher(`
      MERGE (m:${this.model} {id: $id}) 
      SET m += ${await getParams(this)} RETURN m`, this)

    let models = await readdir('./models')
    models = models.map(m => m.replace('.js', ''))

    for(let key in this) {
      let prop = this[key]
      if(!Array.isArray(prop)) continue

      prop.forEach(async p => {
        if(models.includes(p.constructor.name)) {
          p = await p.save()

          await cypher(`
            MATCH (a:${this.model} {id: $id1}),
                  (b:${p.model} {id: $id2})
            MERGE (a)-[:${key}]->(b)
          `, {
            id1: this.id,
            id2: p.id
          })
        }
      })
    }

    return this
  }
  
  static async find(props) {
    let records = await cypher(`MATCH (m:${this.model || this.name} ${await getParams(props)}) RETURN m`, props)
    return records.map(rec => new this(rec)) // return a NeoModel object with methods
  }

  static async findOne(props) {
    let records = await cypher(`MATCH (m:${this.model || this.name} ${await getParams(props)}) RETURN m`, props)
    return records.map(rec => new this(rec))[0] // return a NeoModel object with methods
  }

  static async delete(props) {
    await cypher(`MATCH (m:${this.model || this.name} ${await getParams(props)}) DETACH DELETE m`, props)
  }

  async delete() {
    await cypher(`MATCH (m:${this.model} {id: $id}) DETACH DELETE m`, { id: this.id })
  }

  async populate(relations) {
    if(!Array.isArray(relations)) throw "Must provide an array of relations to populate"
    
    relations.map(rel => this[rel] = [] )

    await Promise.all(relations.map(async rel => {
      let props = {
        id: this.id
      }
      let model = await cypher(`
        MATCH (:${this.model} {id: $id})-[:${rel}]->(m) RETURN m
      `, props)

      model[0] && this[rel].push(model[0])
    }))

    return this
  }

  async detach(node) {
    if(!node || !node.model) throw 'Must provide node to detach'

    await cypher(`
            MATCH (a:${this.model} {id: "${this.id}"})-[r]-(:${node.model} {id: "${node.id}"})
            DELETE r `)
  }
}
