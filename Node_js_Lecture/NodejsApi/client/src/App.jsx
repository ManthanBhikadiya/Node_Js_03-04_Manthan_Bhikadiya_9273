import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5670/api/users");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addUsers = async () => {
    const res = await axios.post("http://localhost:5670/api/users", {
      name,
      email,
    });

    console.log("user added successfully");

    fetchUsers();
  };

  return (
    <>
      <h1>MERN API APP</h1>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={addUsers}>Add</button>
      <ul>
        {loading || user.length === 0 ? (
          <h2>Loading... ☂</h2>
        ) : (
          user.map((u) => (
            <li key={u._id}>
              {u.name} - {u.email}
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default App;
