// src/pages/Audiobooks.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, Alert } from '@mui/material';

const Audiobooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audiobooks, setAudiobooks] = useState([]);
  const [error, setError] = useState(null);

  const searchAudiobooks = async () => {
    if (!searchTerm) return;
    // Se simula la búsqueda con datos de ejemplo (dummy)
    const dummyData = [
      {
        id: '1',
        name: 'Audiolibro Ejemplo 1',
        images: [{ url: 'https://via.placeholder.com/300x200?text=Audiolibro+1' }],
      },
      {
        id: '2',
        name: 'Audiolibro Ejemplo 2',
        images: [{ url: 'https://via.placeholder.com/300x200?text=Audiolibro+2' }],
      },
      {
        id: '3',
        name: 'Audiolibro Ejemplo 3',
        images: [{ url: 'https://via.placeholder.com/300x200?text=Audiolibro+3' }],
      },
    ];
    setAudiobooks(dummyData);
    setError(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buscar Audiolibros
      </Typography>
      <TextField
        label="Buscar Audiolibro"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={searchAudiobooks} sx={{ mt: 2 }}>
        Buscar
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {audiobooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.name}</Typography>
                {book.images && book.images[0] && (
                  <img
                    src={book.images[0].url}
                    alt={book.name}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Audiobooks;
