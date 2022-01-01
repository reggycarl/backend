import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import "./product_tags.scss";
import axiosInstance from "../misc/Axios";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};

const delimiters = [...KeyCodes.enter, KeyCodes.comma];
class ProductTags extends Component {
  state = {
    tags: [...this.props.tags],
    suggestions: [],
  };

  updateSuggestions = () => {
    console.log("UPdating suggesstions");
  };

  componentDidMount = () => {
    axiosInstance.get("/product_tags/").then((response) => {
      console.log("THIS IS RESPONSE", response.data.data);
      this.setState({
        ...this.state,
        suggestions: [...response.data.data],
      });
    });
  };
  handleFilterSuggestions = (textInputValue, possibleSuggestionsArray) => {
    console.log(textInputValue);
    console.log(possibleSuggestionsArray);
    return this.state.suggestions;
  };

  render() {
    return (
      <ReactTags
        tags={this.props.tags}
        suggestions={this.state.suggestions}
        handleDelete={this.props.removeTag}
        labelField="name"
        handleAddition={this.props.addTag}
        handleDrag={this.handleDrag}
        delimiters={delimiters}
        // handleFilterSuggestions={this.handleFilterSuggestions}
        readOnly={this.props.readOnly}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductTags)
);
