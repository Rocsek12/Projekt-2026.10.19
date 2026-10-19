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

// ---------- Segédfüggvény elemek létrehozásához ----------
function elem(tag, osztaly, szoveg) {
  const e = document.createElement(tag);
  if (osztaly) e.className = osztaly;
  if (szoveg !== undefined) e.textContent = szoveg;
  return e;
}

// ---------- Alap szerkezet ----------
const app = elem("div", "kontener");
app.id = "app";
document.body.appendChild(app);

function torol() {
  clearInterval(idozito);
  app.innerHTML = "";
}

// ---------- Kezdőképernyő ----------
function kezdoKepernyo() {
  torol();
  const kartya = elem("div", "kartya");
  kartya.appendChild(elem("h1", "", "⚽ Sportkvíz"));
  kartya.appendChild(
    elem("p", "leiras", `${kerdesek.length} kérdés, kérdésenként ${IDO_KERDESENKENT} másodperc. Készen állsz?`)
  );
  const gomb = elem("button", "gomb", "Kezdés");
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

  const kartya = elem("div", "kartya");

  // Fejléc: számláló + pontszám + idő
  const fejlec = elem("div", "fejlec");
  fejlec.appendChild(elem("span", "", `${aktualis + 1} / ${kerdesek.length}`));
  fejlec.appendChild(elem("span", "", `Pont: ${pontszam}`));
  const idoElem = elem("span", "ido", `⏱ ${hatralevo}`);
  idoElem.id = "ido";
  fejlec.appendChild(idoElem);
  kartya.appendChild(fejlec);

  // Haladásjelző sáv
  const sav = elem("div", "sav");
  const toltes = elem("div", "toltes");
  toltes.style.width = `${(aktualis / kerdesek.length) * 100}%`;
  sav.appendChild(toltes);
  kartya.appendChild(sav);

  kartya.appendChild(elem("h2", "", k.kerdes));

  // Válaszgombok
  const lista = elem("div", "valaszok");
  k.valaszok.forEach((szoveg, index) => {
    const gomb = elem("button", "valasz", szoveg);
    gomb.addEventListener("click", () => valaszol(index, lista));
    lista.appendChild(gomb);
  });
  kartya.appendChild(lista);

  // Tovább gomb (kezdetben rejtett)
  const tovabb = elem("button", "gomb rejtett", aktualis === kerdesek.length - 1 ? "Eredmény" : "Következő");
  tovabb.id = "tovabb";
  tovabb.addEventListener("click", kovetkezo);
  kartya.appendChild(tovabb);

  app.appendChild(kartya);
  idozitoInditas();
}

// ---------- Időzítő ----------
function idozitoInditas() {
  idozito = setInterval(() => {
    hatralevo--;
    const e = document.getElementById("ido");
    if (e) {
      e.textContent = `⏱ ${hatralevo}`;
      if (hatralevo <= 5) e.classList.add("sürgős");
    }
    if (hatralevo <= 0) {
      clearInterval(idozito);
      idoLetelt();
    }
  }, 1000);
}

function idoLetelt() {
  if (valaszolt) return;
  valaszolt = true;
  const gombok = document.querySelectorAll(".valasz");
  gombok.forEach((g, i) => {
    g.disabled = true;
    if (i === kerdesek[aktualis].helyes) g.classList.add("helyes");
  });
  document.getElementById("tovabb").classList.remove("rejtett");
}

// ---------- Válasz kezelése ----------
function valaszol(index) {
  if (valaszolt) return;
  valaszolt = true;
  clearInterval(idozito);

  const helyes = kerdesek[aktualis].helyes;
  const gombok = document.querySelectorAll(".valasz");

  gombok.forEach((g, i) => {
    g.disabled = true;
    if (i === helyes) g.classList.add("helyes");
    if (i === index && index !== helyes) g.classList.add("hibas");
  });

  if (index === helyes) pontszam++;
  document.getElementById("tovabb").classList.remove("rejtett");
}

function kovetkezo() {
  aktualis++;
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
  if (szazalek >= 90) uzenet = "Remek, igazi sportlexikon vagy! 🏆";
  else if (szazalek >= 60) uzenet = "Szép eredmény! 👏";
  else if (szazalek >= 40) uzenet = "Nem rossz, de van hova fejlődni. 🙂";

  const kartya = elem("div", "kartya");
  kartya.appendChild(elem("h1", "", "Eredmény"));
  kartya.appendChild(elem("p", "nagy", `${pontszam} / ${kerdesek.length}`));
  kartya.appendChild(elem("p", "leiras", `${szazalek}% – ${uzenet}`));
  const gomb = elem("button", "gomb", "Újra játszom");
  gomb.addEventListener("click", jatekInditas);
  kartya.appendChild(gomb);
  app.appendChild(kartya);
}

// ---------- Indítás ----------
kezdoKepernyo();