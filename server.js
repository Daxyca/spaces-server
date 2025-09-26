import { app } from "./app.js";

//Server
const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("App listening at PORT", PORT);
});
