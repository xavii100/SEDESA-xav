import { useState, useEffect } from "react";
import axios from "axios";
import List from "./List";

function Csintoma() {
  const [isExpanded, setExpanded] = useState(false);
  const [rows, setRows] = useState(1);

  const [tests, setNewTests] = useState(null);
  const [formTest, setFormTest] = useState({
    nombre: "",
    abreviatura: "",
  });
  useEffect(() => {
    getTests();
  }, []);

  function getTests() {
    axios({
      method: "GET",
      url: "/triage/test/",
    })
      .then((response) => {
        const data = response.data;
        setNewTests(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function createTest(event) {
    axios({
      method: "POST",
      url: "/triage/test/",
      data: {
        nombre: formTest.nombre,
        abreviatura: formTest.abreviatura,
      },
    }).then((response) => {
      getTests();
    });

    setFormTest({
      nombre: "",
      abreviatura: "",
    });

    event.preventDefault();
  }

  function deleteTest(id) {
    axios({
      method: "DELETE",
      url: `/triage/test/${id}/`,
    }).then((response) => {
      getTests();
    });
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setFormTest((prevTest) => ({
      ...prevTest,
      [name]: value,
    }));
  }

  function TestShow() {
    setExpanded(true);
    setRows(3);
  }

  return (
    <div className="">
      <form className="create-test">
        {isExpanded && (
          <input
            onChange={handleChange}
            text={formTest.nombre}
            name="nombre"
            placeholder="Title"
            value={formTest.nombre}
          />
        )}
        <textarea
          onClick={TestShow}
          onChange={handleChange}
          name="abreviatura"
          placeholder="Take a Csintoma..."
          rows={rows}
          value={formTest.abreviatura}
        />
        {isExpanded && (
          <button onClick={createTest}>{/* <AddIcon /> */}Save</button>
        )}
      </form>

      {tests &&
        tests.map((Csintoma) => (
          <List
            key={Csintoma.csintoma_id}
            id={Csintoma.csintoma_id}
            nombre={Csintoma.nombre}
            abreviatura={Csintoma.abreviatura}
            deletion={deleteTest}
          />
        ))}
    </div>
  );
}

export default Csintoma;
