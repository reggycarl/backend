import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default class Editor extends Component {
  render() {
    return (
      <ReactQuill
        value={this.props.value}
        defaultValue={this.props.value}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "code-block"],
            ["clean"],
          ],
        }}
        name={this.props.name}
        disabled={this.props.disabled}
        style={{
          height: "300px",
          marginBottom: "45px",
          display: "block",
          clear: "both",
        }}
        onChange={this.props.onChange}
      />
    );
  }
}
