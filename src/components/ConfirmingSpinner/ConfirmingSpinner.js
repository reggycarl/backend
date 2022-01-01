import React, { Component } from 'react'
import { SyncLoader } from 'react-spinners'
import './ConfirmingSpinner.scss'
export default class ConfirmingSpinner extends Component {
    render() {
        return (
            <div className='row h-100 align-items-center justify-content-center'>
                <div className="  col-md-4" id='spinnerContainer'>
                    <div className='col'>
                        <div className="loader">
                            <SyncLoader

                                size={10}
                                color={"#0076cc"}
                            />
                        </div>
                        <h1 >LOADING...</h1>
                    </div>
                </div>
            </div>
        )
    }
}
