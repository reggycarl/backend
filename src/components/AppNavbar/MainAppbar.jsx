import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaEnvelopeOpen,
  FaEnvelopeOpenText,
  FaBoxes,
  FaBezierCurve,
  FaHandHoldingUsd,
  FaDollarSign,
  FaMobile,
  FaFileInvoiceDollar,
  FaMobileAlt,
} from "react-icons/fa";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Col,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  NavbarText,
  Row,
} from "reactstrap";
import {
  FaTh,
  FaCog,
  FaBell,
  FaEnvelope,
  FaComment,
  FaList,
  FaBars,
  FaTable,
} from "react-icons/fa";
import axiosInstance from "../misc/Axios";

import "./MainAppbar.scss";
import CurrentUser from "./CurrentUser";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import PartnerModal from "../Modals/PartnerModal";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
class MainAppNavbar extends Component {
  // const[isOpen, setIsOpen] = useState(false);
  state = {
    isOpen: false,
    showPartnersModal: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  logout = () => {
    console.log("LOGGING OUT USER");
    this.props.actions.logout();
  };

  navigateTo = (link) => {
    console.log(link);
    this.props.history.push(link);
  };
  togglePartnersModal = () => {
    this.setState({
      ...this.state,
      showPartnersModal: !this.state.showPartnersModal,
    });
  };
  selectPartner = (partner) => {
    console.log(partner);
    axiosInstance
      .get(`/admins/partners/companies/${partner}/switch_company`)
      .then((response) => {
        var new_user = response.data.current_admin;
        this.props.actions.update_user(new_user);
        this.setState({
          ...this.state,
          showPartnersModal: false,
        });
      });

    // this.setState({
    //   ...this.state,
    //   partner: {
    //     ...this.state.vendor,
    //     partner: partner,
    //     partner_id: partner.id,
    //     showPartnersModal: false
    //   }
    // })
  };
  togglePasswordModal = () => {
    this.setState({
      ...this.state,
      showPasswordModal: !this.state.showPasswordModal,
    });
  };
  switchToAdmin = () => {
    axiosInstance
      .get(`/admins/partners/companies/switch_to_admin`)
      .then((response) => {
        var new_user = response.data.current_admin;
        this.props.actions.update_user(new_user);
        this.setState({
          ...this.state,
          showPartnersModal: false,
        });
      });
  };

  render() {
    return (
      <Row className="header">
        <PartnerModal
          isOpen={this.state.showPartnersModal}
          selectPartner={this.selectPartner.bind(this)}
          switchToAdmin={this.switchToAdmin}
          toggle={this.togglePartnersModal}
          parentForm={this}
        />
        <ChangePasswordModal
          isOpen={this.state.showPasswordModal}
          toggle={this.togglePasswordModal}
          parentForm={this}
        />
        <Navbar light expand="lg" dark={true} className="mainApp">
          <Collapse isOpen={this.state.isOpen} navbar aria>
            <button className="btn-default btn sidebarBtn">
              <FaBars />
            </button>
            <Nav className="navbar-nav ml-auto mt-2 mt-lg-0" navbar>
              <NavItem>
                <NavLink>
                  <p style={{ color: "#000", fontWeight: "bold" }}>
                    <b>
                      {this.props.authentication.user.current_company
                        ? ` Current Partner :  ${this.props.authentication.user.current_company.name}`
                        : ""}
                    </b>
                  </p>
                </NavLink>
              </NavItem>
              <UncontrolledDropdown inNavbar>
                <DropdownToggle color="default">
                  <FaEnvelope />
                  {/* <span className='navName'><b> &nbsp; Messages</b></span> */}
                </DropdownToggle>
                <DropdownMenu className="" right altclass="largeDropdown">
                  <DropdownItem>You have no messages</DropdownItem>
                  {/* <DropdownItem>
                                        Option 2
                      </DropdownItem>
                                    <DropdownItem divider /> */}
                  {/* <DropdownItem>
                                        Option 2
                      </DropdownItem> */}
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown inNavbar>
                <DropdownToggle color="default">
                  <FaBell />
                </DropdownToggle>
                <DropdownMenu className="" right>
                  <DropdownItem right>You have No Notifications</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown inNavbar>
                <DropdownToggle color="default">
                  <CurrentUser />
                  {/* <FaCog /> */}
                </DropdownToggle>
                
                <DropdownMenu right>
                <DropdownItem onClick={this.togglePasswordModal}>
                  Change Password
                </DropdownItem>
                  {this.props.authentication.default_path == "/admins/" ? (
                    <DropdownItem onClick={this.togglePartnersModal}>
                      Switch to Partner
                    </DropdownItem>
                  ) : (
                    ""
                  )}

                  <DropdownItem onClick={this.logout}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MainAppNavbar)
);
