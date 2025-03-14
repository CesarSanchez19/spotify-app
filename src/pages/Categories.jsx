// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Alert } from '@mui/material';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    // Se simula la respuesta de la API con datos de ejemplo
    const dummyData = [
      { id: '1', name: 'Pop' },
      { id: '2', name: 'Rock' },
      { id: '3', name: 'Hip Hop' },
      { id: '4', name: 'Jazz' },
      { id: '5', name: 'Electronic' },
    ];
    setCategories(dummyData);
    setError(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Categorías
      </Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{category.name}</Typography>
                <Button variant="outlined" sx={{ mt: 1 }}>
                  Ver más
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Categories;
