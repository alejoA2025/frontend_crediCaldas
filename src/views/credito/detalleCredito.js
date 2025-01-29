import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Table,
} from "reactstrap";
import { useParams } from "react-router-dom"; // Importar useParams
import Header from "components/Headers/Header.js";
import axios from "axios";

const DetalleCredito = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID de la ruta
  const [credito, setCredito] = useState(null); // Estado para almacenar los datos del crédito
  const handlePagar = (creditoId, fecha) => {
    navigate(`/admin/abonar-cliente/${creditoId}/${fecha}`);
  };
  const handleEditar = (creditoId) => {
    navigate(`/admin/editar-credito/${creditoId}`);
  };


  // Función para obtener los datos del crédito al cargar el componente
  const fetchCredito = async () => {
    try {
      const response = await axios.get(`/api/creditos/${id}/`); // Llamar a la API
      setCredito(response.data); // Guardar los datos en el estado
    } catch (error) {
      console.error("Error al obtener los datos del crédito:", error);
      alert("Error al cargar los datos del crédito.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchCredito();
    }
  }, [id]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Detalle del Crédito</h3>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleEditar(credito.id)}
                >
                   <i className="ni ni-ruler-pencil" /> Editar
                </button>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                {credito ? (
                  <div>
                    <p><strong>Cliente:</strong> {credito.cliente.nombre_completo}</p>
                    <p><strong>Dirección:</strong> {credito.cliente.direccion}</p>
                    <p><strong>Teléfono:</strong> {credito.cliente.telefono}</p>
                    <p><strong>Prestamo:</strong> {credito.prestamo}</p>
                    <p><strong>Saldo:</strong> {credito.saldo}</p>
                    <p><strong>Forma de Pago:</strong> {credito.forma_pago}</p>
                    <p><strong>Total Cuotas:</strong> {credito.num_cuotas_pagadas} / {credito.numero_cuotas}</p>
                    <p><strong>Estado:</strong> {credito.estado}</p>
                    <p><strong>Fecha del Préstamo:</strong> {credito.fecha_prestamo}</p>

                    <h4>Cuotas</h4>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Fecha de Pago</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Valor Cancelado</th>
                          <th scope="col">Fecha Cancelada</th>
                          <th scope="col">Accion</th>
                        </tr>
                      </thead>
                      <tbody>
                      {credito.cuotas && Array.isArray(credito.cuotas) && credito.cuotas.length > 0 ? (
                          credito.cuotas
                            .sort((a, b) => a.num_cuotas - b.num_cuotas) // Ordenar de menor a mayor por num_cuotas
                            .map((cuota, index) => (
                              <tr key={index}>
                                <td>{cuota.num_cuotas}</td> {/* Número de la cuota */}
                                <td>{cuota.fecha_pago || "N/A"}</td>
                                <td>{cuota.valor || "N/A"}</td>
                                <td>{cuota.valor_cancelado || "N/A"}</td>
                                <td>{cuota.fecha_pagada || "No pagada"}</td>
                                <td>
                                  {cuota?.estado !== "cancelado" && (
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handlePagar(credito.id, cuota.fecha_pago)}
                                      style={{ marginRight: "5px" }}
                                    >
                                      <i className="ni ni-fat-add" /> Pagar
                                    </button>
                                  )}
                                </td>
                              </tr>
                              
                            ))
                              
                            
                        ) : (
                          <tr>
                            <td colSpan="5">No hay cuotas disponibles.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p>Cargando datos...</p>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default DetalleCredito;
