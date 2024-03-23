/*!

=========================================================
* BLK Design System React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";
import UserNavbar from "components/Navbars/UserNavbar.js";

export default function Index() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("index-page");

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };


  }, []);
  return (
    <>
      {isLoggedIn ? <UserNavbar /> : <IndexNavbar />}
      <div className="wrapper">
        <PageHeader />
        <Footer />
      </div>
    </>
  );
}
