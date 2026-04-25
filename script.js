let images = [];
let currentImage = "";

/* LOAD JSON */
async function loadImagesFromGitHub(){
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  try{
    const res = await fetch("https://raw.githubusercontent.com/image-data/img-data/main/data.json");
    const data = await res.json();

    images = data.images;
    images.sort(() => Math.random() - 0.5);

    loadImages(images);
  }catch(e){
    alert("Error loading images");
  }

  loader.style.display = "none";
}
loadImagesFromGitHub();

/* LOAD GRID */
function loadImages(list, container="gallery"){
  const el = document.getElementById(container);
  el.innerHTML = "";

  const favs = getFav();

  list.forEach(item=>{
    const liked = favs.includes(item.url);

    el.innerHTML += `
    <div class="card">
      <img src="${item.url}" onclick="openFull('${item.url}')">

      <div class="title">${item.title || "Wallpaper"}</div>

      <div class="buttons">
        <button class="btn share" onclick="share('${item.url}')">Share</button>
        <button class="btn download" onclick="download('${item.url}')">Download</button>
      </div>

      <div class="fav-btn" onclick="toggleFav('${item.url}')">
        ${liked ? "❤️ Remove Favourite" : "🤍 Add Favourite"}
      </div>
    </div>`;
  });
}

/* MENU */
function openMenu(){
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeMenu(){
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

/* PAGE SWITCH */
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  document.getElementById(id).classList.add("active-page");
  closeMenu();

  if(id === "fav") loadFav();
}

/* FULLSCREEN */
function openFull(url){
  currentImage = url;
  document.getElementById("fullImg").src = url;
  document.getElementById("fullscreen").style.display = "flex";
}

function closeFull(){
  document.getElementById("fullscreen").style.display = "none";
}

/* CLOSE FULLSCREEN WHEN CLICK OUTSIDE IMAGE */
document.addEventListener("click", function(e){
  const fs = document.getElementById("fullscreen");
  if(e.target === fs){
    closeFull();
  }
});

/* DOWNLOAD */
function download(url){
  fetch(url)
    .then(r => r.blob())
    .then(b => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "wallpaper.jpg";
      a.click();
    })
    .catch(()=>window.open(url));
}

function downloadImage(){
  download(currentImage);
}

/* SHARE */
function share(url){
  if(navigator.share){
    navigator.share({ url });
  }else{
    alert("Sharing not supported on this device");
  }
}

function shareImage(){
  share(currentImage);
}

/* FAVORITES */
function getFav(){
  return JSON.parse(localStorage.getItem("favs")) || [];
}

function toggleFav(url){
  let fav = getFav();

  if(fav.includes(url)){
    fav = fav.filter(f => f !== url);
  }else{
    fav.push(url);
  }

  localStorage.setItem("favs", JSON.stringify(fav));
  loadImages(images);
}

function loadFav(){
  const favUrls = getFav();
  const favImages = images.filter(i => favUrls.includes(i.url));
  loadImages(favImages, "favGallery");
}

/* SEARCH (FIXED) */
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchInput");

  search.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = images.filter(item =>
      (item.title || "").toLowerCase().includes(value) ||
      item.url.toLowerCase().includes(value)
    );

    loadImages(filtered);
  });
});

