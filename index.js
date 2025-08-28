let input = document.querySelector(".repo-container .repo-input input");
let output = document.querySelector(".show-data");
let btn = document.querySelector(".get-btn");
let ul = document.querySelector('ul[data-record="lists"]');
let li = document.querySelectorAll('ul[data-record="lists"] li');
let dropdown = document.querySelector(".dropdown-content");
let rows = document.querySelector('.show-data div[data-out="cards"]');
let search_arr = [];

input.onfocus = () => {
  let arr = JSON.parse(window.sessionStorage.getItem("search")) || [];
  console.log(arr);
  ul.innerHTML = " ";
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let li = document.createElement("li");

      li.innerText = arr[i];

      ul.appendChild(li);
      console.log(ul);
    }
    // dropdown.style.display = "block";
    dropdown.classList.add("show");
  }
};

document.body.addEventListener("click", (ev) => {
  if (!(input == ev.target)) dropdown.classList.remove("show");
});

btn.addEventListener("click", () => {
  if (input.value != "") {
    dropdown.classList.remove("show");

    fetching(input.value).then((data) => showData(data));
    addRecord(input.value);
  } else {
    alert("you ought to enter something");
    dropdown.classList.remove("show");
  }
});

function fetching(apiLink) {
  return fetch(`https://api.github.com/users/${apiLink}/repos`).then(
    (response) => response.json()
  );
}

function showData(data) {
  output.innerHTML = " ";
  rows.innerHTML = " ";

  console.log(data);

  data.forEach((repos) => {
    let col_div = document.createElement("div");
    col_div.classList.add("col");

    let card_div = document.createElement("div");
    card_div.classList.add("card", "repo-box");
    col_div.appendChild(card_div);

    // Image
    let img = document.createElement("img");
    img.src = repos.owner.avatar_url;
    img.alt = repos.name;
    img.classList.add("card-img-top");
    card_div.appendChild(img);

    // Card body
    let card_body = document.createElement("div");
    card_body.classList.add("card-body");
    card_div.appendChild(card_body);

    // Title
    let h5 = document.createElement("h5");
    h5.classList.add("card-title", "mb-3", "text-white");
    h5.textContent = repos.name;
    card_body.appendChild(h5);

    // Description
    let p = document.createElement("p");
    p.classList.add("card-text", "mb-4", "text-white");
    p.textContent = repos.description || "No description provided.";
    card_body.appendChild(p);

    // Visit link
    let url = document.createElement("a");
    url.textContent = "Visit";
    url.href = repos.html_url;
    url.target = "_blank";
    card_body.appendChild(url);

    // Stars
    let starSpan = document.createElement("span");
    starSpan.textContent = `⭐ ${repos.stargazers_count}`;
    card_body.appendChild(starSpan);

    // Append card to containe

    rows.appendChild(col_div);
    output.appendChild(rows);
  });

  // Clear input once after rendering all cards
  input.value = "";
}

ul.addEventListener("click", (ev) => {
  if (ev.target.tagName.toLowerCase() === "li") {
    input.value = ev.target.innerText;
  }
});

let addRecord = (newRec) => {
  let count = 0;
  search_arr = JSON.parse(sessionStorage.getItem("search")) || [];
  for (let i = 0; i < search_arr.length; i++) {
    if (search_arr[i] == newRec) {
      count++;
    }
  }
  if (count == 0) {
    search_arr.push(newRec);

    sessionStorage.setItem("search", JSON.stringify(search_arr));
  }
  input.value = " ";
};
