import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SidebarNavbar.scss'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Row
} from 'reactstrap';
import { FaTh } from 'react-icons/fa'
import './AppNavbar.scss'
import CurrentUser from './CurrentUser'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class SidebarNavbar extends Component {
    // const[isOpen, setIsOpen] = useState(false);
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }


    logout = () => {
        console.log("LOGGING OUT USER")
        this.props.actions.logout();
    }

    showAppDrawer = (e) => {
        e.preventDefault();
        console.log("Showing App Drawer")
    }

    render() {
        return (

            <Navbar light expand="lg" dark={true} className='appName'>

                <NavbarBrand href="/">Steaman Courier</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />

            </Navbar>


        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarNavbar);


