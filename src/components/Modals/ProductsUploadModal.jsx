import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProductUploadsSearch from './ProductUploadsSearch';
import axiosInstance from "../misc/Axios";

class ProductUploadsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.isOpen,
            product_upload_groups: []
        };

        this.toggle = this.toggle.bind(this);
    }
    componentDidMount = () => {
        
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>

                <Modal isOpen={this.props.isOpen} modalTransition={{ timeout: 100 }} backdropTransition={{ timeout: 100 }}  size={"lg"} 
                    toggle={this.toggle} className={`modal-full ${this.props.className}`}>
                    <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>Bulk Upload Products</ModalHeader>
                    <ModalBody>
                        <ProductUploadsSearch product_upload_groups={this.state.product_upload_groups} selectProductUpload={this.props.selectProductUpload} />
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '} */}
                        <Button color="secondary" onClick={this.props.toggle.bind(this.props.parentForm)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ProductUploadsModal;