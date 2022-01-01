import React, { Component } from 'react'
import Navigation from './Navigations/Navigation'
import CollectionsNavigation from './Navigations/CollectionsNavigation'
import { Link } from 'react-router-dom'
import './Sidebar.scss'
import { FaHome, FaStore, FaFileInvoice, FaFileInvoiceDollar, FaUsers, FaDollarSign, FaCog, FaSuitcase, FaChartLine } from 'react-icons/fa'
import SidebarNavbar from '../AppNavbar/SidebarNavbar'
import CompanyBlock from '../CompanyBlock/CompanyBlock'
export default class Sidebar extends Component {
    render() {
       
        return (
            <nav className='sidebar'>
                {/* <SidebarNavbar /> */}
                <CompanyBlock />
                <Navigation />
            </nav >
        )
    }
}
