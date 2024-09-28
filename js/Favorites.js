import { GithubUser } from "./GitHubUser.js";

//classe que vai conter a lógica do dados
// como os dados serão estruturados
//class that will contain the data logic
// how the data will be structured
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = this.root.querySelector("table tbody");
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    // localStorage é um local no navegador que armazena dados do usuário, como se fosse um bando de dados
    // guarda sempre no formato key e value
    // localStorage is a location in the browser that stores user data, as if it were a database
    // always saves in key and value format
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      } else if (this.entries.find((entry) => entry.login === user.login)) {
        throw new Error("Usuário já favoritado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    // Higher-ordem function (map, filtre, find, reduce)
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    // verifica se o login que eu quero apagar é diferente dos demais da lista, se for diferente os demais vão ao novo array
    // checks if the login I want to delete is different from the others in the list, if it is different, the others go to the new array
    this.entries = filteredEntries;
    // após o filtro entries recebe um novo array no caso filteredEntries
    // after the entries filter receives a new array in the filteredEntries case// after the entries filter receives a new array in the filteredEntries case
    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root); // super vai chamar o construtor da classe 'Favorites'  // super will call the constructor of the 'Favorites' class
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
      this.root.querySelector(".search input").value = "";
    };
  }

  update() {
    this.removeAllTr();
    if (this.entries.length == 0) {
      this.tbody.append(this.createRowZero());
    }

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        //remove the element (tr) i.e. the line in the case of the click event
        //remove o elemento (tr) ou seja a linha no caso do evento click
        const isOk = confirm("Tem certeza que quer deletar essa linha ?");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="user">
              <img src="https://github.com/Kennedysena.png"
              alt="Imagem de Kennedysena">
              <a href="https://github.com/Kennedysena" target="_blank">
              <p>Kennedy Sena</p>
              <span>Kennedysena</span>
                </a>
            </td>
            <td class="repositories">48</td>
            <td class="followers">1234</td>
            <td>
              <button class="remove">Remover</button>
            </td>
        `;
    return tr;
  }

  createRowZero() {
    const tr = document.createElement("tr");
    tr.classList.add("zero");
    tr.innerHTML = `<tr class=zero>
                    <td>
                    <img src="/assets/Estrela.svg" alt="Imagem de estrela">
                    <p>Nenhum favorito ainda</p>
                    </td>
                    </tr>`;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      //querySelectorAll gets all tr ​​i.e. all lines, forEach in the case for each one each one of them updates
      //querySelectorAll pega todos os tr ou seja todas as linhas, forEach no caso para cad um cada um deles atualiza
      tr.remove();
    });
  }
}
