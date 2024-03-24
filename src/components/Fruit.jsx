
import React from 'react';
import blackCircle from '../blackCircle.png';

const Fruit = ({ fruit, onClick }) => {
  const style = {
    position: 'absolute',
    left: `${fruit.x}%`,
    top: `${fruit.y}%`,
    cursor: 'pointer'
  };

  return (
    <div style={style} onClick={() => onClick(fruit.id)}>
       <img src={blackCircle} alt="Fruit" />
    </div>
  );
};

export default Fruit;
