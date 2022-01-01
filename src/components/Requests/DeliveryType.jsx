import React, { Component } from 'react'
import {Col, Row} from 'reactstrap'
import './DeliveryType.scss'
import {getVehicleTypes} from '../misc/functions'
import { mdiBicycle , mdiCarHatchback, mdiVanUtility, mdiMotorbike, mdiCubeSend} from '@mdi/js';
import Icon from '@mdi/react';
export default class DeliveryType extends Component {
    
   
    typeSelected = (item) => {
        console.log(item)
        this.props.setDeliveryType(item.value);

    }
    render() {
        return (
            <Col md={12} className='DeliveryBox'>
                <Row>
                {this.props.delivery_types.map((item, i) => {
                    console.log("THIS IS ITEM", item)
                    console.log("THIS IS REQUEST", this.props.request)
                    var iconConstant
                    if (item.label.toLowerCase() == 'bicycle'){
                        iconConstant = mdiBicycle
                    }
                    else if (item.label.toLowerCase() == 'motor bike'){
                        iconConstant = mdiMotorbike
                    }
                    else if (item.label.toLowerCase() == 'car'){
                        iconConstant = mdiCarHatchback
                    }
                    else if (item.label.toLowerCase() == 'van'){
                        iconConstant = mdiVanUtility
                    }
                    else{
                        iconConstant = mdiCubeSend
                    }
                        
                    return <Col  className={`item `}>
                        <Col className={` inner ${this.props.request.delivery_type_id == item.value ? "selected" : ""}`} onClick={this.props.readOnly ? null : this.typeSelected.bind(this, item)}>
                            <div class='icon'>
                                <Icon path ={iconConstant}
                                className={this.props.request.delivery_type_id == item.value ? "selected" : '' }
                                size={2} />
                            </div>
                            <div className="title">
                                {item.label}
                            </div>
                        </Col>
                        </Col>
                })}
                </Row>
                
            </Col>
        )
    }
}
