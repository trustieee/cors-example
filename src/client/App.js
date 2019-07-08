import React, { useState } from 'react';

function App() {
  const [foo, setFoo] = useState();
  return (
    <>
      <button onClick={handleOnClick}>Foo</button> <br />
      <label>{foo || 'click the button above'}</label>
    </>
  );

  function handleOnClick(event) {
    fetch('http://localhost:3001/auth/bnet').then(function(r) {
      console.log(r);
    });
  }
}

export default App;
