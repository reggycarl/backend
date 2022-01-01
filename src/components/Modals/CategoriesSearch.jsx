import React, { Component } from "react";
import { Col, FormGroup, Input, Button } from "reactstrap";
import SubmitButton from "../Controls/SubmitButton";
import "./categories_modal.scss";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../misc/Axios";
import { flatten } from "../misc/functions";
import _ from "lodash";
import Row from "reactstrap/lib/Row";
export default class CategoriesSearch extends Component {
  onChange = (e) => {
    // console.log(e.target.name)
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount = () => {
    // var instance = axiosInstance.get(`/categories/?type=tree`)
    Promise.all([
      axiosInstance.get(`/categories/?type=roots`),
      axiosInstance.get(`/categories/?type=no_children`),
    ]).then(([structuredResponse, unstructuredResponse]) => {
      var unstructured = unstructuredResponse.data.data;
      console.log(structuredResponse, unstructuredResponse);
      if (structuredResponse.status == "UNAUTHENTICATED") {
      } else {
        this.setState({
          ...this.state,
          categories: [...structuredResponse.data.data],
          flat_categories: unstructured,
        });
      }
    });
  };
  onSubmit = (e) => {
    // console.log("Searching");
    e.preventDefault();
    var self = this;

    var instance = axiosInstance.get(
      `/categories/?search_string=${this.state.search_string}&search=true`
    );
    instance
      .then((response) => {
        // console.log(response);
        if (response.status == "UNAUTHENTICATED") {
        } else {
          self.setState({
            ...self.state,
            categories: [...response.data.data],
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  state = {
    categories: [],
    search_string: "",
    ancestry: [],
    category: {},
    menu_tree: [],
    dtOptions1: {
      paging: true, // Table pagination
      ordering: true, // Column ordering
      info: true, // Bottom left status text
      responsive: true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: '<em class="fa fa-search"></em>',
        sLengthMenu: "_MENU_ records per page",
        info: "Showing page _PAGE_ of _PAGES_",
        zeroRecords: "Nothing found - sorry",
        infoEmpty: "No records available",
        infoFiltered: "(filtered from _MAX_ total records)",
        oPaginate: {
          sNext: '<em class="fa fa-caret-right"></em>',
          sPrevious: '<em class="fa fa-caret-left"></em>',
        },
      },
    },
  };
  selectCategories(e) {
    // this.state.categories.
    // console.log(e)
    var menu_tree = [];
    console.log("THIS IS DATAITEM", e.target.getAttribute("data-item"));
    var id = parseInt(e.target.getAttribute("data-item"));

    var category = this.state.flat_categories.find(
      (obj) => obj.id == e.target.getAttribute("data-item")
    );
    var index = this.state.flat_categories.findIndex(
      (obj) => obj.id == e.target.getAttribute("data-item")
    );
    var new_flat_categories = [...this.state.flat_categories];

    var new_ancestry = [];

    axiosInstance
      .get(`/categories/${category.uuid}?type=children`)
      .then((response) => {
        var new_category = response.data.category;
        console.log("THIS IS CATEGORY FROM SERVER", new_category);
        if (category.ancestry == null || category.ancestry == "") {
          console.log("USING 1");
          // console.log("SETTING USING ID", category.id)
          // new_ancestry = [...this.state.ancestry]
          // console.log("NEW ANCESTRY BEFORE", new_ancestry)
          new_ancestry.push(category.id);
        } else {
          console.log("USING 2");
          console.log("USING ANCESTRY VALUE", category.ancestry);
          var anc_arr = category.ancestry
            .split("/")
            .map((val) => parseInt(val));
          console.log("USING ANCESTRY ARR", anc_arr);
          new_ancestry = [...anc_arr, category.id];
          // new_ancestry.concat([category.id])
          console.log("THIS IS NEW ANCESTRY ARR", new_ancestry);
        }
        new_flat_categories[index] = { ...new_category };
        this.setState({
          ...this.state,
          // categories: new_categories,
          category: category,
          ancestry: [...new_ancestry],
          flat_categories: new_flat_categories,
          category_id: category.id,
          // opened_category_id: id,
          menu_tree: menu_tree,
        });
      });

    this.props.selectCategory(category);
  }

  render() {
    return (
      <Col className="catWrapper">
        <Row>
          <div className="categoryBox">
            <ul>
              {this.state.categories.map((row, i) => {
                return (
                  <li
                    data-item={row.id}
                    onClick={this.selectCategories.bind(this)}
                    key={i + 1}
                    category={row}
                    className={
                      this.state.ancestry.includes(row.id) ? "selected" : ""
                    }
                  >
                    {row.name}
                  </li>
                );
              })}
            </ul>
          </div>
          {this.state.ancestry.map((anc) => {
            console.log("THIS IS ANCESTRY", anc);
            var category = this.state.flat_categories.find(
              (cat) => cat.id == anc
            );
            console.log("THIS IS CATEGORY", category);

            return _.isEmpty(category.children) ? (
              ""
            ) : (
              <div className="categoryBox">
                <ul>
                  {category.children.map((cat, i) => {
                    return (
                      <li
                        data-item={cat.id}
                        onClick={this.selectCategories.bind(this)}
                        key={i + 1}
                        category={cat}
                        className={
                          this.state.ancestry.includes(cat.id) ? "selected" : ""
                        }
                      >
                        {cat.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </Row>
      </Col>
    );
  }
}
