import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ColorsSearch from "./ColorsSearch";
import axiosInstance from "../misc/Axios";
class ColorsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isOpen,
    };

    this.toggle = this.toggle.bind(this);
  }
  componentDidMount = () => {
    axiosInstance.get("/colors").then((response) => {
      console.log("THES ARE Colors", response.data);
      this.setState({
        ...this.state,
        colors: response.data.data,
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
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>
            Search for Colors
          </ModalHeader>
          <ModalBody>
            <ColorsSearch
              selectColor={this.props.selectColor}
              colors={this.state.colors}
              color_ids={this.props.color_ids}
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

export default ColorsModal;
