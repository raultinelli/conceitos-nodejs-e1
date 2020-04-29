const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function getRepo(id) {
  return repositories.findIndex((repo) => repo.id === id);
}

function repoValidate(request, response, next) {
  const repo = getRepo(request.params.id);

  if (repo < 0)
    return response.status(400).json({ error: "Repository not found" });

  return next();
}

app.use("/repositories/:id", repoValidate);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const repoGet = getRepo(request.params.id);
  const { title, url, techs } = request.body;

  const repo = repositories[repoGet];
  repositories[repoGet] = {
    id: repo.id,
    title,
    url,
    techs,
    likes: repo.likes,
  };

  return response.json(repositories[repoGet]);
});

app.delete("/repositories/:id", (request, response) => {
  const repoGet = getRepo(request.params.id);
  repositories.splice(repoGet, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const repoGet = getRepo(request.params.id);
  repositories[repoGet].likes++;
  return response.json(repositories[repoGet]);
});

module.exports = app;
