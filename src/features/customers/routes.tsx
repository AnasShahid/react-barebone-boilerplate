import { CustomersPage } from "./pages/customers-page";
import { ViewCustomerPage } from "./pages/view-customer-page";

export const customersRoutes = [
  {
    path: "/customers",
    element: <CustomersPage />,
  },
  {
    path: "/customers/:id",
    element: <ViewCustomerPage />,
  },
];
