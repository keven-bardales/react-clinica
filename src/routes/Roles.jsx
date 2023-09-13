import { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const urlRoles = 'http://localhost:3000/api/roles';

export const Roles = () => {
  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [state, setState] = useState({
    error: null,
    success: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(urlRoles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setState({ ...state, success: responseData.message });

        setFormData({
          nombre: '',
        });

        setTimeout(() => {
          setState({ ...state, success: null });
        }, 2000);

        loadData();
      } else {
        const responseBody = await response.json();
        setState({ ...state, error: responseBody.message });
      }
    } catch (error) {
      setState({ ...state, error: 'Ha ocurrido un error' });
    }
  };

  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch(urlRoles);
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {state.error ? (
        <div className="notificacion error">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="notificacion success">{state.success}</div>
      ) : null}

      <h1>Roles</h1>
      <Form onSubmit={handleSubmit} className="py-5">
        <Form.Group className="mt-2">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </Form.Group>

        <Button className="mt-5" variant="primary" type="submit">
          Enviar Datos
        </Button>
      </Form>

      <h1>Reporte</h1>
      {data.length === 0 && (
        <div>
          <span style={{ color: 'black' }}>No hay datos</span>
        </div>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Roles;
