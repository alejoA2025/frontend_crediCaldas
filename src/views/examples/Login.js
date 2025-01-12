// Login.js
import React, { useState } from 'react';
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/userContext.js"; // Asegúrate de importar correctamente
import AlertModal from '../../components/Alert/AlertModal.js'; // Si necesitas mostrar alertas

const Login = () => {
  const [username, setUsername] = useState(""); // Guardar el nombre de usuario
  const [password, setPassword] = useState(""); // Guardar la contraseña
  const navigate = useNavigate();
  const { setUserJson, setIsLoggendIn } = useAuth(); // Acceder al contexto de autenticación
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const postData = async () => {
    try {
      const response = await axios.post("token/", {
        username,
        password,
      });
      
      const { access, user } = response.data;
      console.log("response",response)
      localStorage.setItem("token", access);
      localStorage.setItem("User", JSON.stringify(user));
      localStorage.setItem("isLogin", true);
      
      setIsLoggendIn(true);
      setUserJson(user);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      navigate("/admin/index"); // Redirigir al dashboard
    } catch (error) {
      setShowAlert(true);
      setAlertType(error.response.data.status);
      setAlertMessage(error.response.data.message);
    }
  };

  // Ver y ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Inicio de sesión</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      <i className={`ni ${showPassword ? 'ni-lock-open' : 'ni-lock-circle-open'}`} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {/* <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div> */}
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={postData}>
                Inicio de sesión
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>

      {/* Modal de Alerta (opcional) */}
      {showAlert && (
        <AlertModal
          type={alertType}
          message={alertMessage}
          handleClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default Login;
