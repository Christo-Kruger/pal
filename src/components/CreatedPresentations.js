import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PresentationList() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/presentations');
        setPresentations(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>All Presentations</h1>
      {presentations.length === 0 ? (
        <div>No presentations found</div>
      ) : (
        presentations.map(presentation => (
          <div key={presentation._id}>
            <h2>{presentation.name}</h2>
            <p>{presentation.description}</p>
            <p>Location: {presentation.location}</p>
            <p>Date: {new Date(presentation.date).toLocaleDateString()}</p>
            <p>Time: {presentation.time}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PresentationList;


