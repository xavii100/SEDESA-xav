function List(props) {
  function handleClick() {
    props.deletion(props.id);
  }
  return (
    <div className="test">
      <h1> Title: {props.nombre} </h1>
      <p> Content: {props.abreviatura}</p>
      <button onClick={handleClick}>Delete</button>
    </div>
  );
}

export default List;
