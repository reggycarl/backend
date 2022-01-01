import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CategoriesSearch from './CategoriesSearch';

class CategoriesModal extends React.Component {
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

                <Modal isOpen={this.props.isOpen} modalTransition={{ timeout: 100 }} backdropTransition={{ timeout: 100 }} size={"lg"}
                    toggle={this.toggle} className={` modal-full ${this.props.className}`}>
                    <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>Search for Categories</ModalHeader>
                    <ModalBody>
                        <CategoriesSearch selectCategory={this.props.selectCategory} category_id = {this.props.category_id} />
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

export default CategoriesModal;