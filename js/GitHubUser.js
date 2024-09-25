export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;
    return fetch(endpoint) // fecht faz a chamada da api
      .then((data) => data.json()) // ele é uma promessa, quando retorna esse dado ele vai trazer um objeto json
      .then(({ login, name, public_repos, followers }) => ({ // aqui é desestruturação do objeto json, onde eu pego somente o que eu preciso
        login,
        name,
        public_repos,
        followers,
      }));
  }
}
