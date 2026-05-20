import gsap from "gsap/all";

const total_tiles_X = 12;
const total_tiles_Y = 9;
const tile_Size = 60;

const totalWidth = total_tiles_X * tile_Size;
const totalHeight = total_tiles_Y * tile_Size;

const tileFaces = [
    "face-front",
    "face-rear",
    "face-left",
    "face-right",
    "face-top",
    "face-bottom"
];

const imgPaths = [
    "1.webp",
    "2.png",
    "3.jpg",
    "8.jpg",
    "5.jpg",
    "4.png",
    "6.jpg"
];

const previwEl = document.querySelector(".projects-preview");
const tiles = [];

for(let row = 0; row < total_tiles_Y; row++){
    for(let col = 0; col < total_tiles_X; col++){
        const tile  = document.createElement("div");
        tile.className = "tile";

        const faces = {};

        tileFaces.forEach((side)=>{
            const face  = document.createElement("div");
            face.className = `tile-face ${side}`;
            tile.appendChild(face);
            faces[side] = face;
        })

        previwEl.appendChild(tile);
        tiles.push({element: tile, faces, row, col});
    }
}

function setTileImage(tile, side, imgPath){
    const face = tile.faces[side];
    const offsetX = -(tile.col * tile_Size);
    const offsetY = -(tile.row * tile_Size);

    face.style.backgroundImage = `url(assets/${imgPath})`;
    face.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
    face.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    face.style.objectFit = 'cover';
}

tiles.forEach((tile)=>{
    setTileImage(tile, "face-front", imgPaths[0]);
    setTileImage(tile, "face-rear", imgPaths[0]);
    setTileImage(tile, "face-left", imgPaths[0]);
    setTileImage(tile, "face-right", imgPaths[0]);
    setTileImage(tile, "face-top", imgPaths[0]);
    setTileImage(tile, "face-bottom", imgPaths[0]);

    tile.faces["face-top"].style.background = "#222";
    tile.faces["face-bottom"].style.background = "#222";
});

function breath(tileElement){
    gsap.to(tileElement,{
        z:gsap.utils.random(-40, 40),
        duration:gsap.utils.random(0.6, 1.4),
        ease:"sine.inOut",
        onComplete:()=> breath(tileElement),
    });
};


tiles.forEach((tile, i)=>{
    gsap.delayedCall(i* 0.015, ()=> breath(tile.element));
});


let activeProject = 0;
let revealCount = 0;
let isRevealing = false;
let nextProject = null;
let hoverDelay = null;

function getHiddenFace(){
    return revealCount % 2 === 0 ? "face-rear": "face-front";
}

function revealProject(projectIdx){
    if(projectIdx === activeProject && !isRevealing)return;

    if(isRevealing){
        nextProject = projectIdx;
        return;
    }

    if(projectIdx === activeProject)return;

    isRevealing = true;
    nextProject = null;

    const hiddenFace = getHiddenFace();

    tiles.forEach((tile)=>{
        setTileImage(tile, hiddenFace, imgPaths[projectIdx]);
    });

    tiles.forEach((tile)=>{
        setTileImage(tile, "face-left", imgPaths[0]);
        setTileImage(tile, "face-right", imgPaths[0]);
    });

    revealCount++;
    activeProject = projectIdx;

    gsap.to(".tile",{
       rotateY: revealCount * 180,
       duration: 0.5,
       ease:"power3.inOut",
       stagger:{
        each:0.05,
        from:'center',
        grid:[total_tiles_X, total_tiles_Y]
       },
       onComplete:()=>{
        isRevealing = false;

        if(nextProject !== null && nextProject !== activeProject){
            revealProject(nextProject);
        }
       },
    });
}

const projectLinks = document.querySelectorAll(".project-list a");

projectLinks.forEach((link)=>{
    link.addEventListener("mouseenter",()=>{
        projectLinks.forEach((pl)=>{
            pl.classList.remove("active");
        })

        link.classList.add("active");
        const projectIdx = parseInt(link.dataset.idx);

        clearTimeout(hoverDelay);
        hoverDelay = setTimeout(()=> revealProject(projectIdx), 50);
    });
});

document.querySelector(".project-list").addEventListener("mouseleave",()=>{
    projectLinks.forEach((l)=>l.classList.remove("active"));

    clearTimeout(hoverDelay);
    hoverDelay = setTimeout(()=>revealProject(0), 50);
});
