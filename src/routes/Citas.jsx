

import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const url = "http://localhost:3000/api/citas";
const urlDoctores = "http://localhost:3000/api/doctores";
const urlEstados = "http://localhost:3000/api/estados";


export const Citas = () => {
  const [formData, setFormData] = useState({
    id: '',
    fecha_hora: '',
    doctor_id: '',
    paciente_id: '',
    estado_id: '',
    google_calendar_event_id: '',
    ubicacion: '',
    descripcion: '',
    notas: ''
  });

  const [state, setState] = useState({
    error: null,
    success: null,
    citas: []
  });

  const resetFormData = () => {
    setFormData({
      id: '',
      fecha_hora: '',
      doctor_id: '',
      paciente_id: '',
      estado_id: '',
      google_calendar_event_id: '',
      ubicacion: '',
      descripcion: '',
      notas: ''
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const enviarDatos = async (event) => {
    event.preventDefault();
    if (formData.id) {
      await enviarDataPUT();
    } else {
      await enviarDataPost();
    }
  };

  const [doctores, setDoctores] = useState([]);
  const [estados, setEstados] = useState([]);

  const enviarDataPost = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.exito) {
          setState(prev => ({ ...prev, success: "Cita creada exitosamente" }));
          getCitas();
        }
      } else {
        setState(prev => ({ ...prev, error: "Error al crear la cita" }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error al enviar datos" }));
    }
  }

  const enviarDataPUT = async () => {
    try {
      const response = await fetch(`${url}/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.exito) {
          setState(prev => ({ ...prev, success: "Cita actualizada exitosamente" }));
          getCitas();
          resetFormData();
        }
      } else {
        setState(prev => ({ ...prev, error: "Error al actualizar la cita" }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error al actualizar datos" }));
    }
  }

  const getCitas = async () => {
    try {
      const response = await fetch(url);
      const responseData = await response.json();
      if (response.ok && responseData.exito) {
        setState(prev => ({ ...prev, citas: responseData.item_cita }));
      } else {
        setState(prev => ({ ...prev, error: "Error al obtener las citas" }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error al obtener citas" }));
    }
  };

  const eliminarCita = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.exito) {
          setState(prev => ({ ...prev, success: "Cita eliminada exitosamente" }));
          getCitas();
        }
      } else {
        setState(prev => ({ ...prev, error: "Error al eliminar la cita" }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error al eliminar cita" }));
    }
  }

  const actualizarFormulario = (cita) => {
    resetFormData();
    setFormData(cita);
  }

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const response = await fetch(urlDoctores);
        const data = await response.json();
        setDoctores(data);
      } catch (error) {
        console.error("Error obteniendo doctores:", error);
      }
    };

    const fetchEstados = async () => {
      try {
        const response = await fetch(urlEstados);
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error("Error obteniendo estados:", error);
      }
    };
    fetchDoctores();
    fetchEstados();
    getCitas();

  }, []);

  return (
    <>
    
    <h2 className=" col-md-8 mx-auto">Registro de Citas</h2>
      <div className="container mt-2">
        <div className="card-body col-md-8 mx-auto">
          <Form onSubmit={enviarDatos}>
            {state.error && <div className="notificacion error">{state.error}</div>}
            {state.success && <div className="notificacion success">{state.success}</div>}
            
            <Form.Group>
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fecha_hora"
                value={formData.fecha_hora}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
          <Form.Label>ID Doctor</Form.Label>
          <Form.Control as="select" name='doctor_id' value={formData.doctor_id} onChange={handleInputChange} required>
            <option value=''>Seleccione un doctor</option>
            {doctores.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}
          </Form.Control>
        </Form.Group>


            <Form.Group>
              <Form.Label>ID Paciente</Form.Label>
              <Form.Control
                type="number"
                name="paciente_id"
                value={formData.paciente_id}
                onChange={handleInputChange}
                placeholder="Ingresa el ID del paciente"
              />
            </Form.Group>

            <Form.Group>
          <Form.Label>ID Estado</Form.Label>
          <Form.Control as="select" name='estado_id' value={formData.estado_id} onChange={handleInputChange} required>
            <option value=''>Seleccione un estado</option>
            {estados.map(estado => <option key={estado.id} value={estado.id}>{estado.estado}</option>)}
          </Form.Control>
        </Form.Group>
        
        {/* <Form.Group>
              <Form.Label>ID Estado</Form.Label>
              <Form.Control
                type="number"
                name="estado_id"
                value={formData.estado_id}
                onChange={handleInputChange}
                placeholder="Ingresa el ID del estado"
              />
            </Form.Group> */}

            <Form.Group>
              <Form.Label>ID Evento de Google Calendar</Form.Label>
              <Form.Control
                type="text"
                name="google_calendar_event_id"
                value={formData.google_calendar_event_id || ''}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion"
                value={formData.ubicacion || ''}
                onChange={handleInputChange}
                placeholder="Ingresa la ubicación"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleInputChange}
                placeholder="Ingresa la descripción"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notas"
                value={formData.notas || ''}
                onChange={handleInputChange}
                placeholder="Agrega cualquier nota relevante"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant='primary' type='submit'>Enviar Datos</Button>
            </div>
          </Form>
        </div>

        <div className="row ">
          <div className="col-md-12">
            <h1 className="mb-4">Reporte de Citas</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha y Hora</th>
                  <th>ID Doctor</th>
                  <th>ID Paciente</th>
                  <th>Estado</th>
                  <th>ID Google Calendar</th>
                  <th>Ubicación</th>
                  <th>Descripción</th>
                  <th>Notas</th>
                  <th colSpan={2}>Accion</th>
                </tr>
              </thead>
              <tbody>
                {state.citas.map(cita => (
                  <tr key={cita.id}>
                    <td>{cita.id}</td>
                    <td>{cita.fecha_hora}</td>
                    <td>{cita.doctor_id}</td>
                    <td>{cita.paciente_id}</td>
                    <td>{cita.estado_id}</td>
                    <td>{cita.google_calendar_event_id}</td>
                    <td>{cita.ubicacion}</td>
                    <td>{cita.descripcion}</td>
                    <td>{cita.notas}</td>
                    <td>
                      <button onClick={() => actualizarFormulario(cita)}>Actualizar</button>
                     
                    </td>
                    <td>
                     
                      <button onClick={() => eliminarCita(cita.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
    
     </div>
     </>
);

}
export default Citas;

