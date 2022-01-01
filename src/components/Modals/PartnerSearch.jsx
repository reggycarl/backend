import React, { Component } from 'react'
import { Col, FormGroup, Input, Button } from 'reactstrap'
import SubmitButton from '../Controls/SubmitButton'
import { FaSearch } from 'react-icons/fa'
import axiosInstance from '../misc/Axios'
export default class PartnerSearch extends Component {

    onChange = e => {
        // console.log(e.target.name)
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
        }
        )
    }
    onSubmit = e => {
        
        e.preventDefault();
        var self = this;

        var instance = axiosInstance.get(`/admins/partners/companies?search_string=${this.state.search_string}`)
        instance.then((response) => {
            // console.log(response);
            if (response.status == "UNAUTHENTICATED") {
            }
            else {
                self.setState({
                    ...self.state,
                    partners: [...response.data.data],
                })
            }
        }).catch(error => {
            // console.log(error);
        })
    }


    state = {
        partners: [],
        search_string: '',
        dtOptions1: {
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: true,
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            oLanguage: {
                sSearch: '<em class="fa fa-search"></em>',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)',
                oPaginate: {
                    sNext: '<em class="fa fa-caret-right"></em>',
                    sPrevious: '<em class="fa fa-caret-left"></em>'
                }
            }
        },
    }
    selectPartner(e) {

        // this.state.partners.
        console.log("SELECTED CUSTOMER")
        var partner = this.state.partners.find(obj => obj.id == e.target.getAttribute('data-item'))
        console.log(partner)
        this.props.selectPartner(partner)
    }


    render() {
        return (
            <Col>
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <FormGroup row>

                        <div className="col-xl-12 input-group">
                            <Input type="name" name='search_string' placeholder="Search for Partner by number,  name, email and phone number" onChange={this.onChange} value={this.state.search_string} readOnly={this.state.readonly} />
                            
                            <div class="input-group-append">
                                <Button type='submit' color="primary"  >
                                    <FaSearch />
                                </Button>
                            </div>
                        </div>
                    </FormGroup>
                    
                </form>
                <FormGroup>
                    <Button className={'form-control'} color={"primary"} onClick={this.props.switchToAdmin}>Switch Back to Admin</Button>
                    </FormGroup>
                <table className="table table-striped my-4 w-100 table-bordered">
                    <thead>
                        <tr>
                            <th width='5%' data-priority="1">Index</th>
                            <th width='55%' className="sort-alpha" data-piority="2">Name</th>
                            <th width='20%' className="sort-alpha" data-priority="2">Phone</th>
                            <th width='20%' className="sort-alpha" data-priority="2">Email Address</th>
                            <th width='20%' className="sort-alpha" data-priority="2">Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.partners.map((row, i) => {
                            return (<tr data-item={row.id}  key={i + 1} partner={row}>
                                <td data-item={row.id} name={row.id}>{i + 1}</td>
                                <td data-item={row.id} name={row.id}>{row.name} </td>
                                <td data-item={row.id} name={row.id}>{row.phone}</td>
                                <td data-item={row.id} name={row.id}>{row.email} </td>
                                <td data-item={row.id} name={row.id}><Button size={"sm"} onClick={() => this.props.selectPartner(row.uuid)} data-item={row.id} color={"primary"}>Switch</Button> </td>
                            </tr>)
                        })}
                    </tbody>
                </table>

            </Col >
        )
    }
}
