import React, { Component } from 'react'

class Location extends Component {

  state = {
    location: undefined,
  }

  getLocation = (event) => {
    event.preventDefault()
    if (!navigator.getLocation && this.state.location) {
      this.geocodeAddress()
    } else if (this.state.location) {
      this.geocodeAddress()
    } else if (!navigator.geolocation && !this.state.location) {
      alert("Sorry your browser does not support geolocation, please manually input your current location to locate restaurants near your location")
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({location: `${position['coords']['latitude']}, ${position['coords']['longitude']}`}, () => this.geocodeAddress())
      })
    }
  }

  geocodeAddress = () => {
    let address = this.state.location.split(" ").join("+")
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
      .then(r => r.json())
      .then(json => {
        console.log(json)
        this.props.setLocation(json['results'][0]['geometry']['location'])
        this.setState({location: json['results'][0]['formatted_address']})
      })
  }

  handleLocationChange = (event) => {
    event.preventDefault()
    this.setState({location: event.target.value})
  }

  render() {
    return (
      <div>
        <form onSubmit={(event) => this.getLocation(event)}>
          <input
            type='text'
            value={this.state.location}
            placeholder={"Address, City, Zip..."}
            onChange={(event) => this.handleLocationChange(event)}
            >
          </input>
          <input
            type='submit'
            value={"Set Your Location"}
            onClick={(event) => this.getLocation(event)}
            >
          </input>
        </form>
      </div>
    )
  }

}

export default Location
