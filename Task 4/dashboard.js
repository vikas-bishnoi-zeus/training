const myarray = new Array(6).fill(false);
function navFunction(event) {
  const curClass = "nav-option-" + event;
  for (let i = 1; i < 6; i++) {
    if (myarray[i]) {
      const toRemove = "nav-option-" + i;
      var remelement = document.getElementById(toRemove);
      var remstyles = {
        borderBottom: "0px  #FFFFFF",
        height: "inherit",
        display: "flex",
        alignItems: "center",
        color: "#3FD28B",
      };
      propertyAssigner(remelement, remstyles);
      myarray[i] = false;
    }
  }
  var element = document.getElementById(curClass);
  var styles = {
    borderBottom: "3px solid #FFFFFF",
    height: "inherit",
    display: "flex",
    alignItems: "center",
    color: "#FFFFFF",
  };
  propertyAssigner(element, styles);
  myarray[event] = true;
}
function propertyAssigner(element, styles) {
  Object.assign(element.style, styles);
}

function hamburgerMenuShow() {
  var element = document.getElementById("horizontalHamMenu");
  var display = element.style.display;
  if (display == "flex") {
    element.style.display = "none";
  } else {
    element.style.display = "flex";
  }
}

function showAnouncement() {
  var element = document.getElementById("announcementsSlide");
  var display = element.style.display;
  if (display == "flex") {
    element.style.display = "none";
  } else {
    element.style.display = "flex";
  }
  var items = document.getElementsByClassName("up-2");
  items[0].style.display = "none";
}

function showAlert() {
  var element = document.getElementById("alertsSlide");
  var display = element.style.display;
  if (display == "flex") {
    element.style.display = "none";
  } else {
    element.style.display = "flex";
  }
  var items = document.getElementsByClassName("up-1");
  items[0].style.display = "none";
}

function cardContent(item) {
  let fav = `<img src="./Assets/quantum screen assets/icons/favourite.svg" alt="">`;
  let nofav = `<svg id="favourite" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path id="Path_3678" data-name="Path 3678" d="M0,0H24V24H0Z" fill="none"/>
                        <path id="Path_3679" data-name="Path 3679" d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" fill="#EEEEEE"/>
                        <path id="Path_3680" data-name="Path 3680" d="M0,0H24V24H0Z" fill="none"/>
                      </svg>`;

  let opaclass = `class="opacity-img"`;
  let expireId = `id="expire-des"`;
  var el = document.createElement("div");
  el.className = "card";
  let expireDiv = `<div id="expire-div">
                <span class="expired">&nbsp;&nbsp;Expired&nbsp;&nbsp;</span>
              </div>`;
  let ihtml = `
                ${item.expired ? expireDiv : ""}
              <div ${item.expired ? expireId : ""}class="descripton">
                <div class="img-div">
                  <img src="${item.image}" alt="">
                </div>
                
                <div class="info">
                  <div class="card-head">
                    <div class="topic">
                      ${item.title}
                    </div>
                    <div class="star">
                      ${item.favorite ? fav : nofav}
                    </div>
                  </div>
                  <div class="subject"><span>${item.subject} | ${
    item.grade
  } </span> <span class="extra-class"> +${item.addition}</span></div>
                  <div class="subject">
                    <span class="number">${
                      item.units
                    } </span><span class="class-detail">Units</span>
                    <span class="number">${
                      item.lessons
                    } </span><span class="class-detail">Lessons</span>
                    <span class="number">${
                      item.topic
                    } </span><span class="class-detail">Topics</span>
                  </div>
                  <div class="select-div">
                    <select class="classroom">
                      
                      <option class="opt" value="Mr. Frank's Class B">Mr. Frank's Class B</option>
                      <option class="opt" value="Mr. Brank">Mr. Brank</option>
                    </select>
                  </div>
                  <div class="class-info">
                    ${item.info.totalStudents} Students | ${item.info.duration}
                  </div>
                </div>
              </div>
              <div class="card-buttom">
                <img src="./Assets/quantum screen assets/quantum screen assets/icons/preview.svg" alt="">
                <img ${
                  item.opac == 1 ? opaclass : ""
                } src="./Assets/quantum screen assets/icons/manage course.svg" alt="">
                <img ${
                  item.opac == 1 ? opaclass : ""
                }src="./Assets/quantum screen assets/icons/grade submissions.svg" alt="">
                <img src="./Assets/quantum screen assets/icons/reports.svg" alt="">
              </div>
              `;
  el.innerHTML = ihtml;
  let contet = document.querySelector(".content");
  contet.appendChild(el);
  return "hello";
}

function cardJson(card) {
  card.map((item) => {
    cardContent(item);
  });
}

function alertContent(item){
    console.log(item);
    // <span class="iconify iconify-check" data-icon="zondicons:minus-outline" data-width="13" data-height="13"></span>
    let checked=`<span class="iconify iconify-check" data-icon="teenyicons:tick-circle-solid" data-width="20" data-height="20"></span>`
    let unchecked=`<span class="iconify iconify-check" data-icon="zondicons:minus-outline" data-width="20" data-height="20"></span>`
    
    
    var el = document.createElement("div");
    el.className = "announcements-card";
    let ihtml=`
            <div class="anounce-info-row">
                <p>${item.title}</p>
                ${item.ticked?checked:unchecked    }
            </div>
            <div class="course-anounce">${item.course}</div>
            <div class="meta">
                <span>
                </span>
                <span>${item.time}</span>
            </div>
    `
    el.innerHTML = ihtml;
    let contet = document.querySelector("#alertsSlide");
    contet.appendChild(el);
}
function alertJson(alerts){
    console.log(alerts);
    alerts.map((item) => {
        alertContent(item);
      });
    let contet = document.querySelector("#alertsSlide");
    var el = document.createElement("div");
    el.className = "alert-option";
    el.innerHTML=`<div>Show All</div><div>Create New</div>`
    contet.append(el);
}

function anounceContent(item){
  console.log(item);
  // <span class="iconify iconify-check" data-icon="zondicons:minus-outline" data-width="13" data-height="13"></span>
  let checked=`<span class="iconify iconify-check" data-icon="teenyicons:tick-circle-solid" data-width="15" data-height="15"></span>`
  let unchecked=`<span class="iconify iconify-check" data-icon="zondicons:minus-outline" data-width="15" data-height="15"></span>`
  
  var el = document.createElement("div");
  el.className = "announcements-card";
  let ihtml=`
          <div class="anounce-info-row">
                <p><span class="atten">Pa: </span><span>${item.author}</span></p>
                ${item.ticked?checked:unchecked}
          </div>
          <div class="anounce-des">
                ${item.title}
          </div>
          <div class="course-anounce">${item.course?item.course:""}</div>
          <div class="meta">
                <span>
                  ${item.files===0?"":`<span class="iconify" data-icon="ion:attach" data-width="18" data-height="18"></span>${item.files} files are attached`}
                </span>
                <span>${item.time}</span>
          </div>
  `
  el.innerHTML = ihtml;
  let contet = document.querySelector("#announcementsSlide");
  contet.appendChild(el);
}
function anounceJson(anounce){
  console.log(anounce);
  anounce.map((item) => {
    anounceContent(item);
    });
}

fetch("./index.json")
  .then((response) => response.json())
  .then((json) => cardJson(json.cards));

fetch("./index.json")
  .then((response) => response.json())
  .then((json) => alertJson(json.alerts));


fetch("./index.json")
  .then((response) => response.json())
  .then((json) => anounceJson(json.announcements));