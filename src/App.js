import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'
import Location from './components/Location'
import {index, index_name, client} from './resources/SearchTools'
import './App.css'
const algoliasearchHelper = require('algoliasearch-helper')

class App extends Component {

  state = {
    userLocationAccepted: undefined,
    searchQuery: "",
    searchResults: [],
    searchCount: undefined,
    searchTime: undefined,
    currentCuisine: undefined,
    minRating: undefined,
    paymentType: undefined,
    cuisineTypes: []
  }

  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery: searchQuery}, () => this.updateSearch())
  }

  updateCuisine = (cuisine) => {
    if (cuisine) {
      this.setState({currentCuisine: cuisine.name}, () => this.updateSearch())
    } else {
      this.setState({currentCuisine: null}, () => this.updateSearch())
    }
  }

  updateSearch = () => {
    const helper = algoliasearchHelper(client, index_name, {facets: ["food_type"]})
    if (this.state.currentCuisine) {
      helper.setQuery(this.state.searchQuery)
      helper.addFacetRefinement("food_type", this.state.currentCuisine).search()
    } else {
      helper.setQuery(this.state.searchQuery).search()
    }
    this.updateStateWithSearchResults(helper)
  }

  updateStateWithSearchResults = (helper) => {
    helper.on("result", (content) => {
      this.setState({
        searchResults: this.filterResults(content.hits),
        searchCount: content.nbHits,
        searchTime: content.processingTimeMS,
        cuisineTypes: content.getFacetValues("food_type")
      })
    })
  }

  handleSuccessError = (error, content, action) => {
    if (error) {
      console.log("There was an error " + action + "!", error)
      throw error
    } else {
      console.log("Success " + action + "!", content)
    }
  }

  updateBasedOnRating = (rating) => {
    this.setState({minRating: rating}, () => this.updateSearch())
  }

  filterResultsBasedOnRating = (searchResults) => {
    const filteredResults = searchResults.filter((restaurant, idx) => {
      return Math.round(parseFloat(restaurant.stars_count)) >= parseFloat(this.state.minRating)
    })
    return filteredResults
  }

  filterResultsBasedPaymentType = (searchResults) => {
    const altPayments = ["Diners Club", "Carte Blanche", "American Express"]
    return searchResults.filter((restaurant, idx) => {
      if (restaurant.payment_options.includes(this.state.paymentType)) {
        return restaurant
      } else if (altPayments.includes(this.state.paymentType)) {
        if (restaurant.payment_options.includes("Discover")) {
          return restaurant
        }
      }
    })
  }

  filterResults = (searchResults) => {
    if (this.state.minRating && this.state.paymentType) {
      let filteredResults = []
      filteredResults = this.filterResultsBasedOnRating(searchResults)
      filteredResults = this.filterResultsBasedPaymentType(filteredResults)
      return filteredResults
    } else if (this.state.minRating) {
      return this.filterResultsBasedOnRating(searchResults)
    } else if (this.state.paymentType) {
      return this.filterResultsBasedPaymentType(searchResults)
    } else {
      return searchResults
    }
  }

  updatePaymentType = (paymentType) => {
    this.setState({paymentType: paymentType}, () => this.updateSearch())
  }

  setLocation = (latitude, longitude) => {
    this.setState({lat: latitude, lon: longitude})
  }

  setIndex() {
    index.setSettings(
      {
        'attributesForFaceting': ['food_type'],
        'sortFacetValuesBy': 'count',
        'searchableAttributes': ["name","food_type","city","area","neighborhood"],
        ranking: ['typo','geo','words','attribute','proximity','exact','custom']
      }, (error, content) => this.handleSuccessError(error, content, "setting index settings")
    )
  }

  componentDidMount() {
    this.setIndex()
    this.updateSearch()
  }

  render() {
    return (
      <div className="App flex-row">
        <div>
          <SearchBar
            updateSearchQuery={this.updateSearchQuery}
          />
          <Location setLocation={this.setLocation}/>
        </div>
        <div className='flex-column'>
          <SideBar
            cuisines={this.state.cuisineTypes}
            updateCuisine={this.updateCuisine}
            updateBasedOnRating={this.updateBasedOnRating}
            updatePaymentType={this.updatePaymentType}
          />
          <ResultList
            results={this.state.searchResults}
          />
        </div>
      </div>
    );
  }
}

export default App;
