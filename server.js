import { app } from "./app.js";

//Server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("App listening at PORT", port);
});
