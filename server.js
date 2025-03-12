const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
