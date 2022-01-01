import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SizesSearch from "./SizesSearch";
import axiosInstance from "../misc/Axios";

class SizesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isOpen,
      size_groups: [],
    };

    this.toggle = this.toggle.bind(this);
  }
  componentDidMount = () => {
    axiosInstance.get("/size_groups?with_sizes=true").then((response) => {
      console.log("THES ARE SIZES", response.data);
      this.setState({
        ...this.state,
        size_groups: response.data.data,
      });
    });
  };

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          modalTransition={{ timeout: 100 }}
          backdropTransition={{ timeout: 100 }}
          size={"lg"}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>
            Select Sizes
          </ModalHeader>
          <ModalBody>
            <SizesSearch
              size_ids={this.props.size_ids}
              size_groups={this.state.size_groups}
              selectSize={this.props.selectSize}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.props.toggle.bind(this.props.parentForm)}
            >
              OK
            </Button>{" "}
            <Button
              color="secondary"
              onClick={this.props.toggle.bind(this.props.parentForm)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SizesModal;
