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
      console.log("get vreditos",data);
      setCreditos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getCuota = async (id) => {
    try {

      const { data } = await axios.get(`/api/cuotas/${id}/`);
      console.log("get vreditos",data);
      setCuota(data);
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
  const handlePendiente = async (cuotas) => {
   
    try {
      const storedDate = localStorage.getItem("fecha");
      if (!storedDate) {
        console.error("No hay fecha almacenada en el localStorage.");
        return;
      }
  
      // Buscar la cuota con fecha_pago igual a la fecha en localStorage
      const cuotaPendiente = cuotas.find((cuota) => cuota.fecha_pago === storedDate);
      
      if (!cuotaPendiente) {
        console.error("No se encontró una cuota con la fecha especificada.");
        return;
      }

        const url = cuotaPendiente.url;
        const idString = url.split('/').filter(Boolean).pop(); // Extrae el ID como cadena
        const idNumber = parseInt(idString, 10);
        await getCuota(idNumber)
        setCuota((prevState) => ({
          ...prevState,
          estado: 'pendiente',
        }));
        console.log('set vuota', cuota)
        
      // Crear el objeto de actualización
     
      // Hacer la solicitud PUT
      const response = await axios.put(`/api/cuotas/${idNumber}/editar-pendiente/`, cuota);
      console.log("Cuota actualizada:", response.data);
      
      // Mensaje de éxito
      alert("La cuota ha sido marcada como pendiente.");
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
                    <th scope="col">Nombre</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Barrio</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredcreditos
                  .slice(firstIndex, lastIndex)
                  .map((credito) => (
                    <tr key={credito.cliente.id}>
                      <td>{credito.cliente.nombre_completo}</td>
                      <td>{credito.cliente.telefono}</td>
                      <td>{credito.cliente.barrio}</td>
                      <td>{credito.cliente.direccion || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handlePagar(credito.id)} // Navega al abonar cuota
                        >
                          Pagar
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handleCredito(credito.id)} // Navega al detalle de crédito
                        >
                          Crédito
                        </button>
                        <button
                        className="btn btn-danger btn-sm"
                        style={{ marginRight: "5px" }}
                          onClick={() => handlePendiente(credito.cuotas)} // Navega al detalle de crédito
                        >
                          Pendiente
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListaCobrar;
