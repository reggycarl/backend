

import React, { Component } from 'react'
import {baseurl} from '../misc/Axios'
import {Col } from 'reactstrap'
import './ProductImage.scss'
import { FaRecycle, FaStar, FaTrash } from 'react-icons/fa'
export default class ProductImage extends Component {
    render() {
        return (
            <Col md={1} className="photo"  >
                <img src={this.props.image.image_url} />
                <div className='photoActions'>
                    <FaStar />
                    <FaTrash onClick={e => {
                        console.log("CLICKED ME>>>TRASH")
                        e.stopPropagation();
                        e.preventDefault(); this.props.removePhoto(this.props.image)}}/>
                </div>
            </Col>
        )
    }
}

