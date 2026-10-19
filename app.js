// ---------- Adatok ----------
const kerdesek = [
  {
    kerdes: "Hány játékos van egyszerre a pályán egy kosárlabdacsapatból?",
    valaszok: ["4", "5", "6", "7"],
    helyes: 1,
  },
  {
    kerdes: "Melyik országban rendezték a 2016-os nyári olimpiát?",
    valaszok: ["Kína", "Egyesült Királyság", "Brazília", "Japán"],
    helyes: 2,
  },
  {
    kerdes: "Hány méter hosszú egy maratoni futás?",
    valaszok: ["21 097 m", "42 195 m", "50 000 m", "30 000 m"],
    helyes: 1,
  },
  {
    kerdes: "Melyik magyar úszónő kapta a „Vasladyˮ becenevet?",
    valaszok: ["Egerszegi Krisztina", "Hosszú Katinka", "Gyarmati Andrea", "Verrasztó Evelyn"],
    helyes: 1,
  },
  {
    kerdes: "Hány pontot ér egy hárompontos dobás a kosárlabdában?",
    valaszok: ["1", "2", "3", "4"],
    helyes: 2,
  },
  {
    kerdes: "Melyik évben nyerte meg a magyar válogatott az olimpiai labdarúgótornát először?",
    valaszok: ["1948", "1952", "1964", "1968"],
    helyes: 1,
  },
  {
    kerdes: "Melyik sportágban használnak „shuttlecockotˮ (tollaslabdát)?",
    valaszok: ["Tenisz", "Squash", "Tollaslabda", "Pingpong"],
    helyes: 2,
  },
  {
    kerdes: "Hány játékos van egy röplabdacsapat pályán lévő tagjai között?",
    valaszok: ["5", "6", "7", "8"],
    helyes: 1,
  },
];

const IDO_KERDESENKENT = 15; // másodperc

// ---------- Állapot ----------
let aktualis = 0;
let pontszam = 0;
let hatralevo = IDO_KERDESENKENT;
let idozito = null;
let valaszolt = false;

// ---------- Alap doboz az oldalon ----------
const app = document.createElement("div");
app.className = "kontener";
document.body.appendChild(app);

// ---------- Az oldal tartalmának törlése ----------
function torol() {
  clearInterval(idozito);
  app.innerHTML = "";
}

// ---------- Kezdőképernyő ----------
function kezdoKepernyo() {
  torol();

  const kartya = document.createElement("div");
  kartya.className = "kartya";

  const cim = document.createElement("h1");
  cim.textContent = "⚽ Sportkvíz";
  kartya.appendChild(cim);

  const leiras = document.createElement("p");
  leiras.className = "leiras";
  leiras.textContent = kerdesek.length + " kérdés, kérdésenként " + IDO_KERDESENKENT + " másodperc. Készen állsz?";
  kartya.appendChild(leiras);

  const gomb = document.createElement("button");
  gomb.className = "gomb";
  gomb.textContent = "Kezdés";
  gomb.addEventListener("click", jatekInditas);
  kartya.appendChild(gomb);

  app.appendChild(kartya);
}

// ---------- Játék indítása ----------
function jatekInditas() {
  aktualis = 0;
  pontszam = 0;
  kerdesMegjelenit();
}

// ---------- Kérdés megjelenítése ----------
function kerdesMegjelenit() {
  torol();
  valaszolt = false;
  hatralevo = IDO_KERDESENKENT;

  const k = kerdesek[aktualis];

  const kartya = document.createElement("div");
  kartya.className = "kartya";

  // Fejléc
  const fejlec = document.createElement("div");
  fejlec.className = "fejlec";

  const szamlalo = document.createElement("span");
  szamlalo.textContent = (aktualis + 1) + " / " + kerdesek.length;
  fejlec.appendChild(szamlalo);

  const pont = document.createElement("span");
  pont.textContent = "Pont: " + pontszam;
  fejlec.appendChild(pont);

  const idoElem = document.createElement("span");
  idoElem.className = "ido";
  idoElem.id = "ido";
  idoElem.textContent = "⏱ " + hatralevo;
  fejlec.appendChild(idoElem);

  kartya.appendChild(fejlec);

  // Haladásjelző sáv
  const sav = document.createElement("div");
  sav.className = "sav";

  const toltes = document.createElement("div");
  toltes.className = "toltes";
  toltes.style.width = (aktualis / kerdesek.length) * 100 + "%";
  sav.appendChild(toltes);

  kartya.appendChild(sav);

  // Kérdés szövege
  const kerdesCim = document.createElement("h2");
  kerdesCim.textContent = k.kerdes;
  kartya.appendChild(kerdesCim);

  // Válaszgombok
  const lista = document.createElement("div");
  lista.className = "valaszok";

  for (let i = 0; i < k.valaszok.length; i++) {
    const gomb = document.createElement("button");
    gomb.className = "valasz";
    gomb.textContent = k.valaszok[i];
    gomb.addEventListener("click", function () {  // melyikre kattintunk
      valaszol(i);
    });
    lista.appendChild(gomb);
  }

  kartya.appendChild(lista);

  // Tovább gomb (kezdetben rejtett)
  const tovabb = document.createElement("button");
  tovabb.className = "gomb rejtett";
  tovabb.id = "tovabb";
  if (aktualis === kerdesek.length - 1) {
    tovabb.textContent = "Eredmény";
  } else {
    tovabb.textContent = "Következő";
  }
  tovabb.addEventListener("click", kovetkezo);
  kartya.appendChild(tovabb);

  app.appendChild(kartya);

  idozitoInditas();
}

// ---------- Időzítő ----------
function idozitoInditas() {
  idozito = setInterval(function () {
    hatralevo = hatralevo - 1;

    const idoElem = document.getElementById("ido");
    idoElem.textContent = "⏱ " + hatralevo;

    if (hatralevo <= 5) {
      idoElem.classList.add("surgos");
    }

    if (hatralevo <= 0) {
      clearInterval(idozito);
      idoLetelt();
    }
  }, 1000);
}

function idoLetelt() {
  if (valaszolt) {
    return;
  }
  valaszolt = true;

  const gombok = document.querySelectorAll(".valasz");  // querySelectorAll (az id csak 1 elemet találna meg)
  for (let i = 0; i < gombok.length; i++) {
    gombok[i].disabled = true;
    if (i === kerdesek[aktualis].helyes) {
      gombok[i].classList.add("helyes");
    }
  }

  document.getElementById("tovabb").classList.remove("rejtett");
}

// ---------- Válasz kezelése ----------
function valaszol(index) {
  if (valaszolt) {
    return;
  }
  valaszolt = true;
  clearInterval(idozito);

  const helyes = kerdesek[aktualis].helyes;
  const gombok = document.querySelectorAll(".valasz");

  for (let i = 0; i < gombok.length; i++) {
    gombok[i].disabled = true;

    if (i === helyes) {
      gombok[i].classList.add("helyes");
    }
    if (i === index && index !== helyes) {
      gombok[i].classList.add("hibas");
    }
  }

  if (index === helyes) {
    pontszam = pontszam + 1;
  }

  document.getElementById("tovabb").classList.remove("rejtett");
}

function kovetkezo() {
  aktualis = aktualis + 1;

  if (aktualis < kerdesek.length) {
    kerdesMegjelenit();
  } else {
    eredmeny();
  }
}

// ---------- Eredményoldal ----------
function eredmeny() {
  torol();

  const szazalek = Math.round((pontszam / kerdesek.length) * 100);

  let uzenet = "Ezt még gyakorolni kell! 💪";
  if (szazalek >= 90) {
    uzenet = "Remek, igazi sportlexikon vagy! 🏆";
  } else if (szazalek >= 60) {
    uzenet = "Szép eredmény! 👏";
  } else if (szazalek >= 40) {
    uzenet = "Nem rossz, de van hova fejlődni. 🙂";
  }

  const kartya = document.createElement("div");
  kartya.className = "kartya";

  const cim = document.createElement("h1");
  cim.textContent = "Eredmény";
  kartya.appendChild(cim);

  const nagy = document.createElement("p");
  nagy.className = "nagy";
  nagy.textContent = pontszam + " / " + kerdesek.length;
  kartya.appendChild(nagy);

  const leiras = document.createElement("p");
  leiras.className = "leiras";
  leiras.textContent = szazalek + "% – " + uzenet;
  kartya.appendChild(leiras);

  const gomb = document.createElement("button");
  gomb.className = "gomb";
  gomb.textContent = "Újra játszom";
  gomb.addEventListener("click", jatekInditas);
  kartya.appendChild(gomb);

  app.appendChild(kartya);
}

// ---------- Indítás ----------
kezdoKepernyo();