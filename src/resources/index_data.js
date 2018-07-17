const algoliasearch = require('algoliasearch');
const algoliasearchHelper = require('algoliasearch-helper');
const combinedRestaurantJSON = require('./dataset/combined_restaurant_data_fixed.json')
const APP_ID = 'ZPSJDZC155'
const index_name = 'open_table_restaurants'

// index.addObjects(combinedRestaurantJSON, (err, content) => {
//   if(err) {
//     console.log(err, "Content Not Added")
//   } else {
//     console.log(content,"Contents added to index successfully!")
//   }
// })
