import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";
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

const ListaCobrar = () => {
  const [creditos, setCreditos] = useState([]); // Lista de clientes
  const [cuota, setCuota] = useState([]); // Lista de clientes
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [fecha, setFecha] = useState(localStorage.getItem("fecha") || ""); // Fecha desde localStorage o vacía
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Número de clientes por página

  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Cálculo de los índices para la paginación
  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;

  // Obtener la lista de clientes por fecha
  const getCreditos = async () => {
    try {
      const { data } = await axios.get(`/api/creditos/buscar_por_fecha/?fecha=${fecha}`);
      setCreditos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCreditos();
  }, [fecha]);

  const filteredcreditos = creditos
  .filter((credito) =>
    Object.values(credito)
      .map((value) => (value ? value.toString().toLowerCase() : "")) // Asegura que no haya valores undefined
      .join(" ")
      .includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    // Coloca los `null` al principio y luego ordena por `num_ruta` de menor a mayor
    if (a.cliente.num_ruta === null) return -1; // `a` con `null` va al principio
    if (b.cliente.num_ruta === null) return 1;  // `b` con `null` va al principio
    return a.cliente.num_ruta - b.cliente.num_ruta;     // Orden ascendente para los demás
  });



  // Guardar la fecha en localStorage
  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    localStorage.setItem("fecha", selectedDate); // Guardamos la fecha en localStorage
  };

  // Manejar clic en botón "Pagar"
  const handlePagar = (creditoId) => {
    navigate(`/admin/abonar-cuota/${creditoId}`);
  };

  const handlePendiente = async (cuota) => {
    try {
      // Crear una copia del objeto cuota y actualizar el estado a "pendiente"
      const updatedCuota = { ...cuota, estado: "pendiente" };
      // Hacer la solicitud PUT para actualizar la cuota
      const response = await axios.put(`/api/cuotas/${cuota.id}/editar-pendiente/`, updatedCuota);
      alert("La cuota ha sido marcada como pendiente.");
  
      // Volver a traer los datos actualizados
      await getCreditos();
    } catch (error) {
      console.error("Error al actualizar la cuota:", error);
      alert("Hubo un error al intentar actualizar la cuota.");
    }
  };
  

  // Manejar clic en botón "Crédito"
  const handleCredito = (creditoId) => {
    navigate(`/admin/detalle-credito/${creditoId}`);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de creditos</h3>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Buscar cliente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "5px" }}
                  />
                  <input
                    type="date"
                    value={fecha}
                    onChange={handleFechaChange} // Llamamos a la función que maneja el cambio
                    style={{ padding: "5px" }}
                  />
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"># Ruta</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">$</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Barrio</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredcreditos
                  .slice()
                  .map((credito) => (
                    <tr key={credito.cliente.id}>
                      <td>{credito.cliente.num_ruta}</td>
                      <td>
                        {credito.cliente.nombre_completo}
                        
                        </td>
                      
                      <td>
                      <button
                          className="btn btn-success btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handlePagar(credito.id)} // Navega al abonar cuota
                        >
                          Pagar
                        </button>
                      </td>
                      <td>{credito.cliente.telefono}</td>
                      <td>{credito.cliente.barrio}</td>
                      <td>{credito.cliente.direccion || "N/A"}</td>
                      <td>
                       
                        <button
                          className="btn btn-info btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handleCredito(credito.id)} // Navega al detalle de crédito
                        >
                          Crédito
                        </button>
                        {credito?.cuotas !== null && (
            <button
              className="btn btn-danger btn-sm"
              style={{ marginRight: "5px" }}
              onClick={() => handlePendiente(credito.cuotas[0])} // Marca la cuota como pendiente
            >
              Pendiente
            </button>
          )}
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

export default ListaCobrar;
