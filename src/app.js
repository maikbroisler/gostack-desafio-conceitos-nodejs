const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID!' })
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    likes: 0,
    techs: techs,
    url: url
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0){
    return response.status(404).json({ error: 'Repository not found!' })
  }

  const { likes } = repositories[repositoryIndex];

  repositories[repositoryIndex] = { id, title, url, techs, likes };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0){
    return response.status(404).json({ error: 'Repository not found!' })
  }  

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID!' })
  }

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0){
    return response.status(404).json({ error: 'Repository not found!' })
  }

  let { title, url, techs, likes } = repositories[repositoryIndex];
  
  repositories[repositoryIndex] = { id, title, url, techs, likes: likes += 1 };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
