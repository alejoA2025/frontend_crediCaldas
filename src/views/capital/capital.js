
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";
import { useState, useEffect } from "react";
const CrearCapital= () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [user, setUser] = useState(""); 
  const [formData, setFormData] = useState({

    capital: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token desde localStorage
    const token = localStorage.getItem("token");
    console.log(token)
    // Si el token no está disponible, redirigir al usuario al inicio de sesión
   

    try {
      const dataToSend = {
        usuario: user.url,
        capital_inicial: formData.capital|| null,
        capital_prestado: 0,
        capital_cancelado: 0,
        capital_disponible: formData.capital || null,
     
      };
      console.log("Datos enviados:", dataToSend); // Para depuración

      // Realizar la solicitud POST con el token en las cabeceras
      const response = await axios.post("api/cobro/", dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar token a las cabeceras
        }
      });
      navigate(`/admin/lista-clientes`);
    

      // Reinicia el formulario
      setFormData({
        usuario: "",
        capital_inicial: "",
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error.response?.data || error);
      alert("Error al crear el cliente. Por favor, inténtelo de nuevo.");
    }
 
  };
  useEffect(() => {
    let item = localStorage.getItem('User');
    let objeto = JSON.parse(item); 
    console.log(objeto)
    setUser(objeto)
    console.log(user.url)
    
  }, []);
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Registrar Capital</h3>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="nombre_completo">
                      Capital
                    </label>
                    <Input
                      id="capital"
                      name="capital"
                      placeholder="Capital"
                      type="text"
                      value={formData.capital}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit">
                      Guardar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CrearCapital;