const neo4j = require('neo4j-driver')
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'mysql'))

const recordMapper = record => {
  return record.get(0).properties
}

const recordsMapper = records => {
  return records.records.map(rec => recordMapper(rec))
}

const cypher = async (query, props) => {
  const session = driver.session()
  try {
    return recordsMapper(await session.writeTransaction(tx => tx.run(query, props)))
  } catch(err) {
    console.error(err);
  } finally {
    await session.close()
  }
}

const close = async () => {
  await driver.close()
}

module.exports = {
  recordsMapper,
  recordMapper,
  cypher,
  close
}