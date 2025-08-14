 function clearForm() {
    document.getElementById("myForm").reset();
  }

    
    const radioBtns=document.querySelectorAll(".imageUpload");
    console.log(radioBtns);
    for(let i=0;i<radioBtns.length;i++)
      {
        radioBtns[i].addEventListener("change", function() {
        let controllingValue = this.value;
        console.log(controllingValue)
        let urlUploadDiv=document.getElementById("urlUploadDiv");
        let fileUploadDiv=document.getElementById("fileUploadDiv");

        if (controllingValue === "urlUpload") {
            fileUploadDiv.style.display = "none"; 
            urlUploadDiv.style.display="block";
        } else {
            urlUploadDiv.style.display = "none";
            fileUploadDiv.style.display="block";
                        //for file upload to show the file names
            document.addEventListener("DOMContentLoaded", function () {
              const fileInput = document.getElementById("formFile");
              const fileLabel = document.querySelector('label[for="formFile"]'); // Select the label associated with the input

              fileInput.addEventListener("change", function (event) {
                const fileName = event.target.files[0]
                  ? event.target.files[0].name
                  : "Default file input example";
                fileLabel.textContent = fileName;
              });
            });
        }
        });
      }

