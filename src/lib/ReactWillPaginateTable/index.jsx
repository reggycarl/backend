import React, { Component } from "react";
import { Col, Input, Row, Button, Container } from "reactstrap";
import "./index.scss";
import _ from "lodash";
import qs from "query-string";
import NumberField from "../../components/Controls/NumberField";
import { formatDate } from "../../components/misc/functions";
import InputGroup from "reactstrap/lib/InputGroup";
import Pagination from "react-js-pagination";

import ExcelExport from "./ExcelExport";

export default class ReactWillPaginateTable extends Component {

  state = {
    data: [],
    downloadData: [],
    endpoint: this.props.endpoint,
    per_page: this.props.per_page || 20,
    page: this.props.page || 1,
    search_string: "",
    new_params: "",
  };
  // populateDownloadData = () => {
  //   var params = qs.parse(this.props.location.search || {});
  //   console.log("Populating download data");
  //   var new_params = this.props.location.search.replace("?", "");
  //   var search_string =
  //     params.search_string != "undefined" && params.search_string != undefined
  //       ? params.search_string
  //       : "";
  //   this.props.axiosInstance
  //     .get(
  //       this.props.endpoint +
  //         `?search_string=${search_string}&all=true&${this.props.additional_params}&${new_params}`
  //     )
  //     .then((response) => {
  //       console.log("THIS IS RESPONSE FON SERVER", response);

  //       if (response.status == 200) {
  //         console.log("Populating and setting state download data");
  //         this.setState({
  //           ...this.state,
  //           downloadData: response.data.data,
  //         });
  //       }
  //     });
  // };
  componentDidMount = () => {
    console.log("THIS IS STATUS OF LINK", this.props.disable_link);
    // this.populateDownloadData();
    this.populate();
  };

  populate = () => {
    var params = qs.parse(this.props.location.search || {});
    console.log("THESE ARE PARAMS");
    var new_params = this.props.location.search.replace("?", "");
    var search_string =
      params.search_string != "undefined" && params.search_string != undefined
        ? params.search_string
        : "";
    this.setState({
      ...this.state,
      new_params: { ...new_params },
      search_string: search_string,
    });

    console.log("THIS IS SEARCH STRING", search_string);

    this.setState({
      ...this.state,
      loading: true,
    });
    // this.props.axiosInstance.get(this.props.endpoint+ `?per_page=${qs.per_page || this.state.per_page}&page=${params.page || this.state.page ||  1}&search_string=${search_string || this.state.search_string!= "undefined" || this.state.search_string!= undefined ? this.state.search_string : ""}&${this.props.additional_params}&${new_params}`)
    this.props.axiosInstance
      .get(
        this.props.endpoint +
          `?per_page=${qs.per_page || this.state.per_page}&page=${
            params.page || this.state.page || 1
          }&search_string=${search_string}&${
            this.props.additional_params
          }&${new_params}`
      )
      .then(
        (result) => {
          console.log("RESULT IS ", result);
          console.log("Populating Search string with", params.search_string);
          this.setState({
            data: result.data.data,
            size: result.data.size,
            page: parseInt(result.data.page),
            per_page: parseInt(result.data.per_page),
            search_string:
              params.search_string != "undefined" ||
              params.search_string != undefined
                ? params.search_string
                : "" || "",
            loading: false,
          });
          if (this.props.callback) {
            this.props.callback(result.data.data);
          }
        },
        (error) => {
          console.log(error);
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      );
  };

  sendAction = (e, action, obj) => {
    e.preventDefault();
    e.stopPropagation();
    // alert(`Visting ${action.url}`);
    var new_action = action.url.replace(":uuid", obj.uuid);

    this.props.axiosInstance.post(new_action).then((response) => {
      if (response.status == 202) {
        var state_data = [...this.state.data];

        var current_data_index = _.findIndex(state_data, (cur_obj) => {
          return cur_obj.uuid == obj.uuid;
        });
        state_data[current_data_index] = response.data.data;
        console.log("THIS IS THE CURRENT DATA", current_data_index);
        this.setState({
          ...this.state,
          data: [...state_data],
        });
      }
    });
  };

  capitalizeFirstLetter(string) {
    // return string
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  search = (e) => {
    this.setState({
      ...this.state,
      page: 1,
      loading: true,
    });
    this.props.history.push(
      `${this.props.link_endpoint || this.props.endpoint}?page=1&per_page=${
        this.state.per_page
      }&search_string=${this.state.search_string}`
    );
  };
  inputChanged = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  navigateTo = (page) => {
    var params = qs.parse(
      this.props.location ? this.props.location.search : " "
    );
    console.log("THESE ARE QUERY", params);
    console.log("NAVIGATING>>>");
    if (this.props.disable_link == true) {
      return true;
    } else {
      console.log(page);
      this.setState({
        ...this.state,
        loading: true,
      });
      var search_string = "";
      if (
        this.state.search_string == "undefined" ||
        this.state.search_string == null
      ) {
        search_string = "";
      } else {
        search_string = this.state.search_string;
      }
      var link = `${
        this.props.link_endpoint || this.props.endpoint
      }?page=${page}&per_page=${
        this.state.per_page
      }&search_string=${search_string}${
        this.props.options ? this.props.options : ""
      }`;
      if (params) {
        Object.keys(params).forEach((key) => {
          if (key == "type") {
            link += `&${key}=${params[key]}`;
          }
        });
      }
      this.props.history.push(link);
    }
  };
  redirectToPage =(e,row) =>{
    e.preventDefault();
      
        console.log("calling redirect function")
        this.props.history.push(
          `${
            this.props.link_endpoint ?? this.props.endpoint
          }/${row.uuid}`
        );
      
    
    }
    editRow =(e,row)=>{
     
    e.preventDefault();
    console.log("LOGGINSING to see edit " )
    console.log(row.id + "info in row")  

      if (this.props.isEditting && row.id === row){
        
      }
      }
      

    
  
  render() {
    return (
      <React.Fragment>
        <Col>
          <Row>
            <Col md={12}>
              <form onSubmit={this.search}>
                <InputGroup>
                  <Input
                    type="text"
                    className="form-control searchTextBox"
                    name="search_string"
                    value={this.state.search_string}
                    placeholder="Search for..."
                    aria-label="Search Terms"
                    aria-describedby="searchButton"
                    onChange={this.inputChanged}
                  />
                  <div class="input-group-append">
                    <Button
                      className="  full-width"
                      color="primary"
                      type="button"
                      id="searchButton"
                      onClick={this.search}
                    >
                      Search
                    </Button>
                  </div>
                </InputGroup>
              </form>
            </Col>
            <Col md={1}></Col>
          </Row>
        </Col>
        <Col md={12}>
          <table className="table table-bordered table-striped table-hover">
            <thead className="thead-light">
              <tr>
                <th>#</th>
                {this.props.columns.map((d) => {
                  var name = d.name.replace(/_/g, " ");
                  name = this.capitalizeFirstLetter(name);
                  return <th>{name}</th>;
                })}
                {this.props.actions && this.props.actions.length > 0 ? (
                  <th>Actions</th>
                ) : (
                  ""
                )}
                {this.props.show_edit_actions ? (
                  <th>Actions</th>
                ) : (
                  ""
                )}
              </tr>
             
            </thead>
            {this.state.loading ? (
              <tr>
                <td
                  className="loadingTD"
                  colSpan={this.props.columns.length + 2}
                >
                  Loading
                </td>
              </tr>
            ) : this.state.data.length > 0 ? (
              <tbody>
                {this.state.data.map((row, index) => {
                  return (
                    <tr
                      onClick={(e) => {
                        if (!this.props.disable_link || !this.props.show_edit_actions) {
                        this.redirectToPage(e,row)
                      }} 
                    
                      
                    }
                    >
                      <td>
                        {(this.state.page - 1) * this.state.per_page +
                          index +
                          1}
                      </td>
                      {this.props.columns.map((col) => {
                        var data;
                        if (col.number == true) {
                          data = data = (
                            <td className={"right"}>
                              <NumberField value={row[col.name]} />
                            </td>
                          );
                        } else if (col.boolean == true) {
                          data = (
                            <td className={""}>
                              {row[col.field || col.name]
                                ? col.options[0]
                                : col.options[1]}
                            </td>
                          );
                        } else if (col.date == true) {
                          data = (
                            <td className={""}>
                              {formatDate(row[col.field || col.name])}
                            </td>
                          );
                        } else {
                          data = (
                            <td className={""}>{row[col.field || col.name]}</td>
                          );
                        }

                        return data;
                      })}
                      {this.props.actions && this.props.actions.length > 0 ? (
                        <td>
                          {" "}
                          {this.props.actions.map((action) => {
                            console.log("THIS IS ACTIVE", row);
                            console.log(
                              "THIS IS ACTIVE PARAMS",
                              action.active_param
                            );
                            return (
                              <>
                                <a></a>
                                <button
                                  className={`btn btn-${
                                    action.color || "primary"
                                  } btn-sm`}
                                  disabled={row[action.active_param]}
                                  onClick={(e) => {
                                    this.sendAction(e, action, row);
                                  }}
                                >
                                  {action.name}{" "}
                                </button>{" "}
                                &nbsp;{" "}
                              </>
                            );
                          })}
                        </td>

                      ) : (
                        ""
                      )}
                       {this.props.show_edit_actions? <td><button onClick ={(e)=>{
                         this.editRow(e,row)
                         console.log("in edit button")
                       }}>Edit</button> <button onClick={(e) => {
                        this.redirectToPage(e,row)
                        console.log("clicking view button ")
                      }}>view</button></td>:  " "}
                    </tr>
                  );
                })}
               
                
              </tbody>
            ) : (
              <tr>
                <td
                  colSpan={this.props.columns.length + 2}
                  className="centered"
                >
                  <b>No Data to Display</b>
                </td>
              </tr>
            )}
          </table>
        </Col>
        <Col>
          <Pagination
            activePage={this.state.page || 1}
            itemsCountPerPage={this.state.per_page || 20}
            totalItemsCount={this.state.size}
            pageRangeDisplayed={6}
            itemClass="btn btn-success"
            innerClass="btn-group btn-group-toggle special pagination"
            onChange={this.navigateTo.bind(this)}
          />
        </Col>

        <Col>
          <ExcelExport
            {...this.props}
            additional_params={this.props.additional_params}
            columns={this.props.columns}
            axiosInstance={this.props.axiosInstance}
          />
        </Col>
      </React.Fragment>
    );
  }
}
