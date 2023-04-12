import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Add Assessment", link: "/dashboard/admin-pannel", current: true },
  {
    name: "Assessment List",
    link: "/dashboard/admin-pannel/assesment-list",
    current: false,
  },
  {
    name: "Add Questions",
    link: "/dashboard/admin-pannel/upload-csv",
    current: false,
  },
  { name: "Users", link: "/dashboard/admin-pannel/users", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const [currentPath, setCurrrentPath] = useState("");
  useLocation();
  useEffect(() => {
    const handleWindowResize = () => {
      setCurrrentPath(window.location.pathname);
    };
    return handleWindowResize();
  });

  // console.log("location: ", location);
  return (
    <Disclosure as="nav" className="bg-green-300">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-end sm:justify-between ">
              <div className="hidden  sm:flex grow items-center justify-end sm:items-stretch ">
                <div className="hidden sm:ml-6 sm:block justify-end">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        className={`${
                          currentPath === item.link
                            ? "bg-gray-900 text-white"
                            : "text-gray-900 hover:bg-gray-700 hover:text-white"
                        } `}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-6 w-6 text-black font-bold"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-6 w-6 text-black"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`${
                    currentPath === item.link
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:bg-gray-700 hover:text-white"
                  }  block rounded-md px-3 py-2 text-base font-medium `}
                  // aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;