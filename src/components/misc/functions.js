import moment from 'moment'
import axiosInstance from './Axios'
import _ from 'lodash'
import React from 'react'
var partner_types = [];
var id_types = [];
var customer_types = [];
var marital_statuses = [];
var genders = [];
var branches = [];
var products = [];
var product_categories = [];
var invoices = [];
var bills = [];
var accounts = [];
var payment_modes = [];
var bank_cash_accounts = []
var mobile_networks = []
var countries = []
var ledgers = []
var vehicle_types = []
var payment_methods = []
var categories = []
var brands = [];
var size_groups = [];
var delivery_types = [];
var product_taxes = [];
var company_types = [];
var banks = [];
var regions = [];
var cities = [];
var order_statuses = [];

export async function getPatnerTypes() {
    await axiosInstance.get('/partner_types').then((response) => {
        console.log(response);
        if (response.status == "UNAUTHENTICATED") {
            partner_types = [];
        }
        else {

            partner_types = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return partner_types
}
export async function getOrderStatuses() {
    await axiosInstance.get('/order_statuses').then((response) => {
        console.log(response);
        if (response.status == "UNAUTHENTICATED") {
            order_statuses = [];
        }
        else {
            order_statuses = response.data.data.map((row, i) => {
                return { value: row.id, label: row.code + " - " + row.name }
            });
        }

    }).catch(error => {
        
    })
    return order_statuses
}

export async function getCompanies(partner) {
    await axiosInstance.get( partner == true ? '/partners/companies' : '/admins/partners/companies?full=true').then((response) => {
        console.log(response);
        if (response.status == "UNAUTHENTICATED") {
            partner_types = [];
        }
        else {
            partner_types = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return partner_types
}
export async function getVehicleTypes() {
    await axiosInstance.get('/vehicle_types').then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            vehicle_types = [];
        }
        else {
            vehicle_types = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return vehicle_types
}
export async function getDeliveryTypes() {
    await axiosInstance.get('/delivery_types').then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            delivery_types = [];
        }
        else {
            delivery_types = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return delivery_types
}
export async function getBanks() {
    await axiosInstance.get('/banks').then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            banks = [];
        }
        else {
            banks = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return banks
}
export function flatten(arr) {
    var arr_collection = []
//     const newArr = arr.reduce((acc, item) => {
//       if (Array.isArray(item.chilren)) {
//         acc = acc.concat(flatten(item.children));
//       } else {
//        acc.push(item.children);
//       }
  
//       return acc;
//     }, []);
  
//     return newArr;
    for (var cat in arr){
        console.log("THIS IS CATEGORY", arr[cat])
        arr_collection.push(arr[cat])
        if(!_.isEmpty(arr[cat].children)){
            arr_collection.concat(flatten(arr[cat].children))
        }
        
    }

    return arr_collection
    
  }
export async function getProductTaxes() {
    await axiosInstance.get('/product_taxes').then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            product_taxes = [];
        }
        else {
            product_taxes = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name} - ${row.rate}%` }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return product_taxes
}

export async function getCategories() {
    await axiosInstance.get(`/categories?with_parent=true`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            categories = [];
        }
        else {
            categories = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return categories
}
export async function getBrands() {
    await axiosInstance.get(`/brands?with_parent=true`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            brands = [];
        }
        else {
            brands = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return brands
}
export async function getSizeGroups() {
    await axiosInstance.get(`/size_groups?with_parent=true`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            size_groups = [];
        }
        else {
            size_groups = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return size_groups
}
export async function getIndirectCategories() {
    await axiosInstance.get(`/categories?type=indirects&with_parent=false`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            categories = [];
        }
        else {
            categories = response.data.data.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {
        // partner_types = [];
    })
    return categories
}


export async function getGenders() {
    await axiosInstance.get('/genders').then((response) => {

        if (response.status == "UNAUTHENTICATED") {

        }
        else {

            genders = response.data.genders.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }
    }).catch(error => {


    })
    console.log("THESE ARE GENDERS", genders)
    return genders
}
export async function getCustomerTypes() {
    await axiosInstance.get('/customer_types').then((response) => {

        if (response.status == "UNAUTHENTICATED") {

        }
        else {

            customer_types = response.data.customer_types.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {


    })

    return customer_types
}

export async function getIDTypes() {
    await axiosInstance.get('/id_types').then((response) => {

        if (response.status == "UNAUTHENTICATED") {

        }
        else {

            id_types = response.data.id_types.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {


    })

    return id_types
}
export async function getMaritalStatuses() {
    await axiosInstance.get('/marital_statuses').then((response) => {

        if (response.status == "UNAUTHENTICATED") {

        }
        else {

            marital_statuses = response.data.marital_statuses.map((row, i) => {
                return { value: row.id, label: row.name }
            });
        }

    }).catch(error => {


    })

    return marital_statuses
}

export async function getAccounts() {
    
    await axiosInstance.get(`/accounts`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            accounts = response.data.map((row, i) => {
                return { value: row.uuid, label: `${row.code} - ${row.name} ${row.number ? " - " + row.number :  "" }`, id: row.id }
            });
            console.log("THIS IS RESPONSE ", accounts)
        }
    }).catch(error => {

    })
    return accounts
}

export async function getMobileNetworks() {
    await axiosInstance.get(`/mobile_networks`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            mobile_networks = response.data.mobile_networks.map((row, i) => {
                console.log("THIS IS NETWORK", row);
                return { value: row.id, label: `${row.name}`}
            });
        }
    }).catch(error => {
    })
    return mobile_networks
}
export async function getPaymentModes() {
    await axiosInstance.get(`/payment_modes?savable=true`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            console.log("LP", response.data.data)
            payment_modes = response.data.payment_modes.map((row, i) => {
                return { value: row.id, label: `${row.name}`, code: row.code }
            });
            console.log("THIS IS RESPONSE ", payment_modes)
        }
    }).catch(error => {

    })
    return payment_modes
}
export async function getPaymentMethods() {
    await axiosInstance.get(`/users/payment_methods`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            console.log("LP", response.data.data)
            payment_methods = response.data.data.map((row, i) => {
                return { value: row.id, label: ` ${row.mobile_network} - ${row.number}` }
            });
            console.log("THIS IS RESPONSE ", payment_methods)
        }
    }).catch(error => {
    })
    return payment_methods
}

export async function getBankCashAccounts() {
    await axiosInstance.get(`/accounts/?type=bank_cash_accounts`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            console.log("LP", response.data)
            bank_cash_accounts = response.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, code: row.code }
            });
            console.log("THIS IS RESPONSE ", bank_cash_accounts)
        }
    }).catch(error => {

    })
    return bank_cash_accounts;
}

export async function getCountries() {
    await axiosInstance.get(`/countries/`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            countries = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, phone_code: row.phone_code, uuid: row.uuid}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", countries)
        }
    }).catch(error => {

    })
    return countries;
}
export async function getRegions(country_id) {
    await axiosInstance.get(`/regions/?country_id=${country_id}`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            regions = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, uuid: row.uuid}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", countries)
        }
    }).catch(error => {

    })
    return regions;
}


export async function getCities(region_id) {
    await axiosInstance.get(`/cities/?region_id=${region_id}`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
            cities = [];
        }
        else {
            
            cities = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, phone_code: row.phone_code}
            });
            console.log("THIS IS RESPONSE FOR COUNTRIES ", countries)
        }
    }).catch(error => {

    })
    return cities;
}
export async function getCompanyTypes() {
    await axiosInstance.get(`/company_types/`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            company_types = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.name}`, phone_code: row.phone_code}
            });
            
        }
    }).catch(error => {

    })
    return company_types;
}
export async function getLedgers() {
    await axiosInstance.get(`/ledgers/`).then((response) => {
        if (response.status == "UNAUTHENTICATED") {
        }
        else {
            
            ledgers = response.data.data.map((row, i) => {
                return { value: row.id, label: `${row.code} - ${row.name}`}
            });
            console.log("THIS IS RESPONSE FOR LEDGERS ", ledgers)
        }
    }).catch(error => {

    })
    return ledgers;
}

export function renderErrorsAsList(errors){
    var errors = errors;
    var new_errors = errors.map ((err, i) => {
        return <li>
            {err}
        </li>
    })
    return new_errors;
}


export function formatDate(date){
    var date = new moment(date)
    return date.format("dddd, MMMM Do YYYY");
}
export function formatDateTime(date){
    var date = new moment(date)
    return date.format("dddd, MMMM Do YYYY @ h:mm:ss a");
}
