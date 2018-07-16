const algoliasearch = require('algoliasearch');
const algoliasearchHelper = require('algoliasearch-helper');
const combinedRestaurantJSON = require('./dataset/combined_restaurant_data_fixed.json')
const APP_ID = 'ZPSJDZC155'
const API_KEY = 'bd36c8d32cbc75d68d3983859bc8010c'
const index_name = 'open_table_restaurants'
const client = algoliasearch(APP_ID, API_KEY)
const index = client.initIndex(index_name)

index.addObjects(combinedRestaurantJSON, (err, content) => {
  if(err) {
    console.log(err, "Content Not Added")
  } else {
    console.log(content,"Contents added to index successfully!")
  }
})
