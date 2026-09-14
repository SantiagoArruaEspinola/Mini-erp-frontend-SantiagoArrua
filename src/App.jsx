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
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email, 
          password: password 
        }),
      });

      if (!response.ok) throw new Error('Credenciales invalidas');

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        fetchProducts();
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setToken('token-de-prueba');
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=5');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setProducts([
        { id: 1, title: 'Compu Victus pro max', price: 1200000 },
        { id: 2, title: 'Compu MSI pro 18', price: 180000 },
        { id: 3, title: 'IPhone 19 pro ultra max', price: 300000 },
      ]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Mini ERP - Gestión de Productos</h1>

      {!token ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          <h3>Iniciar Sesión</h3>
          <input 
            type="text" 
            placeholder="Email o Correo" 
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
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <div>
          <h3>Lista de Productos del ERP</h3>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            {products.map(p => (
              <li key={p.id} style={{ marginBottom: '8px' }}>
                <strong>{p.title || p.name}</strong> - ${p.price}
              </li>
            ))}
          </ul>
          <button onClick={() => { setToken(null); setProducts([]); }}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;