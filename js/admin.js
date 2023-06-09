const formAdmin = document.querySelector('form');
const adminPanel = document.querySelector('.adminPanel');
const main_container = document.querySelector('.main_container');

formAdmin.addEventListener('submit', function(e) {
  e.preventDefault();
  const password = e.target.elements.password.value;
  const email = e.target.elements.email.value;
  if (email === 'suk@mail.ru' && password === 'password') {
    window.location.href = 'https://nneilom.github.io/applemarket/html/admin.html';
  } else {
    alert('Неверный пароль');
  }
});



// Сохраняем в переменные все инпуты для ввода данных и кнопку "Создать"
let inpName = document.getElementById("inpName");
let inpImg = document.getElementById("inpImg");
let inpNumber = document.getElementById("inpNumber");
let inpSkills = document.getElementById("inpSkills");
let inpPrice = document.getElementById("inpPrice");
let btnCreate = document.getElementById("btnCreate");
const API = " http://localhost:8000/products";
let form = document.querySelector("form");
let cardsContainer = document.querySelector(".cards-container");
let detailsModal = document.querySelector("#modal");
let inpSearch = document.querySelector("#inpSearch");
// let searchValue = "";
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let currentPage = 1;
let pageLength = 1;
let closeBtnDetailsModal = document.querySelector("#closeBtn");
let detailsImage = document.querySelector("#modalLeft");
let detailsName = document.querySelector("#modalRight h2");
let detailsPrice = document.querySelector("#modalRight h3");
let detailsSkills = document.querySelector("#modalRight p");

let categoryBtns = document.querySelectorAll(".filter_btns button");
let filterValue = "Все";

// Навешиваем событие submit на тег Form, для того, чтобы собрать значения инпутов в один объект и отрпавить их в db.json

form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   Проверка на заполненность полей
  if (
    !inpName.value.trim() ||
    !inpImg.value.trim() ||
    !inpSkills.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  //   Создаём новый объект и туда добавляем значения наших инпутов
  let newProfile = {
    title: inpName.title,
    image: inpImg.value,
    category: inpSkills.category,
    price: inpPrice.value,
  };
  createProfile(newProfile);
});

// Create - добавление новых данных
async function createProfile(objProf) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objProf),
  });

  readProfile();

  let inputs = document.querySelectorAll("form input");
  inputs.forEach((elem) => {
    elem.value = "";
  });
  btnCreate.addEventListener("click", (e) => {
    e.preventDefault
  })
}

// Read - отображение данных
async function readProfile(search = "") {
  let res =
    filterValue !== "Все"
      ? await fetch(
          `${API}?q=${search}&_page=${currentPage}&_limit=3&category=${filterValue}`
        )
      : await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=3`);
  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
    <div class="card-profile">
          <img src="${elem.image}" alt="${elem.title}" onclick="showDetailsModal(${elem.id})"/>
          <h4>${elem.title}</h4>
          <span>$${elem.price}</span>
          <div class= "btnBlock">
          <button id="delete" onclick="deleteProfile(${elem.id})">delete</button>
          <button id="edit" onclick="showModalEdit(${elem.id})">edit</button>
          </div>
        </div>
    `;
  });
  countPages();
}
readProfile();

// Delete - удаление одного элемента по id

async function deleteProfile(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProfile();
}

// ! Edit
// let editBtns = document.querySelector(".btnEdit");
let modal = document.querySelector(".editModal");
let closeBtn = document.querySelector("#closeEditModal");
let editInpName = document.querySelector("#editInpName");
let editInpImage = document.querySelector("#editInpImage");
let editInpNumber = document.querySelector("#editInpNumber");
let editInpDesc = document.querySelector("#editInpDesc");
let editInpPrice = document.querySelector("#editInpPrice");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector("#editForm button");

async function showModalEdit(id) {
  modal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  console.log(data);
  editInpName.value = data.title;
  editInpImage.value = data.image;
  editInpDesc.value = data.category;
  editInpPrice.value = data.price;
  btnSave.setAttribute("id", data.id);
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let editedProfile = {
    title: editInpName.value,
    image: editInpImage.value,
    category: editInpDesc.value,
    price: editInpPrice.value,
  };
  console.log(btnSave.id);
  editProfileFunc(editedProfile, btnSave.id);
});

async function editProfileFunc(editedProfile, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedProfile),
    });
    modal.style.display = "none";
    readProfile();
  } catch (error) {
    console.error(error);
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ! Details - детальное отображение данных

async function showDetailsModal(id) {
  detailsModal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  // console.log(data);
  // console.log(detailsImage.src);
  detailsImage.src = data.image;
  detailsName.innerText = data.title;
  detailsPrice.innerText = data.price;
  detailsSkills.innerText = data.category;
}

// closeBtnDetailsModal.addEventListener("click", () => {
//   detailsModal.style.display = "none";
// });

// ! ============== Seacrh =============
inpSearch.addEventListener("input", () => {
  cardsContainer.innerHTML =''
  fetch(API).then(res => res.json()).then(data => {
    data.filter((item) => item.title.toLowerCase().includes(inpSearch.value.toLowerCase()))
    .forEach((elem) => {
      if(inpSearch.value.trim() != '') {
        cardsContainer.innerHTML += `
      <div class="card-profile">
          <img src="${elem.image}" alt="${elem.title}" onclick="showDetailsModal(${elem.id})"/>
          <h4>${elem.title}</h4>
          <span>$${elem.price}</span>
          <div class= "btnBlock">
          <button id="delete" onclick="deleteProfile(${elem.id})">delete</button>
          <button id="edit" onclick="showModalEdit(${elem.id})">edit</button>
          </div>
        </div>
      `
      prevBtn.style.display = 'none'
      nextBtn.style.display = 'none'
      } else {
        prevBtn.style.display = 'block'
        nextBtn.style.display = 'block'
      }
    })
  })
});

// ! ================= Pagination ==========

async function countPages() {
  let res = await fetch(API);
  let data = await res.json();
  pageLength = Math.ceil(data.length / 3);
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProfile();
  prevBtn.classList.remove("active");
  nextBtn.classList.add("active"); 
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= pageLength) return;
  currentPage++;
  readProfile();
  nextBtn.classList.remove("active");
  prevBtn.classList.add("active"); 
});

// ! ============== FILTER ===============
categoryBtns.forEach((elem) => {
  elem.addEventListener("click", () => {
    categoryBtns.forEach((btn) => {
      btn.classList.remove("btnActive");

    });
    elem.classList.add("btnActive");

    filterValue = elem.innerText;
    readProfile();
  });
});
