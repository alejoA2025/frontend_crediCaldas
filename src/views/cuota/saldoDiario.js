import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  CardBody,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";

const SaldoDiario = () => {
  const [saldoDiario, setSaldoDiario] = useState([]); // Lista de saldos diarios
  const [fecha, setFecha] = useState(localStorage.getItem("fecha") || ""); // Fecha desde localStorage o vacía

  // Obtener el saldo diario por fecha
  const getSaldoDiario = async () => {
    try {
      const { data } = await axios.get(`api/cuotas/saldo-dia/?fecha=${fecha}`);
      setSaldoDiario(data); // Asume que la API devuelve un array de objetos
      console.log(saldoDiario)
    } catch (error) {
      console.error("Error al obtener el saldo diario:", error);
      setSaldoDiario([]); // Reinicia el estado en caso de error
    }
  };

  useEffect(() => {
    if (fecha) {
      getSaldoDiario();
    }
  }, [fecha]);

  // Guardar la fecha en localStorage
  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    localStorage.setItem("fecha", selectedDate); // Guardamos la fecha en localStorage
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Saldo Diario</h3>
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="date"
                    value={fecha}
                    onChange={handleFechaChange} // Actualiza la fecha
                    style={{ padding: "5px" }}
                  />
                </div>
              </CardHeader>
              <CardBody>
              <p><strong>Saldo:</strong> {saldoDiario.saldoDia}</p>
              <p><strong>Fecha:</strong> {saldoDiario.fecha}</p>
              </CardBody>
              
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SaldoDiario;
