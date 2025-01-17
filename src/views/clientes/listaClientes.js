import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const ListaClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual



  // Obtener la lista de clientes
  const getClientes = async () => {
    try {
      const { data } = await axios.get("api/clientes/");
      setClientes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getClientes();
  }, []);

  // Filtrar los clientes según el término de búsqueda
  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente)
      .map((value) => (value ? value.toString().toLowerCase() : "")) // Asegura que no haya valores undefined
      .join(" ")
      .includes(searchTerm.toLowerCase())
  );

  // Funciones de acción
  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      console.log(`Cliente con ID ${id} eliminado`);
    }
  };

  const handleCredito = (id) => {
    navigate(`/admin/crear-credito/${id}`);
  };

  const handleVer = async (id) => {
    
    try {

      const { data } = await axios.get(`api/creditos/creditoPorCliente/?cliente_id=${id}`);
      id = data[0]
      navigate(`/admin/detalle-credito/${id}`);
;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditar = (id) => {
    console.log(`Editando cliente con ID ${id}`);
    navigate(`/admin/editar-cliente/${id}`);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de Clientes</h3>
                <input
                  type="text"
                  placeholder="Buscar cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"># </th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Barrio</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes
                    .sort((a, b) => (a.num_ruta || 0) - (b.num_ruta || 0)) // Ordenar por num_ruta
                    .slice() // Paginación
                    .map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.num_ruta || "N/A"}</td>
                        <td>{cliente.nombre_completo}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.barrio}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(cliente.id)}
                            style={{ marginRight: "5px" }}
                          >
                            <i className="ni ni-fat-remove" />
                          </button>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleVer(cliente.id)}
                            style={{ marginRight: "5px" }}
                          >
                            <i className="ni ni-single-02" /> Ver
                          </button>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEditar(cliente.id)}
                          >
                            <i className="ni ni-ruler-pencil" /> Editar
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleCredito(cliente.id)}
                            style={{ marginRight: "5px" }}
                          >
                            <i className="ni ni-fat-add" /> Credito
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListaClientes;
