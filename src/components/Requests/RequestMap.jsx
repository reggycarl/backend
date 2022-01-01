import React, { Component } from 'react'
import {GoogleMap,DirectionsService, DirectionsRenderer, DistanceMatrixService, } from '@react-google-maps/api'
export default class RequestMap extends Component {
    constructor(props){
        super(props);
        const mapStyles = {
            width: '100%',
            height: '100%',
          };
          const mapOptions = {
            streetViewControl: false,
          }
    }
    state = {
        response: null,
    }
    componentDidMount(){
        // console.log("THESE ARE MY PROPS", this.props)
    }

    directionsCallback =  (response) =>  {
        // console.log("THIS IS RESPONSE", response)
    
        if (response !== null) {
          if (response.status === 'OK') {
            //   console.log("GOT STATUS")
            this.setState(
              () => ({
                response
              })
            )
          } else {
            //   console.log("NO STATUS")
            // console.log('response: ', response)
          }
        }
      }

    shouldComponentUpdate = (nextProps, nextState) => {
        // console.log("NEW PROPS state", nextState )
        // console.log("CURRENT PROPS State", this.state )
        // console.log("NEW PROPS SENT", nextProps )
        // console.log("CURRENT PROPS SENT", this.props )
        // return true
        if(nextProps.request.from_latitude == this.props.request.from_latitude && nextProps.request.to_latitude == this.props.request.to_latitude){
            if (this.state.response == null){
                // console.log("USING -2")
                return true
            }
            else if (nextState.response == null){
                // console.log("USING -1")
                return false
            }
            
            else if (nextState.response != null &&  (nextState.response.request.destination.location.lat != this.state.response.request.origin.location.lat && nextState.response.request.origin.location.lat != this.state.response.request.origin.location.lat)){
                // console.log("USING 0")
                return true
            }
            else {
                return false
            }
            console.log("USING 1")
            return false
        }
        else if ( (nextProps.request.from_latitude != this.props.request.from_latitude || nextProps.request.to_latitude != this.props.request.to_latitude || nextProps.request.from_longitude != this.props.request.from_longitude || nextProps.request.to_longitude != this.props.request.to_longitude)){
            // console.log("USING 1.5")
            return true
        }
        else if (nextState.response == null) {
            if (nextProps.request.from_latitude != this.props.request.from_latitude || nextProps.request.to_latitude != this.props.request.to_latitude){
                // console.log("USING 2")
                return true
            }
            else{
                // console.log("USING 3")
                return false
            }
            
            // return nextState.response != this.state.response.request
        }
        else{
            // console.log("USING 4 ")
            return false;
            
        }
        
        // return nextProps.response != this.props.response;
            
    }
    render() {
        return (
            <GoogleMap
            id="requestMap"
            google={this.props.google}
            zoom={15}
            tilt={45}
            options={this.mapOptions}
            clickableIcons={false} 
            center={{ lat: this.props.initialPosition.lat, lng: this.props.initialPosition.long}}
            >
                
            {/* <Marker title="From" position={{ lat: this.props.request.from_latitude ||  this.props.initialPosition.lat, lng: this.props.request.from_longitude ||  this.props.initialPosition.long}} />
            {this.props.request.to_latitude && this.props.request.to_longitude  ? <Marker title="To" position={{ lat: this.props.request.to_latitude , lng: this.props.request.to_longitude}} /> : " "} */}
           {
                (
                    this.props.request.to_location !== '' &&
                    this.props.request.from_location !== ''
                ) && (
                    <DirectionsService
                    // required
                    options={{ 
                        destination: this.props.request.to_location,
                        origin: this.props.request.from_location,
                        travelMode: "DRIVING"
                    }}
                    // required
                    callback={this.directionsCallback}
                    // optional
                    onLoad={directionsService => {
                        // console.log('DirectionsService onLoad directionsService: ', directionsService)
                    }}
                    // optional
                    onUnmount={directionsService => {
                        // console.log('DirectionsService onUnmount directionsService: ', directionsService)
                    }}
                    />
                )
                }
                
                {
                this.props.response !== null && (
                    <DirectionsRenderer
                    // required
                    options={{ 
                        directions: this.state.response
                    }}
                    onLoad={directionsRenderer => {
                        // console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                    }}
                    // optional
                    onUnmount={directionsRenderer => {
                        // console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                    }}
                    />
                )
                }
                {console.log("THIS IS ORIGIN ", this.props.request.from_location)}
                {console.log("THIS IS DESTINATION ", this.props.request.to_location)}
                <DistanceMatrixService
                    options={{
                        destinations: [this.props.request.to_location],
                        origins: [this.props.request.from_location],
                        travelMode: "DRIVING"
                    }}
                    callback={this.props.computePrice}
                    />
        </GoogleMap>
        )
    }
}
