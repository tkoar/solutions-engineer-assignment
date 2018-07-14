import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'
import {index, index_name, client, helper} from './resources/SearchTools'
import './App.css'
const algoliasearchHelper = require('algoliasearch-helper')

class App extends Component {

  state = {
    searchQuery: "",
    searchResults: [],
    searchCount: undefined,
    searchTime: undefined,
    currentCuisine: undefined,
    cuisineTypes: []
  }

  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery: searchQuery}, () => this.updateSearch(searchQuery))
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
      helper.setQuery(this.state.query)
      helper.addFacetRefinement("food_type", this.state.currentCuisine).search()
    } else {
      helper.setQuery(this.state.searchQuery).search()
    }
    this.updateStateWithSearchResults(helper)
  }

  updateStateWithSearchResults = (helper) => {
    helper.on("result", (content) => {
      this.setState({
        searchResults: content.hits,
        searchCount: content.nbHits,
        searchTime: content.processingTimeMS,
        cuisineTypes: content.getFacetValues("food_type"),
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

  setIndex() {
    index.setSettings(
      {
        'attributesForFaceting': ['food_type'],
        'sortFacetValuesBy': 'count',
        'searchableAttributes': [
          "name",
          "food_type",
          "city",
          "area",
          "neighborhood"
        ]
      }, (error, content) => this.handleSuccessError(error, content, "setting index settings")
    )
  }

  componentDidMount() {
    this.setIndex()
    const helper = algoliasearchHelper(client, index_name, {facets: ["food_type"]})
    helper.search(this.state.searchQuery)
    this.updateStateWithSearchResults(helper)
  }

  render() {
    return (
      <div className="App flex-row">
        <div>
          <SearchBar updateSearchQuery={this.updateSearchQuery}/>
        </div>
        <div className='flex-column'>
          <SideBar cuisines={this.state.cuisineTypes} updateCuisine={this.updateCuisine}/>
          <ResultList results={this.state.searchResults} />
        </div>
      </div>
    );
  }
}

export default App;
