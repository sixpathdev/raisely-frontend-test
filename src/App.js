import React, { useState } from "react";
import axios from "axios";
import "./Raisely.css";

const App = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const verifyMailExists = async () => {
    try {
      const verifyMail = JSON.stringify({
        campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
        data: { email: email },
      });

      const checkMailRequest = await axios.post(
        "https://api.raisely.com/v3/check-user",
        verifyMail,
        { headers: { "Content-Type": "application/json" } }
      );

      if (checkMailRequest.data.data.status.toLowerCase() === "exists") {
        setError(true);
        setStatus("choose a new email address");
        // document.getElementById("#alert").style.display = "block";
      } else if (checkMailRequest.data.data.status.toLowerCase() === "ok") {
        setError(false);
        // document.getElementById("#alert").style.display = "none";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = JSON.stringify({
      campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
      data: {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
      },
    });

    if (firstname === "" || lastname === "" || password === "" || email === "") {
      setError(true);
      setStatus("All fields are required");
    } else {

      try {
        const signupRequest = await axios.post(
          "https://api.raisely.com/v3/signup",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        const responseData = signupRequest.data
        setStatus(responseData.data.status.toLowerCase())
        setMessage(responseData.message);
        setTimeout(function () {
          setStatus("")
          setMessage("")
        }, 4000)
      } catch (error) {
        console.error(error);
        alert('An error occured')
      }
    }
  };

  return (
    <div className="form_container">
      <div id="error" className={error === true ? "error_alert" : ""}>
        {error === true ? status : ""}
      </div>
      <div id="success" className={status === "active" ? "success_alert" : ""}>
        {status === 'active' ? message:''}
      </div>
      <form method="POST" onSubmit={submitForm}>
        <div className="form_group">
          <label htmlFor="firstname">First Name</label>
          <input
            onChange={(e) => setFirstname(e.target.value)}
            type="text"
            id="firstname"
            value={firstname}
            placeholder="First Name"
          />
        </div>
        <div className="form_group">
          <label htmlFor="lastname">Last Name</label>
          <input
            onChange={(e) => setLastname(e.target.value)}
            type="text"
            id="lastname"
            value={lastname}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="form_group">
          <label htmlFor="email">Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            onBlur={verifyMailExists}
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            required
          />
        </div>
        <div className="form_group">
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            onBlur={verifyMailExists}
            type="password"
            value={password}
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default App;
