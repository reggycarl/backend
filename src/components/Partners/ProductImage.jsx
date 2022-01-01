

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
                    <FaTrash />
                </div>
            </Col>
        )
    }
}

