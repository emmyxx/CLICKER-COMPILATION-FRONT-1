import React, { useEffect, useState } from 'react';

// Inclure l'emoji crotte dans la liste avec une certaine probabilité
const fruitEmojis = ['🍒', '🍒', '🍒', '🍒', '💩']; // Exemple : 1 chance sur 5 d'avoir une crotte



const WebSocketComponent = () => {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [previousScores, setPreviousScores] = useState([]); 
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const wsInstance = new WebSocket("ws://localhost:8080/game");
    setWs(wsInstance);

    wsInstance.onopen = () => {
      console.log('WebSocket connected');
      wsInstance.send("Hello, game server!");
    };

    wsInstance.onmessage = (event) => {
        if(event.data.startsWith('Score: ')) { // Vérifie si le message est une mise à jour du score
          const newScore = parseInt(event.data.replace('Score: ', ''), 10);
          setScore(newScore); // Met à jour le score
        } else {
          // Traite les données de fruits comme auparavant
          const receivedFruits = event.data.split(';').filter(pair => pair).map(pair => {
            const [id, x, y, isPoop] = pair.split(',');
            let emoji = isPoop ? '💩' : fruitEmojis[Math.floor(Math.random() * (fruitEmojis.length - 1))]; // Exclut la crotte pour la sélection aléatoire
            return { id, x: parseInt(x, 10), y: parseInt(y, 10), emoji };
          });
        
          setFruits(receivedFruits);
        }
      };
  

    wsInstance.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    wsInstance.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      wsInstance.close();
    };
  }, []);

  const handleFruitClick = (fruitId) => {
    const fruit = fruits.find(fruit => fruit.id === fruitId);
    if (ws && fruit) {
      if (fruit.emoji === '💩') { // Vérifie si l'émoji cliqué est une crotte
        ws.send(`RemoveScore,${fruit.x},${fruit.y}`); // Format "RemoveScore,x,y"
      } else {
        ws.send(`${fruit.x},${fruit.y}`);
      }
    }
  };

  const rejouer = () => {
    if (ws) {
      // Mettre à jour les scores précédents avant de réinitialiser
      setPreviousScores((prev) => [...prev.slice(Math.max(prev.length - 4, 0), 5), score]);
      setScore(0);
      ws.send("Rejouer");
    }
  };
  
  

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  <div style={{ marginRight: '30px' }}>
    <h4>Scores des parties précédentes :</h4>
    {previousScores.map((score, index) => (
      <div key={index} style={{ backgroundColor: "red", 
        color: "white", 
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px", 
        cursor: "pointer", 
        fontSize: "20px", 
        margin: "10px 0", }}>
        Partie {previousScores.length - index}: {score}
      </div>
    ))}
  </div>
  
      <div style={{ flexGrow: 1, textAlign: 'center' }}>
        <h2>Clicker sur les Fruit ! 🍒</h2>
        <button onClick={rejouer} style={{
              backgroundColor: "red", 
              color: "white", 
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px", 
              cursor: "pointer", 
              fontSize: "16px", 
              margin: "10px", 
           }}>Rejouer</button>
        <p>Score: {score}</p>
        
        <div style={{ position: 'relative', width: '1050px', height: '600px', border: '1px solid black' }}>
          {fruits.map((fruit) => (
            <div key={fruit.id}
                 style={{ position: 'absolute', left: `${fruit.x}px`, top: `${fruit.y}px`, fontSize: '24px', cursor: 'pointer' }}
                 onClick={() => handleFruitClick(fruit.id)}>
              {fruit.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 };  

export default WebSocketComponent;