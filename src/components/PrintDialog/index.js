import React, { Component } from 'react'
import './PrintDialog.scss'
import axiosInstance from '../misc/Axios'
import print from 'print-js'
export default class index extends Component {
    state = {
        document_url: null
    }
    componentDidMount = () => {
        var url = this.props.document_url
        url = `invoices/58910db9-a2b9-41eb-8546-99011bbce19d.pdf`
        axiosInstance.get(url).then (response => {
            console.log("THIS IS RESP", response)
            var blob = new Blob([response.data], { type: response.headers['content-type'] } );
            var url = window.URL.createObjectURL(blob);
            print(url)
            this.setState({
                ...this.state,
                document_url: url
            })
        })
    }
    render() {

        return (
            <div id='printBg'>

<object
  data={this.state.document_url}
  type="application/pdf"
  width="100%"
  height="100%">
  <iframe
    src={this.state.document_url}
    width="100%"
    height="100%"
    >
    <p>Your browser does not support PDFs.
      <a href="https://example.com/test.pdf">Download the PDF</a>.</p>
  </iframe>
</object>
                <iframe src={this.state.document_url}></iframe>
            </div>
        )
    }
}
