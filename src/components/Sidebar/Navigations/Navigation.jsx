import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  FaHome,
  FaHandHoldingUsd,
  FaStore,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaUsers,
  FaDollarSign,
  FaCog,
  FaSuitcase,
  FaChartLine,
  FaIndustry,
  FaUniversity,
  FaMoneyBillAlt,
  FaTable,
  FaBug,
  FaMotorcycle,
  FaBook,
  FaList,
  FaBell,
  FaBellSlash,
  FaListUl,
  FaRegBell,
  FaBookmark,
  FaCreditCard,
  FaTasks,
  FaEnvelope,
  FaBoxes,
  FaProjectDiagram,
  FaImage,
  FaImages,
  FaCogs,
  FaTruck,
  FaTags,
  FaSignal,
  FaBullhorn,
  FaCoins,
} from "react-icons/fa";
import {
  Col,
  Row,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
} from "reactstrap";
import * as actions from "../../../actions";
import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";
import axiosInstance from "../../misc/Axios";
class Navigation extends Component {
  has_access = (component_name) => {
    var default_app = this.props.authentication.default_app;
    if (!_.isEmpty(default_app)) {
      if (!_.isEmpty(default_app.components)) {
        var index = _.findIndex(default_app.components, (component) => {
          return component.short_name == component_name;
        });
        console.log(index);
        return index >= 0;
      }
    }
  };
  state = { links: [] };
  get_app_name = () => {
    var default_app = this.props.authentication.default_app;
    if (!_.isEmpty(default_app)) {
      return default_app.name.toLowerCase();
    }
    return null;
  };
  isActive(route) {
    console.log("Route is ", route);
    console.log("THIS IS THE CURRENT PATH", window.location.pathname);
    if (route == "/" && window.location.pathname == route) {
      return "active";
    } else if (window.location.pathname.startsWith(route) && route != "/") {
      return "active ";
    }
    return "";
  }
  render() {
    var order_path =
      this.props.authentication.default_path == "/admins/"
        ? `/admins/cart_orders/`
        : `/partners/orders/`;
    var users_link =
      this.props.authentication.default_path == "/partners/"
        ? "/partners/settings/users/"
        : "/admins/settings/admins/";
    return (
      <Nav className="navbar-nav" navbar>
        {/* {this.state.links.map((link, i) => {
                    console.log( "THIS IS ICON", link.icon)
                    var CustomTag = link.icon ;
                    var icon = React.createElement(link.icon);
                    return <NavItem>
                    <Link to={link.link} className='nav-link'><span className='icon'><CustomTag/></span><span>{link.name}</span></Link>
                </NavItem>
                })} */}
        <NavItem>
          <Link to={`/`} className={`nav-link ${this.isActive("/")}`}>
            <span className="icon">
              <FaHome />
            </span>
            <span>Dashboard</span>
          </Link>
        </NavItem>

        <UncontrolledDropdown
          nav
          inNavbar
          className={` ${this.isActive(
            this.props.authentication.default_path + "products/"
          )}`}
        >
          <DropdownToggle nav caret>
            <span className="icon">
              <FaBoxes />
            </span>
            <span>Products</span>
          </DropdownToggle>
          <DropdownMenu right>
            {this.props.authentication.default_path == "/partners/" ||
            !_.isEmpty(this.props.authentication.user.current_company) ? (
              <Link
                to={`${this.props.authentication.default_path}products/new`}
                className={`dropdown-item ${this.isActive(
                  `${this.props.authentication.default_path}products/new`
                )}`}
              >
                New Product
              </Link>
            ) : (
              ""
            )}
            <Link
              to={`${this.props.authentication.default_path}products/`}
              className={`dropdown-item ${this.isActive(
                `${this.props.authentication.default_path}products/`
              )}`}
            >
              All Products
            </Link>
            <Link
              to={`${this.props.authentication.default_path}products/?type=pending`}
              className={`dropdown-item ${this.isActive(
                `${this.props.authentication.default_path}products/?type=pending`
              )}`}
            >
              Pending Products
            </Link>
            <Link
              to={`${this.props.authentication.default_path}products/?type=approved`}
              className={`dropdown-item ${this.isActive(
                `${this.props.authentication.default_path}products/?type=approved`
              )}`}
            >
              Approved Products
            </Link>
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={`${this.props.authentication.default_path}products/?type=featured`}
                className={`dropdown-item ${this.isActive(
                  `${this.props.authentication.default_path}products/?type=featured`
                )}`}
              >
                Featured Products
              </Link>
            ) : (
              ""
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
        {/* <NavItem>
                        <Link to={`${this.props.authentication.default_path}orders/`} className={`nav-link ${this.isActive(this.props.authentication.default_path + "orders/")}`}><span className='icon'><FaList /></span><span>Orders</span></Link>
                    </NavItem> */}
        <UncontrolledDropdown
          nav
          inNavbar
          className={` ${this.isActive(
            this.props.authentication.default_path + "products/"
          )}`}
        >
          <DropdownToggle nav caret>
            <span className="icon">
              <FaList />
            </span>
            <span>Orders</span>
          </DropdownToggle>
          <DropdownMenu right>
            {this.props.authentication.default_path == "/admins/" ? (
              <>
                {" "}
                <h3> Summary</h3>
                <Link
                  to={`${this.props.authentication.default_path}orders/`}
                  className={`dropdown-item ${this.isActive(
                    this.props.authentication.default_path + "orders/"
                  )}`}
                >
                  <span className="icon"></span>
                  <span>All Orders</span>
                </Link>
                <Link
                  to={`${this.props.authentication.default_path}orders/?type=PP`}
                  className={`dropdown-item ${this.isActive(
                    this.props.authentication.default_path + "orders/"
                  )}`}
                >
                  <span className="icon"></span>
                  <span>Pending Payment</span>
                </Link>
                <Link
                  to={`${this.props.authentication.default_path}orders/?type=PC`}
                  className={`dropdown-item ${this.isActive(
                    this.props.authentication.default_path + "orders/"
                  )}`}
                >
                  <span className="icon"></span>
                  <span>Pending Confirmation</span>
                </Link>
                <h3>Detailed</h3>{" "}
              </>
            ) : (
              ""
            )}
            <Link
              to={`${order_path}?type=PAM`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>Pending At Merchant</span>
            </Link>
            <Link
              to={`${order_path}?type=AFP`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>Available for Pickup</span>
            </Link>
            <Link
              to={`${order_path}?type=ERPC`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>En Route to Processing Centre</span>
            </Link>
            <Link
              to={`${order_path}?type=PPC`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>At Processing Centre</span>
            </Link>
            <Link
              to={`${order_path}?type=ECD`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>En Route to Delivery Centre</span>
            </Link>
            <Link
              to={`${order_path}?type=ECDA`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>En Route to Customer Address</span>
            </Link>
            <Link
              to={`${order_path}?type=DF`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>Delivery Failed</span>
            </Link>
            <Link
              to={`${order_path}?type=SD`}
              className={`dropdown-item ${order_path}`}
            >
              <span className="icon"></span>
              <span>Sucessfully Delivered</span>
            </Link>
          </DropdownMenu>
        </UncontrolledDropdown>
        {this.props.authentication.default_path == "/admins/" ? (
          <UncontrolledDropdown
            nav
            inNavbar
            className={` ${this.isActive("/appearance/")}`}
          >
            <DropdownToggle nav caret>
              <span className="icon">
                <FaProjectDiagram />
              </span>
              <span>Categories</span>
            </DropdownToggle>
            <DropdownMenu right>
              <Link
                to={`/admins/categories/new`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/categories/new"
                )}`}
              >
                New Category
              </Link>
              <Link
                to={`/admins/categories/`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/categories"
                )}`}
              >
                All Categories
              </Link>
              <Link
                to={`/admins/categories/?type=roots`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/categories"
                )}`}
              >
                All Root Categories
              </Link>
              <Link
                to={`/admins/category_groups/`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/category_groups"
                )}`}
              >
                Category Groups{" "}
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          ""
        )}

        {this.props.authentication.default_path == "/admins/" ? (
          <UncontrolledDropdown
            nav
            inNavbar
            className={` ${this.isActive("/admins/partners")}`}
          >
            <DropdownToggle nav caret>
              <span className="icon">
                <FaUsers />
              </span>
              <span>Partners</span>
            </DropdownToggle>
            <DropdownMenu right>
              <Link
                to={`/admins/partners/companies`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/partners/companies"
                )}`}
              >
                Businesses
              </Link>
              <Link
                to={`/admins/partners/users`}
                className={`dropdown-item  ${this.isActive(
                  "/admins/partners/users"
                )}`}
              >
                Users
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          ""
        )}
        {this.props.authentication.default_path == "/admins/" ? (
          <UncontrolledDropdown
            nav
            inNavbar
            className={` ${this.isActive(
              this.props.authentication.default_path + "vouchers/"
            )}`}
          >
            <DropdownToggle nav caret>
              <span className="icon">
                <FaTags />
              </span>
              <span>Vouchers</span>
            </DropdownToggle>
            <DropdownMenu right>
              <Link
                to={`${this.props.authentication.default_path}vouchers/new`}
                className={`dropdown-item ${this.isActive(
                  `${this.props.authentication.default_path}vouchers/new`
                )}`}
              >
                New Voucher
              </Link>
              <Link
                to={`${this.props.authentication.default_path}vouchers/`}
                className={`dropdown-item ${this.isActive(
                  `${this.props.authentication.default_path}vouchers/`
                )}`}
              >
                All Vouchers
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          ""
        )}
        {this.props.authentication.default_path == "/admins/" ? (
          <UncontrolledDropdown
            nav
            inNavbar
            className={` ${this.isActive("/product_configurations/")}`}
          >
            <DropdownToggle nav caret>
              <span className="icon">
                <FaCogs />
              </span>
              <span>Product Configurations</span>
            </DropdownToggle>
            <DropdownMenu right>
              <Link
                to={`/product_configurations/brands`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/brands"
                )}`}
              >
                Brands
              </Link>
              <Link
                to={`/product_configurations/sizes`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/sizes"
                )}`}
              >
                Sizes
              </Link>
              <Link
                to={`/product_configurations/size_groups`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/size_groups"
                )}`}
              >
                Size Group
              </Link>
              <Link
                to={`/product_configurations/colors`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/colors"
                )}`}
              >
                Colors
              </Link>
              <Link
                to={`/product_configurations/product_tags`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/product_tags"
                )}`}
              >
                Tags
              </Link>
              <Link
                to={`/product_configurations/product_taxes`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/product_taxes"
                )}`}
              >
                Taxes
              </Link>

              <Link
                to={`/product_configurations/countries`}
                className={`dropdown-item  ${this.isActive(
                  "/product_configurations/countries"
                )}`}
              >
                Countries
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          ""
        )}
        {this.props.authentication.default_path == "/admins/" ? (
          <UncontrolledDropdown
            nav
            inNavbar
            className={` ${this.isActive("/delivery_configurations/")}`}
          >
            <DropdownToggle nav caret>
              <span className="icon">
                <FaTruck />
              </span>
              <span>Delivery Configurations</span>
            </DropdownToggle>
            <DropdownMenu right>
              <Link
                to={`/delivery_configurations/regions`}
                className={`dropdown-item  ${this.isActive(
                  "/delivery_configurations/regions"
                )}`}
              >
                Regions
              </Link>
              <Link
                to={`/delivery_configurations/cities`}
                className={`dropdown-item  ${this.isActive(
                  "/delivery_configurations/cities"
                )}`}
              >
                Cities
              </Link>
              <Link
                to={`/delivery_configurations/pickup_locations`}
                className={`dropdown-item  ${this.isActive(
                  "/delivery_configurations/pickup_locations"
                )}`}
              >
                Pickup Locations
              </Link>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          ""
        )}

        {this.props.authentication.default_path == "/admins/" ? (
          <>
            <UncontrolledDropdown
              nav
              inNavbar
              className={` ${this.isActive("/appearance/")}`}
            >
              <DropdownToggle nav caret>
                <span className="icon">
                  <FaImages />
                </span>
                <span>Appearance</span>
              </DropdownToggle>
              <DropdownMenu right>
                <Link
                  to={`/appearances/pages`}
                  className={`dropdown-item  ${this.isActive(
                    "/appearances/pages"
                  )}`}
                >
                  Pages
                </Link>
                <Link
                  to={`/appearances/main_sliders`}
                  className={`dropdown-item  ${this.isActive(
                    "/appearances/main_sliders"
                  )}`}
                >
                  Main Slider
                </Link>
                <Link
                  to={`/appearances/category_widgets`}
                  className={`dropdown-item  ${this.isActive(
                    "/appearances/category_widgets"
                  )}`}
                >
                  Category Widgets
                </Link>
                <Link
                  to={`/appearances/advert_widgets`}
                  className={`dropdown-item  ${this.isActive(
                    "/appearances/advert_widgets"
                  )}`}
                >
                  Advert Widgets
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown
              nav
              inNavbar
              className={` ${this.isActive("/admins/promotions_n_more")}`}
            >
              <DropdownToggle nav caret>
                <span className="icon">
                  <FaBullhorn />
                </span>
                <span>Promotions</span>
              </DropdownToggle>
              <DropdownMenu right>
                <Link
                  to={`/admins/promotions`}
                  className={`dropdown-item  ${this.isActive(
                    "/appearances/pages"
                  )}`}
                >
                  Promotions
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown
              nav
              inNavbar
              className={` ${this.isActive("/admins/promotions")}`}
            >
              <DropdownToggle nav caret>
                <span className="icon">
                  <FaCoins />
                </span>
                <span>Points System</span>
              </DropdownToggle>
              <DropdownMenu right>
                <Link
                  to={`/admins/points_configurations`}
                  className={`dropdown-item  ${this.isActive(
                    "/admins/points_configurations"
                  )}`}
                >
                  Points Configuration
                </Link>
                <Link
                  to={`/admins/points_configurations/points_listing`}
                  className={`dropdown-item  ${this.isActive(
                    "/admins/points_configurations/points_lisitng"
                  )}`}
                >
                  Points Listing Report
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown
              nav
              inNavbar
              className={` ${this.isActive("/admins/users")}`}
            >
              <DropdownToggle nav caret>
                <span className="icon">
                  <FaUsers />
                </span>
                <span>Users</span>
              </DropdownToggle>
              <DropdownMenu right>
                <Link
                  to={`/admins/users`}
                  className={`dropdown-item  ${this.isActive("/admins/users")}`}
                >
                  All Users
                </Link>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        ) : (
          ""
        )}

        {this.props.authentication.default_path != "/admins/" ? (
          <NavItem>
            <Link
              to={`${this.props.authentication.default_path}messages/`}
              className={`nav-link ${this.isActive(
                `${this.props.authentication.default_path}messages/`
              )}`}
            >
              <span className="icon">
                <FaEnvelope />
              </span>
              <span>Messages</span>
            </Link>
          </NavItem>
        ) : (
          ""
        )}
        {this.props.authentication.default_path != "/admins/" ? (
          <NavItem>
            <Link
              to={`${this.props.authentication.default_path}notifications/`}
              className={`nav-link ${this.isActive(
                this.props.authentication.default_path + "notifications"
              )}`}
            >
              <span className="icon">
                <FaRegBell />
              </span>
              <span>Notifications</span>
            </Link>
          </NavItem>
        ) : (
          ""
        )}

        <UncontrolledDropdown
          nav
          inNavbar
          className={` ${this.isActive("/reports/")}`}
        >
          <DropdownToggle nav caret>
            <span className="icon">
              <FaChartLine />
            </span>
            <span>Reports</span>
          </DropdownToggle>
          <DropdownMenu>
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/key_metrics"}
                className={`dropdown-item  ${"/admins/reports/key_metrics"}`}
              >
                Key Metrics
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ||
            this.props.authentication.default_path == "/partners/" ? (
              <Link
                to={this.props.authentication.default_path + "reports/sales"}
                className={`dropdown-item  ${this.isActive(
                  this.props.authentication.default_path +
                    "reports/sales_report"
                )}`}
              >
                Sales Report
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/partners/" ? (
              <Link
                to={"/partners/reports/account_statement"}
                className={`dropdown-item  ${this.isActive(
                  "/partners/reports/account_statement"
                )}`}
              >
                Account Statement
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/subscriber_growth"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/subscriber_growth"
                )}`}
              >
                User Growth
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/partner_growth"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/partner_growth"
                )}`}
              >
                Partner Growth
              </Link>
            ) : (
              ""
            )}

            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/partner_self_signup_growth"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/partner_self_signup_growth"
                )}`}
              >
                Partner Self Sign Up
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/sales_per_vendor"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/sales_per_vendor"
                )}`}
              >
                Sales Per Vendor
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/commissions_per_vendor"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/commissions_per_vendor"
                )}`}
              >
                Commissions Per Vendor
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/payouts_per_vendor"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/payouts_per_vendor"
                )}`}
              >
                Payout Per Vendor
              </Link>
            ) : (
              ""
            )}
            {this.props.authentication.default_path == "/admins/" ? (
              <Link
                to={"/admins/reports/top_skus"}
                className={`dropdown-item  ${this.isActive(
                  "/admins/reports/top_skus"
                )}`}
              >
                Top SKU's
              </Link>
            ) : (
              ""
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown
          nav
          inNavbar
          className={` ${this.isActive(
            `${this.props.authentication.default_path}settings/`
          )}`}
        >
          <DropdownToggle nav caret>
            <span className="icon">
              <FaCog />
            </span>
            <span>Settings</span>
          </DropdownToggle>
          <DropdownMenu right>
            {this.props.authentication.default_path == "/partners/" ? (
              <Link
                to={"/partners/settings/company_profile"}
                className={`dropdown-item  ${this.isActive(
                  "/partners/settings/company_profile"
                )}`}
              >
                Company Profile
              </Link>
            ) : (
              ""
            )}
            <Link
              to={users_link}
              className={`dropdown-item  ${this.isActive(users_link)}`}
            >
              {this.props.authentication.default_path == "/partners/"
                ? "Users"
                : "Admins"}
            </Link>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
