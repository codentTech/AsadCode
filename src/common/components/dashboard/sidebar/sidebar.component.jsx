"use client";

import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import CategoriesIcon from "@/common/icons/sidebar/administrations/categories.icon";
import CustomerIcon from "@/common/icons/sidebar/administrations/customer.icon";
import ProductIcon from "@/common/icons/sidebar/administrations/products.icon";
import DashboardIcon from "@/common/icons/sidebar/dashboard.icon";
import DeliveryNotesIcon from "@/common/icons/sidebar/documents/delivery-notes.icon";
import InvoiceIcon from "@/common/icons/sidebar/documents/invoice.icon";
import OfferIcon from "@/common/icons/sidebar/documents/offer.icon";
import OrderIcon from "@/common/icons/sidebar/documents/order.icon";
import ExpendituresIcon from "@/common/icons/sidebar/expenses/expenditures.icon";
import GeneralIcon from "@/common/icons/sidebar/settings/general.icon";
import DocumentSettingIcon from "@/common/icons/sidebar/settings/settings.icon";
import { setSidebarToggleItem } from "@/provider/features/auth/auth.slice";
import CreditNotesIcon from "@/common/icons/sidebar/documents/credit-notes.icon";
import creditNotesConfig from "@/provider/features/credit-note/credit-note.config";

const sidebarLinks = [
  {
    label: "Dashboard",
    icon: <DashboardIcon className="" />,
    href: "/dashboard",
  },
  {
    label: "Documents",
    icon: null,
    subLinks: [
      { label: "Offer", icon: <OfferIcon />, href: "/offer/view" },
      { label: "Order", icon: <OrderIcon />, href: "/order/view" },
      {
        label: "Delivery Notes",
        icon: <DeliveryNotesIcon />,
        href: "/delivery-notes/view",
      },
      { label: "Invoice", icon: <InvoiceIcon />, href: "/invoices/view" },
      {
        label: "Credits Notes",
        icon: <CreditNotesIcon />,
        href: creditNotesConfig.viewPageUrl,
      },
      // {
      //   label: 'Recurring Invoices',
      //   icon: <RecurringInvoiceIcon />,
      //   href: '#'
      // },
      // { label: 'Purchase Order', icon: <PurchaseOrderIcon />, href: '#' },
      // { label: 'Inquiries', icon: <InquiriesIcon />, href: '#' },
      // { label: 'Correspondence', icon: <CorrespondenceIcon />, href: '#' }
    ],
  },
  {
    label: "Administrations",
    icon: null,
    subLinks: [
      { label: "Customer", icon: <CustomerIcon />, href: "/customer" },
      { label: "Products", icon: <ProductIcon />, href: "/product" },
      {
        label: "Categories",
        icon: <CategoriesIcon />,
        href: "/category/create",
      },
      // { label: 'Business Owner', icon: <EmployeesIcon />, href: '#' },
      // { label: 'Users & Roles', icon: <UserRolesIcon />, href: '#' }
    ],
  },
  // {
  //   label: 'Employee Management',
  //   icon: null,
  //   subLinks: [{ label: 'Employees', icon: <EmployeesIcon />, href: '#' }]
  // },
  {
    label: "Expenses",
    icon: null,
    subLinks: [
      {
        label: "Expenditures",
        icon: <ExpendituresIcon />,
        href: "/expenditure",
      },
    ],
  },
  // {
  //   label: 'Cloud',
  //   icon: null,
  //   subLinks: [{ label: 'Repository', icon: <DatabaseIcon />, href: '/repository' }]
  // },
  {
    label: "Setting",
    icon: null,
    subLinks: [
      {
        label: "General Setting",
        icon: <GeneralIcon />,
        href: "/setting/general-setting",
      },
      {
        label: "Profile Setting",
        icon: <GeneralIcon />,
        href: "/setting/profile-setting",
      },
      {
        label: "Account Setting",
        icon: <ProductIcon />,
        href: "/setting/account-setting",
      },
      {
        label: "Document Setting",
        icon: <DocumentSettingIcon />,
        href: "/setting/document-setting",
      },
    ],
  },
];

export default function Sidebar({ toggle, setToggle }) {
  const router = usePathname();
  const dispatch = useDispatch();
  const settingRoute = router.includes("setting");
  const routerPath = router.split("/")[settingRoute ? 2 : 1];
  const { sidebarToggleItem } = useSelector((state) => state?.auth);
  const handleChange = (panel) => (event, sidebarToggleItem) => {
    dispatch(setSidebarToggleItem(sidebarToggleItem ? panel : false));
  };

  const [currentPath, setCurrentPath] = useState(routerPath);

  useEffect(() => {
    setCurrentPath(routerPath);
  }, [routerPath]);

  const isActive = (href) => href.includes(currentPath);

  const activeLinks = sidebarLinks
    .map((link) => {
      if (link.subLinks) {
        const activeSubLinks = link.subLinks.filter((subLink) => {
          return isActive(subLink.href);
        });
        return { ...link, subLinks: activeSubLinks };
      }
      return link;
    })
    .filter((link) => link.subLinks && link.subLinks.length > 0);

  useEffect(() => {
    dispatch(setSidebarToggleItem(activeLinks[0]?.label));
  }, []);

  return (
    <div
      className={`${
        toggle ? "open" : ""
      } offcanva fixed z-[9999] h-screen w-[273px] bg-primary-blue bg-hero-pattern bg-right-top bg-no-repeat`}
    >
      <div className="absolute right-1 top-1 z-[9999] rounded-[4px] border-[1px] border-x-secondary-light-blue xs:block semixl:hidden">
        <ChevronLeftIcon
          className="text-white"
          onClick={() => setToggle(!toggle)}
        />
      </div>
      <div className="p-6">
        <Link className="block" href="/dashboard">
          <img
            className="mx-auto block"
            src="/assets/images/sidebar/quickStepLogo.svg"
            alt="logo"
          />
        </Link>
      </div>
      <div className="multistep-wrapper flex flex-col gap-6 bg-primary-blue pl-6 pr-5">
        {sidebarLinks.map((navLink) => {
          if (navLink.subLinks) {
            return (
              <Accordion
                expanded={sidebarToggleItem === navLink.label}
                onChange={handleChange(navLink.label)}
                key={navLink.label}
                className="!before:none !m-0 !bg-primary-blue !shadow-none"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="!m-0 !h-fit !min-h-fit bg-primary-blue !px-0 !py-0"
                >
                  <div className="flex items-center gap-2">
                    {/* <ArrowIcon className="arrow-cotrol" /> */}
                    <span className="font-dm text-base leading-6 text-white">
                      {navLink.label}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="bg-primary-blue !px-0 !py-0">
                  <ul className="mt-2 flex flex-col gap-2">
                    {navLink.subLinks.map((subLink) => {
                      return (
                        <Link
                          key={subLink.label}
                          href={subLink.href}
                          className={`nav-link ${
                            subLink.href.includes(routerPath)
                              ? "nav-link-select"
                              : ""
                          } cursor-pointer rounded-md px-6 py-2`}
                        >
                          <div className="flex items-center gap-2">
                            {subLink.icon}
                            <span className="font-dm text-base leading-6 text-white">
                              {subLink.label}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </ul>
                </AccordionDetails>
              </Accordion>
            );
          } else {
            return (
              <Link
                key={navLink.label}
                href={navLink.href}
                className="mt-7 flex items-center gap-2 px-4 py-2"
              >
                {navLink.icon}
                <span className="font-dm text-sm text-white">
                  {navLink.label}
                </span>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};
