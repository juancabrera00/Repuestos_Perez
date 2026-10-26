import app from "./app.js";

const puerto = Number(process.env.PORT || 3000);

app.listen(puerto, () => {
  console.log(`API en http://localhost:${puerto}`);
});
