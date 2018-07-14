const algoliasearch = require('algoliasearch')
const APP_ID = 'ZPSJDZC155'
const API_KEY = 'bd36c8d32cbc75d68d3983859bc8010c'
const index_name = 'open_table_restaurants'
const client = algoliasearch(APP_ID, API_KEY)
const index = client.initIndex(index_name)

module.exports = {
  app_id: APP_ID,
  api_key: API_KEY,
  client: client,
  index: index,
  index_name: index_name,
}
