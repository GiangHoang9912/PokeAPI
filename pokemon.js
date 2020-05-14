const apiLink = "https://pokeapi.co/api/v2/";
const loadingGifLink = "https://media.giphy.com/media/sSgvbe1m3n93G/giphy.gif";
const imgPokemonLink = "https://pokeres.bastionbot.org/images/pokemon/";
const myStorage = window.localStorage;

let currentId = 0;
const getPokemon = async (pokeID) => {
  try {
    if (isNaN(pokeID)) {
      pokeID = pokeID.toLowerCase().trim();
    }
    currentId = pokeID;
    const dataLink = apiLink + "pokemon/" + pokeID + "/";
    const res = await fetch(dataLink);
    const json = await res.json();
    document.getElementById("name").innerText = json.name;
    document.getElementById("showImg").src = imgPokemonLink + pokeID + ".png";

    const stats = json.stats;

    const divStats = document.getElementById("infoDiv");
    divStats.innerHTML = "";
    stats.forEach((element) => {
      const pokeStat = element.stat;
      const info = pokeStat.name + " : " + element.base_stat;
      const tdInfo = document.createElement("H3"); // Create a <h1> element
      const textOfTdInfo = document.createTextNode(info); // Create a text node
      tdInfo.appendChild(textOfTdInfo);
      divStats.appendChild(tdInfo);
    });
  } catch (error) {
    document.getElementById("name").innerText = "Not Found";
  }
};
const getPokeCountInDex = async () => {
  const dataLink = apiLink + "pokemon/";
  const res = await fetch(dataLink);
  const json = await res.json();
  return parseInt(json.count);
};
const getAllLocalStorage = () => {
  let values = [],
    keys = Object.keys(myStorage),
    i = keys.length;
  while (i--) {
    values.push(myStorage.getItem(keys[i]));
  }
  return values;
};
const showBookmarks = () => {
  const storages = getAllLocalStorage();
  const divBookmarks = document.getElementById("bookmarks");
  for (const storage of storages) {
    const btnBookmark = document.createElement("button");
    btnBookmark.setAttribute("class", "btnBookmark");
    const txtBookmark = document.createTextNode(storage); // Create a text node
    btnBookmark.appendChild(txtBookmark);
    divBookmarks.appendChild(btnBookmark);
    btnBookmark.addEventListener("click", (e) => {
      getPokemon(btnBookmark.textContent);
    });
  }
};
showBookmarks();
const checkBookmarkIsExist = (callback, pokeID) => {
  let check = false;
  const arrBookmarks = callback;
  for (const bookmark of arrBookmarks) {
    if (bookmark == pokeID) {
      check = true;
      break;
    }
  }
  return check;
};

const savePokemonToBookmark = () => {
  const check = checkBookmarkIsExist(getAllLocalStorage(), currentId);

  if (currentId && !check) {
    myStorage.setItem(currentId, currentId);
    const divBookmark = document.getElementById("bookmarks");
    const btnBookmark = document.createElement("button");
    btnBookmark.setAttribute("class", "btnBookmark");
    const txtName = document.createTextNode(myStorage.getItem(currentId));
    btnBookmark.appendChild(txtName);
    divBookmark.appendChild(btnBookmark);

    btnBookmark.addEventListener("click", (e) => {
      getPokemon(btnBookmark.textContent);
    });
  }
};

const clearBookmarks = () => {
  myStorage.clear();
  document.getElementById("bookmarks").innerHTML = "";
};

document.getElementById("content").addEventListener("click", async () => {
  document.getElementById("showImg").src = loadingGifLink;
  document.getElementById("name").innerText = "Loading...!";
  const res = await getPokeCountInDex();
  const pokeID = Math.floor(Math.random() * res) + 1;
  console.log(pokeID);
  getPokemon(pokeID);
});

document.getElementById("saveBookmark").addEventListener("click", () => {
  savePokemonToBookmark();
});

document.getElementById("clearBookmark").addEventListener("click", () => {
  clearBookmarks();
});