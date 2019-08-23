const express = require('express');

const server = new express();

const projects = [
  { id: '1', title: 'projeto 1', tasks: [] },
  { id: '2', title: 'projeto 2', tasks: [] },
  { id: '3', title: 'projeto 3', tasks: [] }
];

server.use(express.json());

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const newProject = { id: '' + id, title: '' + title, tasks: [] };
  projects.push(newProject);

  return res.json(newProject);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', (req, res) => {
  let projectTitle;

  projects.map(el => {
    if (el.id == req.params.id) {
      projectTitle = el.title;
    }
  });

  return res.json(projectTitle);
});

//DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', (req, res) => {
  const { projectId } = req.params;

  projects.map(el => {
    if (el.id == projectId) {
      projects.splice(1, 1);
    }
  });

  return res.json(projects);
});

server.listen(3000);
console.log('Server Ready on port 3000');
