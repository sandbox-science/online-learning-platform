import React, { useEffect, useState } from 'react';

export function HealthCheck() {
  const [health, setHealth] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:4000/health');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHealth();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Health Status: {health ? JSON.stringify(health) : 'Loading...'}</div>;
};
