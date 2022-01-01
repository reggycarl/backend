import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import './CompanyBlock.scss'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { FaUniversity} from 'react-icons/fa'
import { bindActionCreators } from 'redux'
import Logo from '../../assets/images/Steman-Commerce-Full-Logo-small.png'
class CompanyBlock extends Component {
    render() {
        return (
            <Col id='companyBlock'>
                <Row>
                    <Col md={12} className='companyLogo'>
                        {/* <img  /> */}
                        <div className='img'>
                            <img src={Logo} />
                        </div>
                        
                    </Col>
                    <Col md={12} className='companyName'>
                        {/* <h4>{this.props.authentication.user.company.name}</h4> */}
                    </Col>
                </Row>
            </Col>
        )
    }
}


const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyBlock);
