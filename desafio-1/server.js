const express = require('express');

const server = new express();

const projects = [];

const state = {
  projectFound: false,
  currentIndex: 0,
  totalRequests: 0
};

server.use(express.json());

// Middlewares:

// Confere se o projeto existe
function validateId(req, res, next) {
  const { id } = req.params;

  projects.map(el => {
    if (el.id == id) {
      state.projectFound = true;
    }
  });

  if (!state.projectFound) {
    return res.status(400).json({ error: 'Project Not Found' });
  }

  state.projectFound = false;

  return next();
}

// Incrementa a contagem de requisições feitas
function countRequests(req, res, next) {
  state.totalRequests++;
  console.log(state.totalRequests);
  return next();
}

/* 
A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro de um 
array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se 
de enviar tanto o ID quanto o título do projeto no formato string com àspas duplas.
*/
server.post('/projects', countRequests, (req, res) => {
  const { id, title, tasks } = req.body;

  const newProject = { id: '' + id, title: '' + title, tasks: tasks };
  projects.push(newProject);

  return res.json(newProject);
});

// Rota que lista todos projetos e suas tarefas;
server.get('/projects', countRequests, (req, res) => {
  return res.json(projects);
});

// A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', countRequests, validateId, (req, res) => {
  const { title } = req.body;

  projects.map(el => {
    if (el.id == req.params.id) {
      el.title = title;
      state.currentIndex = projects.indexOf(el);
    }
  });

  return res.json(projects[state.currentIndex]);
});

// A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', countRequests, validateId, (req, res) => {
  const { id } = req.params;

  projects.map(el => {
    if (el.id == id) {
      projects.splice(projects.indexOf(el), 1);
      console.log('Project Deleted Successfully');
    }
  });

  return res.json(projects);
});

/* 
A rota deve receber um campo title e armazenar uma nova tarefa no array 
de tarefas de um projeto específico escolhido através do id presente nos 
parâmetros da rota;

nota pessoal: Acho que faz muito mais sentido enviar os tasks pelo corpo
da requisição, e não pela query string. Por esse motivo, esse post apenas
receberá a id do projeto em questão na rota.
*/
server.post('/projects/:id', countRequests, validateId, (req, res) => {
  const { tasks } = req.body;
  const { id } = req.params;

  projects.map(el => {
    if (el.id == id) {
      el.tasks = tasks;
      state.currentIndex = projects.indexOf(el);
    }
  });

  return res.json(projects[state.currentIndex]);
});

server.listen(3000);
console.log('Server Ready on port 3000');
