import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PartnerSearch from './PartnerSearch';

class PartnerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.isOpen
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>

                <Modal isOpen={this.props.isOpen} modalTransition={{ timeout: 100 }} backdropTransition={{ timeout: 100 }} size='lg'
                    toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>Search for Partner</ModalHeader>
                    <ModalBody>
                        <PartnerSearch selectPartner={this.props.selectPartner} switchToAdmin={this.props.switchToAdmin} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '}
                        
                        <Button color="secondary" onClick={this.props.toggle.bind(this.props.parentForm)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default PartnerModal;