// import algoliasearchHelper from 'algoliasearch-helper'
// import algoliasearch from 'algoliasearch'
// const combinedRestaurantJSON = require('./dataset/combined_restaurant_data_fixed.json')
// const APP_ID = 'ZPSJDZC155'
// const indexName = 'open_table_restaurants'
//
// function indexData(jsonData, appId, indexName) {
//   fetch('https://restaurant-locator-server.herokuapp.com/auth/generate')
//     .then(resp => resp.json())
//     .then(json => {
//       const client = algoliasearch(appId, json['secure_key'])
//       const index = client.initIndex(indexName)
//       index.addObjects(jsonData, (err, content) => {
//         if(err) {
//           console.log(err, "Content Not Added")
//         } else {
//           console.log(content,"Contents added to index successfully!")
//         }
//       })
//     })
// }
