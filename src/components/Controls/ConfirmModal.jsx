import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
export default class ConfirmModal extends Component {
    render() {
        return (<Modal isOpen={this.props.open} toggle={this.props.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle}>{this.props.title || `${this.props.action_name.toUpperCase} RECORD`}</ModalHeader>
                    <ModalBody>
                    Are you sure you want to {this.props.action_name} this record?
                    </ModalBody>
                    <ModalFooter>
                    <Button color="success" onClick={this.props.action}>Yes {this.props.action_name} it</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
        )
    }
}
