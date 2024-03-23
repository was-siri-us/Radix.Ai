// /*!

// =========================================================
// * BLK Design System React - v1.2.2
// =========================================================

// * Product Page: https://www.creative-tim.com/product/blk-design-system-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
// import React, { useState } from "react";
// import classnames from "classnames";
// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// // reactstrap components
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   CardImg,
//   CardTitle,
//   Label,
//   FormGroup,
//   Form,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Container,
//   Row,
//   Col,
// } from "reactstrap";

// // core components
// import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
// import Footer from "components/Footer/Footer.js";

// export default function RegisterPage() {
//   const [squares1to6, setSquares1to6] = React.useState("");
//   const [squares7and8, setSquares7and8] = React.useState("");
//   const [fullNameFocus, setFullNameFocus] = React.useState(false);
//   const [emailFocus, setEmailFocus] = React.useState(false);
//   const [passwordFocus, setPasswordFocus] = React.useState(false);

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   React.useEffect(() => {
//     document.body.classList.toggle("register-page");
//     document.documentElement.addEventListener("mousemove", followCursor);
//     // Specify how to clean up after this effect:
//     return function cleanup() {
//       document.body.classList.toggle("register-page");
//       document.documentElement.removeEventListener("mousemove", followCursor);
//     };
//   }, []);

//   const followCursor = (event) => {
//     let posX = event.clientX - window.innerWidth / 2;
//     let posY = event.clientY - window.innerWidth / 6;
//     setSquares1to6(
//       "perspective(500px) rotateY(" +
//       posX * 0.05 +
//       "deg) rotateX(" +
//       posY * -0.05 +
//       "deg)"
//     );
//     setSquares7and8(
//       "perspective(500px) rotateY(" +
//       posX * 0.02 +
//       "deg) rotateX(" +
//       posY * -0.02 +
//       "deg)"
//     );
//   };

//   const navigate = useNavigate()

//   async function registerUser() {
//     fetch(process.env.REACT_APP_HOST + "/register", {
//       method: 'POST',
//       headers: { 'Content-type': 'application/json' },
//       body: JSON.stringify({
//         name,
//         email,
//         password,
//       })
//     }).then(res => res.json())
//       .then(data => {
//         if (data.status === 'user created') {
//           alert('User created successfully');
//           navigate('/login');
//         }
//         else {
//           alert('Something went wrong');
//         }
//       });

//   }


//   return (
//     <>
//       <ExamplesNavbar />
//       <div className="wrapper">
//         <div className="page-header">
//           <div className="page-header-image" />
//           <div className="content">
//             <Container>
//               <Row>
//                 <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
//                   <div
//                     className="square square-7"
//                     id="square7"
//                     style={{ transform: squares7and8 }}
//                   />
//                   <div
//                     className="square square-8"
//                     id="square8"
//                     style={{ transform: squares7and8 }}
//                   />
//                   <Card className="card-register">
//                     <CardHeader>
//                       <CardImg
//                         alt="..."
//                         src={require("assets/img/square-purple-1.png")}
//                       />
//                       <CardTitle tag="h4">Sign Up</CardTitle>
//                     </CardHeader>
//                     <CardBody>
//                       <Form className="form" onClick={registerUser}>
//                         <InputGroup
//                           className={classnames({
//                             "input-group-focus": fullNameFocus,
//                           })}
//                         >
//                           <InputGroupAddon addonType="prepend">
//                             <InputGroupText>
//                               <i className="tim-icons icon-single-02" />
//                             </InputGroupText>
//                           </InputGroupAddon>
//                           <Input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Full Name"
//                             type="text"
//                             onFocus={(e) => setFullNameFocus(true)}
//                             onBlur={(e) => setFullNameFocus(false)}
//                           />
//                         </InputGroup>
//                         <InputGroup
//                           className={classnames({
//                             "input-group-focus": emailFocus,
//                           })}
//                         >
//                           <InputGroupAddon addonType="prepend">
//                             <InputGroupText>
//                               <i className="tim-icons icon-email-85" />
//                             </InputGroupText>
//                           </InputGroupAddon>
//                           <Input
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Email"
//                             type="text"
//                             onFocus={(e) => setEmailFocus(true)}
//                             onBlur={(e) => setEmailFocus(false)}
//                           />
//                         </InputGroup>
//                         <InputGroup
//                           className={classnames({
//                             "input-group-focus": passwordFocus,
//                           })}
//                         >
//                           <InputGroupAddon addonType="prepend">
//                             <InputGroupText>
//                               <i className="tim-icons icon-lock-circle" />
//                             </InputGroupText>
//                           </InputGroupAddon>
//                           <Input
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Password"
//                             type="text"
//                             onFocus={(e) => setPasswordFocus(true)}
//                             onBlur={(e) => setPasswordFocus(false)}
//                           />
//                         </InputGroup>
//                         <FormGroup check className="text-left">
//                           <Label check>
//                             <Input type="checkbox" />
//                             <span className="form-check-sign" />I agree to the{" "}
//                             <a
//                               href="#pablo"
//                               onClick={(e) => e.preventDefault()}
//                             >
//                               terms and conditions
//                             </a>
//                             .
//                           </Label>
//                         </FormGroup>
//                       </Form>
//                     </CardBody>
//                     <CardFooter>
//                       <Button className="btn-round" color="primary" size="lg">
//                         Register
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 </Col>
//               </Row>
//               <div className="register-bg" />
//               <div
//                 className="square square-1"
//                 id="square1"
//                 style={{ transform: squares1to6 }}
//               />
//               <div
//                 className="square square-2"
//                 id="square2"
//                 style={{ transform: squares1to6 }}
//               />
//               <div
//                 className="square square-3"
//                 id="square3"
//                 style={{ transform: squares1to6 }}
//               />
//               <div
//                 className="square square-4"
//                 id="square4"
//                 style={{ transform: squares1to6 }}
//               />
//               <div
//                 className="square square-5"
//                 id="square5"
//                 style={{ transform: squares1to6 }}
//               />
//               <div
//                 className="square square-6"
//                 id="square6"
//                 style={{ transform: squares1to6 }}
//               />
//             </Container>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";

export default function RegisterPage() {
  const [squares1to6, setSquares1to6] = useState("");
  const [squares7and8, setSquares7and8] = useState("");
  const [fullNameFocus, setFullNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    return () => {
      document.body.classList.remove("register-page");
      document.documentElement.removeEventListener("mousemove", followCursor);
    };
  }, []);

  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;
    setSquares1to6(
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)"
    );
    setSquares7and8(
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)"
    );
  };

  const registerUser = (e) => {

    console.log(process.env.REACT_APP_HOST);

    e.preventDefault();
    fetch(process.env.REACT_APP_HOST + "/register", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
      })
    })
      .then(res => res.text()) // Read response as text
      .then(data => {
        console.log("Response from server:", data); // Log the response
        try {
          const parsedData = JSON.parse(data); // Attempt to parse JSON
          if (parsedData.status === 'user created') {
            alert('User created successfully');
            navigate('/login');
          } else {
            alert('Something went wrong');
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert('Error parsing JSON data from server');
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert('Error fetching data from server');
      });
  }


  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div
                    className="square square-7"
                    id="square7"
                    style={{ transform: squares7and8 }}
                  />
                  <div
                    className="square square-8"
                    id="square8"
                    style={{ transform: squares7and8 }}
                  />
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("assets/img/square-purple-1.png")}
                      />
                      <CardTitle tag="h4">Sign Up</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form className="form" onSubmit={registerUser}>
                        <InputGroup
                          className={classnames({
                            "input-group-focus": fullNameFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            type="text"
                            onFocus={() => setFullNameFocus(true)}
                            onBlur={() => setFullNameFocus(false)}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            "input-group-focus": emailFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            "input-group-focus": passwordFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-lock-circle" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                          />
                        </InputGroup>
                        <FormGroup check className="text-left">
                          <Label check>
                            <Input type="checkbox" id="terms" />
                            <span className="form-check-sign" />I agree to the{" "}
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              terms and conditions
                            </a>
                            .
                          </Label>
                        </FormGroup>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button className="btn-round" color="primary" size="lg" onClick={registerUser}>
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
              <div className="register-bg" />
              <div
                className="square square-1"
                id="square1"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-2"
                id="square2"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-3"
                id="square3"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-4"
                id="square4"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-5"
                id="square5"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-6"
                id="square6"
                style={{ transform: squares1to6 }}
              />
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
