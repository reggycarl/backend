import React, { Component, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

const waitFor = (Tag) => (props) => <Tag {...props} />;
const About = lazy(() => import("../About/About"));
const NotFound = lazy(() => import("../NotFound/NotFound"));
const UserSignup = lazy(() => import("../Signup/UserSignup"));
const PartnerSignup = lazy(() => import("../Signup/PartnerSignup"));
const ConfirmEmail = lazy(() => import("../ConfirmEmail/ConfirmEmail"));
const Products = lazy(() => import("../Products/Products"));
const Product = lazy(() => import("../Products/Product"));
const PartnerBusinesses = lazy(() => import("../Partners/Businesses"));
const PartnerBusiness = lazy(() => import("../Settings/CompanyProfile"));
const PartnerUsers = lazy(() => import("../Partners/Users"));
const Partner = lazy(() => import("../Partners/Partner"));
const Users = lazy(() => import("../Users/Users"));
const User = lazy(() => import("../Users/User"));
const UserAccounts = lazy(() => import("../UserAccounts/UserAccounts"));
const UserAccount = lazy(() => import("../UserAccounts/UserAccount"));
const CompanyProfile = lazy(() => import("../Settings/CompanyProfile"));
const Orders = lazy(() => import("../Orders/Orders"));
const Order = lazy(() => import("../Orders/Order"));
const PartnerOrders = lazy(() => import("../PartnerOrders/PartnerOrders"));
const PartnerOrder = lazy(() => import("../PartnerOrders/PartnerOrder"));
const Admins = lazy(() => import("../Admins/Admins"));
const Admin = lazy(() => import("../Admins/Admin"));
const Categories = lazy(() => import("../Categories/Categories"));
const Category = lazy(() => import("../Categories/Category"));
const CategoryGroups = lazy(() => import("../Categories/CategoryGroups"));
const CategoryGroup = lazy(() => import("../Categories/CategoryGroup"));
const MainSliders = lazy(() => import("../MainSliders/MainSliders"));
const MainSlider = lazy(() => import("../MainSliders/MainSlider"));
const CategoryWidgets = lazy(() =>
  import("../CategoryWidgets/CategoryWidgets")
);
const CategoryWidget = lazy(() => import("../CategoryWidgets/CategoryWidget"));
const Brands = lazy(() => import("../ProductConfigurations/Brands"));
const Brand = lazy(() => import("../ProductConfigurations/Brand"));
const Sizes = lazy(() => import("../ProductConfigurations/Sizes"));
const Size = lazy(() => import("../ProductConfigurations/Size"));
const Regions = lazy(() => import("../DeliveryConfigurations/Regions"));
const Region = lazy(() => import("../DeliveryConfigurations/Region"));
const Cities = lazy(() => import("../DeliveryConfigurations/Cities"));
const City = lazy(() => import("../DeliveryConfigurations/City"));
const PickupLocations = lazy(() =>
  import("../DeliveryConfigurations/PickupLocations")
);
const PickupLocation = lazy(() =>
  import("../DeliveryConfigurations/PickupLocation")
);
const ProductTaxes = lazy(() =>
  import("../ProductConfigurations/ProductTaxes")
);
const ProductTax = lazy(() => import("../ProductConfigurations/ProductTax"));
const ProductTags = lazy(() => import("../ProductConfigurations/ProductTags"));
const ProductTag = lazy(() => import("../ProductConfigurations/ProductTag"));
const SizeGroups = lazy(() => import("../ProductConfigurations/SizeGroups"));
const SizeGroup = lazy(() => import("../ProductConfigurations/SizeGroup"));
const Countries = lazy(() => import("../ProductConfigurations/Countries"));
const Country = lazy(() => import("../ProductConfigurations/Country"));
const Colors = lazy(() => import("../ProductConfigurations/Colors"));
const Color = lazy(() => import("../ProductConfigurations/Color"));
const PaymentMethods = lazy(() => import("../PaymentMethods/PaymentMethods"));
const PaymentMethod = lazy(() => import("../PaymentMethods/PaymentMethod"));
const Pages = lazy(() => import("../Pages/Pages"));
const Page = lazy(() => import("../Pages/Page"));
const Vouchers = lazy(() => import("../Vouchers/Vouchers"));
const Voucher = lazy(() => import("../Vouchers/Voucher"));
const AdvertWidgets = lazy(() => import("../AdvertWidgets/AdvertWidgets"));
const AdvertWidget = lazy(() => import("../AdvertWidgets/AdvertWidget"));
const Notifications = lazy(() => import("../Notifications/Notifications"));
const Messages = lazy(() => import("../Messages/Messages"));
const KeyMetrics = lazy(() => import("../Reports/KeyMetrics"));
const SubscriberGrowth = lazy(() => import("../Reports/SubscriberGrowth"));
const PartnerGrowth = lazy(() => import("../Reports/PartnerGrowth"));
const SalesPerVendor = lazy(() => import("../Reports/SalesPerVendor"));
const PayoutsPerVendor = lazy(() => import("../Reports/PayoutsPerVendor"));
const Sales = lazy(() => import("../Reports/Sales"));
const Promotion = lazy(() => import("../Promotions/Promotion"));
const Promotions = lazy(() => import("../Promotions/Promotions"));
const PointsConfiguration = lazy(() =>
  import("../PointsConfiguration/PointsConfiguration")
);
const PointsListing = lazy(() =>
  import("../PointsConfiguration/PointsListing")
);
const PointsConfigurations = lazy(() =>
  import("../PointsConfiguration/PointsConfigurations")
);
const AccountStatement = lazy(() => import("../Reports/AccountStatement"));

const CommissionsPerVendor = lazy(() =>
  import("../Reports/CommissionsPerVendor")
);
const PartnerSelfSignupGrowth = lazy(() =>
  import("../Reports/PartnerSelfSignupGrowth")
);

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route exact path="/admins">
          <Dashboard />
        </Route>
        <Route exact path="/users/signup">
          <UserSignup />
        </Route>
        <Route exact path="/partners/signup">
          <PartnerSignup />
        </Route>
        <Route path="/partners/orders/new" component={waitFor(PartnerOrder)} />
        <Route path="/partners/orders/:id" component={waitFor(PartnerOrder)} />
        <Route path="/partners/orders" component={waitFor(PartnerOrders)} />
        <Route path="/admins/orders/new" component={waitFor(Order)} />
        <Route path="/admins/orders/:id" component={waitFor(Order)} />
        <Route path="/admins/orders" component={waitFor(Orders)} />
        <Route
          path="/admins/cart_orders/:id"
          component={waitFor(PartnerOrder)}
        />
        <Route path="/admins/cart_orders" component={waitFor(PartnerOrders)} />
        <Route path="/admins/categories/new" component={waitFor(Category)} />
        <Route path="/admins/categories/:id" component={waitFor(Category)} />
        <Route path="/admins/categories" component={waitFor(Categories)} />
        <Route
          path="/admins/category_groups/new"
          component={waitFor(CategoryGroup)}
        />
        <Route
          path="/admins/category_groups/:id"
          component={waitFor(CategoryGroup)}
        />
        <Route
          path="/admins/category_groups"
          component={waitFor(CategoryGroups)}
        />
        <Route path="/admins/products/new" component={waitFor(Product)} />
        <Route path="/admins/products/:id" component={waitFor(Product)} />
        <Route path="/admins/products" component={waitFor(Products)} />

        <Route
          path="/admins/points_configurations/new"
          component={waitFor(PointsConfiguration)}
        />
        <Route
          path="/admins/points_configurations/points_listing"
          component={waitFor(PointsListing)}
        />
        <Route
          path="/admins/points_configurations/:id"
          component={waitFor(PointsConfiguration)}
        />
        <Route
          path="/admins/points_configurations/"
          component={waitFor(PointsConfigurations)}
        />
        <Route path="/admins/users/:id" component={waitFor(UserAccount)} />
        <Route path="/admins/users/" component={waitFor(UserAccounts)} />
        <Route path="/admins/promotions/new" component={waitFor(Promotion)} />
        <Route path="/admins/promotions/:id" component={waitFor(Promotion)} />
        <Route path="/admins/promotions/" component={waitFor(Promotions)} />
        <Route path="/admins/products/new" component={waitFor(Product)} />
        <Route path="/admins/products/:id" component={waitFor(Product)} />
        <Route path="/admins/products" component={waitFor(Products)} />
        <Route path="/partners/products/new" component={waitFor(Product)} />
        <Route path="/partners/products/:id" component={waitFor(Product)} />
        <Route path="/partners/products" component={waitFor(Products)} />
        <Route
          path="/product_configurations/brands/new"
          component={waitFor(Brand)}
        />
        <Route
          path="/product_configurations/brands/:id"
          component={waitFor(Brand)}
        />
        <Route
          path="/product_configurations/brands"
          component={waitFor(Brands)}
        />
        <Route
          path="/product_configurations/sizes/new"
          component={waitFor(Size)}
        />
        <Route
          path="/product_configurations/sizes/:id"
          component={waitFor(Size)}
        />
        <Route
          path="/product_configurations/sizes"
          component={waitFor(Sizes)}
        />
        <Route
          path="/product_configurations/size_groups/new"
          component={waitFor(SizeGroup)}
        />
        <Route
          path="/product_configurations/size_groups/:id"
          component={waitFor(SizeGroup)}
        />
        <Route
          path="/product_configurations/size_groups"
          component={waitFor(SizeGroups)}
        />
        <Route
          path="/product_configurations/countries/new"
          component={waitFor(Country)}
        />
        <Route
          path="/product_configurations/countries/:id"
          component={waitFor(Country)}
        />
        <Route
          path="/product_configurations/countries"
          component={waitFor(Countries)}
        />
        <Route
          path="/product_configurations/colors/new"
          component={waitFor(Color)}
        />
        <Route
          path="/product_configurations/colors/:id"
          component={waitFor(Color)}
        />
        <Route
          path="/product_configurations/colors"
          component={waitFor(Colors)}
        />
        <Route
          path="/product_configurations/product_taxes/new"
          component={waitFor(ProductTax)}
        />
        <Route
          path="/product_configurations/product_taxes/:id"
          component={waitFor(ProductTax)}
        />
        <Route
          path="/product_configurations/product_taxes"
          component={waitFor(ProductTaxes)}
        />
        <Route
          path="/product_configurations/product_tags/new"
          component={waitFor(ProductTag)}
        />
        <Route
          path="/product_configurations/product_tags/:id"
          component={waitFor(ProductTag)}
        />
        <Route
          path="/product_configurations/product_tags"
          component={waitFor(ProductTags)}
        />
        <Route
          path="/delivery_configurations/regions/new"
          component={waitFor(Region)}
        />
        <Route
          path="/delivery_configurations/regions/:id"
          component={waitFor(Region)}
        />
        <Route
          path="/delivery_configurations/regions"
          component={waitFor(Regions)}
        />
        <Route
          path="/delivery_configurations/cities/new"
          component={waitFor(City)}
        />
        <Route
          path="/delivery_configurations/cities/:id"
          component={waitFor(City)}
        />
        <Route
          path="/delivery_configurations/cities"
          component={waitFor(Cities)}
        />
        <Route
          path="/delivery_configurations/pickup_locations/new"
          component={waitFor(PickupLocation)}
        />
        <Route
          path="/delivery_configurations/pickup_locations/:id"
          component={waitFor(PickupLocation)}
        />
        <Route
          path="/delivery_configurations/pickup_locations"
          component={waitFor(PickupLocations)}
        />
        <Route
          path="/admins/partners/companies/new"
          component={waitFor(PartnerBusiness)}
        />
        <Route
          path="/admins/partners/companies/:id"
          component={waitFor(PartnerBusiness)}
        />
        <Route
          path="/admins/partners/companies/"
          component={waitFor(PartnerBusinesses)}
        />
        <Route path="/admins/partners/users/new" component={waitFor(User)} />
        <Route path="/admins/partners/users/:id" component={waitFor(User)} />
        <Route
          path="/admins/partners/users"
          component={waitFor(PartnerUsers)}
        />
        <Route path="/admins/settings/admins/new" component={waitFor(Admin)} />
        <Route path="/admins/settings/admins/:id" component={waitFor(Admin)} />
        <Route path="/admins/settings/admins/" component={waitFor(Admins)} />
        <Route path="/partners/settings/users/new" component={waitFor(User)} />
        <Route path="/partners/settings/users/:id" component={waitFor(User)} />
        <Route path="/partners/settings/users/" component={waitFor(Users)} />
        <Route
          path="/partners/settings/company_profile/"
          component={waitFor(CompanyProfile)}
        />
        <Route
          path="/partners/payment_methods/new"
          component={waitFor(PaymentMethod)}
        />
        <Route
          path="/partners/payment_methods/:id"
          component={waitFor(PaymentMethods)}
        />
        <Route
          path="/partners/payment_methods"
          component={waitFor(PaymentMethods)}
        />
        <Route
          path="/appearances/main_sliders/new"
          component={waitFor(MainSlider)}
        />
        <Route
          path="/appearances/main_sliders/:id"
          component={waitFor(MainSlider)}
        />
        <Route
          path="/appearances/main_sliders"
          component={waitFor(MainSliders)}
        />
        <Route
          path="/appearances/category_widgets/new"
          component={waitFor(CategoryWidget)}
        />
        <Route
          path="/appearances/category_widgets/:id"
          component={waitFor(CategoryWidget)}
        />
        <Route
          path="/appearances/category_widgets"
          component={waitFor(CategoryWidgets)}
        />
        <Route path="/appearances/pages/new" component={waitFor(Page)} />
        <Route path="/appearances/pages/:id" component={waitFor(Page)} />
        <Route path="/appearances/pages" component={waitFor(Pages)} />
        <Route path="/admins/vouchers/new" component={waitFor(Voucher)} />
        <Route path="/admins/vouchers/:id" component={waitFor(Voucher)} />
        <Route path="/admins/vouchers" component={waitFor(Vouchers)} />
        <Route
          path="/appearances/advert_widgets/new"
          component={waitFor(AdvertWidget)}
        />
        <Route
          path="/appearances/advert_widgets/:id"
          component={waitFor(AdvertWidget)}
        />
        <Route
          path="/appearances/advert_widgets"
          component={waitFor(AdvertWidgets)}
        />
        <Route
          path="/partners/notifications"
          component={waitFor(Notifications)}
        />
        <Route path="/partners/messages" component={waitFor(Messages)} />
        <Route
          path="/admins/reports/key_metrics"
          component={waitFor(KeyMetrics)}
        />
        <Route
          path="/admins/reports/subscriber_growth"
          component={waitFor(SubscriberGrowth)}
        />
        <Route
          path="/admins/reports/partner_growth"
          component={waitFor(PartnerGrowth)}
        />
        <Route
          path="/admins/reports/partner_self_signup_growth"
          component={waitFor(PartnerSelfSignupGrowth)}
        />
        <Route
          path="/admins/reports/sales_per_vendor"
          component={waitFor(SalesPerVendor)}
        />
        <Route
          path="/admins/reports/commissions_per_vendor"
          component={waitFor(CommissionsPerVendor)}
        />
        <Route
          path="/partners/reports/account_statement"
          component={waitFor(AccountStatement)}
        />
        <Route
          path="/admins/reports/payouts_per_vendor"
          component={waitFor(PayoutsPerVendor)}
        />
        <Route path="/admins/reports/sales" component={waitFor(Sales)} />
        <Route path="/partners/reports/sales" component={waitFor(Sales)} />
        <Route exact path="/confirm_email">
          <ConfirmEmail />
        </Route>
        <Route exact path="/password_edit">
          <ConfirmEmail />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}
