import React, { Component } from 'react'
import { Button, Col } from 'reactstrap'
export default class SubmitButton extends Component {
    render() {
        var show_edit = this.props.readOnly == true && this.props.existing_record == true
        var show_update = this.props.readOnly == false && this.props.existing_record == true
        var show_save = this.props.editing == false && this.props.readOnly == false && this.props.existing_record == false
        var button_text = "Save"

        if (show_edit) {
            button_text = "Edit"
        }
        else if (show_update) {
            button_text = "Update"

        }
        else if (show_save) {
            button_text = "Save"
        }
        return (
                <Button onClick={this.props.onClick} className={`btn btn-${show_edit ? 'warning' : ((show_update || show_save) ? 'success' : 'default')}`} disabled={this.props.disabled || false}>{button_text}</Button>
        )
    }
}
