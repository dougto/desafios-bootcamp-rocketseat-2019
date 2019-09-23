import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import PropTypes from 'prop-types';

import {
  Loading,
  Container,
  Owner,
  IssueList,
  StateInput,
  SubmitButton,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    page: 1,
    issuesState: 'open',
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = async e => {
    const { issuesState, page } = this.state;
    const { match } = this.props;

    this.setState({ loading: true });

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issuesState,
          page: page,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  };

  handleInputChange = e => {
    this.setState({ issuesState: e.target.value });
  };

  nextPage = () => {
    const { page } = this.state;

    this.setState({ page: page + 1 });
    this.handleSubmit();
  };

  previousPage = () => {
    const { page } = this.state;

    if (page > 1) {
      this.setState({ page: page - 1 });
      this.handleSubmit();
    }
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            marginTop: '30px',
          }}
        >
          <StateInput
            type="text"
            placeholder="Filtrar por estado: all, open ou closed"
            onChange={this.handleInputChange}
          />

          <SubmitButton onClick={this.handleSubmit}>Filtrar</SubmitButton>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignContent: 'space-around',
            alignItems: 'center',
            marginTop: '30px',
          }}
        >
          {page === 1 ? (
            <div />
          ) : (
            <SubmitButton onClick={this.previousPage}>
              Voltar Página
            </SubmitButton>
          )}
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'Arial',
              width: '100%',
              textAlign: 'center',
            }}
          >
            Página {page.toString()}
          </div>
          <SubmitButton onClick={this.nextPage}>Próxima Página</SubmitButton>
        </div>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
