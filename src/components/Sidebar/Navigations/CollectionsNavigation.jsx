import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStore, FaFileInvoice, FaFileInvoiceDollar, FaUsers, FaDollarSign, FaCog, FaSuitcase, FaChartLine, FaMoneyBill, FaUser } from 'react-icons/fa'
import {
    Col, Row, NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    DropdownToggle,
    DropdownItem,
    UncontrolledDropdown,
    DropdownMenu
} from 'reactstrap';
export default class AccountingNavigation extends Component {
    render() {
        return (
            <Nav className="navbar-nav" navbar>
                    <NavItem>
                        <Link to='/collections/dashboard' className='nav-link'><span className='icon'><FaHome /></span><span>Dashboard</span></Link>
                    </NavItem>
                    <NavItem>

                    <Link to='/collections/receipts' className='nav-link'>
                        <span className='icon'><FaFileInvoice /></span>
                        <span>Receipts</span></Link>
                    </NavItem>
                    <NavItem>

                    <Link to='/customers' className='nav-link'>
                        <span className='icon'><FaUsers /></span>
                        <span>Customers</span></Link>
                    </NavItem>
                    

                    <NavItem>

                        <Link to='/collections/agents' className='nav-link'>
                            <span className='icon'><FaUsers /></span>
                            <span>Agents</span></Link>
                    </NavItem>
                    
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            <span className='icon'><FaChartLine /></span>
                            <span>Reports</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            {/* <DropdownItem>
                                <Link to='/users/' className='dropdown-item'>Users</Link>
                            </DropdownItem> */}

                            {/* <DropdownItem divider />
                            <DropdownItem>
                                Reset
                      </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            <span className='icon'><FaCog /></span>
                            <span>Settings</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <Link to='/users/' className='dropdown-item'>Users</Link>
                            </DropdownItem>
                            {/* <DropdownItem divider />
                            <DropdownItem>
                                Reset
                      </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>


                </Nav>
        )
    }
}
