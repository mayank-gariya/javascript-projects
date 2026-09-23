const textInput = document.getElementById("textInput");
const textBtn = document.getElementById("textBtn");

const fileInput = document.getElementById("fileInput");
const fileBtn = document.getElementById("fileBtn");

const uploadArea = document.getElementById("uploadArea");

const result = document.getElementById("result");
const qrImage = document.getElementById("qrImage");
const downloadBtn = document.getElementById("downloadBtn");

function showQR(path){
    qrImage.src = path;
    downloadBtn.href = path;
    result.style.display = "flex";
}

// -------- TEXT QR --------

textBtn.addEventListener("click", async () => {

    const text = textInput.value.trim();

    if(!text){
        return alert("Please enter text or URL.");
    }

    try{

        const response = await fetch("/api/text",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({text})
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        showQR(data.qr);

    }catch(err){
        console.error(err);
        alert(err.message);
    }

});

// -------- FILE QR --------

fileBtn.addEventListener("click", uploadFile);

async function uploadFile(){

    const file = fileInput.files[0];

    if(!file){
        return alert("Please select a file.");
    }

    const formData = new FormData();
    formData.append("file", file);

    try{

        const response = await fetch("/api/file",{
            method:"POST",
            body:formData
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        showQR(data.qr);

    }catch(err){
        console.error(err);
        alert(err.message);
    }

}

// -------- DRAG & DROP --------

uploadArea.addEventListener("dragover",(e)=>{
    e.preventDefault();
    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave",()=>{
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop",(e)=>{
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    fileInput.files = e.dataTransfer.files;
});