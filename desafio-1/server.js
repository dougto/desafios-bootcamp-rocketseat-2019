const express = require(express);

const server = new express();

const projects = [];

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const newProject = { id: '' + id, title: '' + title, tasks: [] };
  projects.push(newProject);

  return res.json(newProject);
});
