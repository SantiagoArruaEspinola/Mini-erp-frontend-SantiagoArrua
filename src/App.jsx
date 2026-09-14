
import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();

      if (data.accessToken) {
        setToken(data.accessToken);
        fetchProducts(data.accessToken);
      } else {
        setError('No se pudo iniciar sesión');
      }

    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (accessToken) => {
    try {
      const response = await fetch(
        'https://dummyjson.com/products?limit=5',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();

      setProducts(data.products);

    } catch (err) {
      setError('No se pudieron cargar los productos');
    }
  };

  const cerrarSesion = () => {
    setToken(null);
    setProducts([]);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif'
      }}
    >
      <h1>Mini ERP - Gestión de Productos</h1>

      {!token ? (
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '320px',
            margin: '0 auto'
          }}
        >
          <h3>Iniciar Sesión</h3>

          <input
            type="text"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {error && (
            <p style={{ color: 'red' }}>
              {error}
            </p>
          )}
        </form>
      ) : (
        <div>
          <h3>Lista de Productos del ERP</h3>

          {products.length === 0 ? (
            <p>Cargando productos...</p>
          ) : (
            <ul
              style={{
                textAlign: 'left',
                maxWidth: '500px',
                margin: '0 auto 20px auto'
              }}
            >
              {products.map((p) => (
                <li
                  key={p.id}
                  style={{
                    marginBottom: '10px'
                  }}
                >
                  <strong>{p.title}</strong>
                  {' - '}
                  ${p.price}
                </li>
              ))}
            </ul>
          )}

          <button onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
