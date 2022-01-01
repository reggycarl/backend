import React, { Component } from 'react'
import Select from 'react-select'
export default class CustomSelect extends Component {
    customStyles = {
        option: (provided, state) => ({
          ...provided,
         
          padding: 7,
        }),
        // container: () => ({
        //     width: "100%"
        // }),
        control: () => ({
       
        alignItems: "center",
        boxAlign: "center",
        flexAlign: "center",
        alignItems: "center",
        backgroundColor: "hsl(0,0%,100%)",
        borderColor: "hsl(0,0%,80%)",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px;",
        cursor: "default",
        display: "-webkit-box",
        display: "-webkit-flex",
        display: "-ms-flexbox",
        display: "flex",
        flexWrap: "wrap",
        
        boxPack: "justify",
        justifyContent: "space-between",
        flexPack: "justify",
        justifyContent: "space-between",
        /* min-height: 38px; */
        outline: "0 !important",
        position: "relative",
        
        transition: "all 100ms",
        boxSizing: "border-box",
        }),
        valueContainer: (styles) => ({
            ...styles,
            // padding: 0
            height: 25,
            
        }),
        indicatorsContainer: (styles) => {
            return {
            ...styles,
            height: 30,
            width: 30
        }
        },
        singleValue: (provided, state) => {
          const opacity = 1;
          const transition = 'opacity 300ms';
          return { ...provided, opacity, transition };
        }
    }
    render() {
        return <Select styles={this.customStyles} {...this.props} />;
        
    }
}
