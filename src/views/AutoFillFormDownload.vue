<template>
    <div class="auto-fill-form">
        <h1>Auto Fill Form Download</h1>
        <div class="button-container">
            <button class="button" @click="downloadPdf">Download PDF</button>
        </div>
    </div>
</template>

<script>
import {PDFDocument, rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
const BaseURL = 'https://taipei-microservices-initiative-hayu.onrender.com/api/';
// const BaseURL = 'http://localhost:8081/api/';
export default {
    data() {
        return {
            formname: this.$route.query.formname,
            userid: this.$route.query.userid,
            postCollection: {
                extra1: 'extraaaaaa one one one',
                extra2: 'extra two two two',
            }
        };
    },
    methods: {
        async modifyPdf(userid, formname) {
            try {
                // Fetch the PDF template

                const response = await fetch(BaseURL + 'autofillform/'+formname);
                console.log(BaseURL + 'autofillform/'+formname);
                const arrayBuffer = await response.arrayBuffer();

                // Fetch the user data
                const userDataResponse = await fetch(BaseURL + 'users/' + userid);

                const userData = await userDataResponse.json();
                console.log(userData);
                let a = "name";
                console.log(userData[a]);
         
                const pdfDetailsOringin = await fetch(BaseURL + 'autofillform/detail/' + formname);

                const pdfDetailsfull = await pdfDetailsOringin.json();
                const pdfDetailsText = pdfDetailsfull.detail;
                const pdfDetails = JSON.parse(pdfDetailsText);
                console.log(pdfDetails);

                // Load the PDF using PDF-lib
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                
                // Register fontkit to handle custom fonts
                pdfDoc.registerFontkit(fontkit);
                console.log("fontkit registered");
                // Fetch the custom font
                const fontUrl = '/assets/NotoSansSC-Medium.ttf';
                //const fontUrl = new URL('/assets/NotoSansSC-Medium.ttf', import.meta.url).href;
                const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
                console.log("font fetched");
                const customFont = await pdfDoc.embedFont(fontBytes);
                console.log("font embedded");


                // Get the first page of the document
                const pages = pdfDoc.getPages();
                // const firstPage = pages[0];

                console.log(pdfDetails.objects.length);

                for (let i = 0; i < pdfDetails.objects.length; i++) {
                    const detail = pdfDetails.objects[i];
                    console.log(detail);

                    if (detail.datatype == "text") {
                        console.log("in text area");
                        let fill;
                        if(!userData[detail.data]){
                            fill = this.postCollection[detail.data];
                        } else {
                            fill = userData[detail.data];
                        }
                        pages[detail.page].drawText(fill, {
                            x: detail.x,
                            y: detail.y,
                            size: detail.size,
                            font: customFont,
                            color: rgb(0, 0, 0+1),
                        });
                    } else if (detail.datatype == "image") {

                        const imgResponse = await fetch(BaseURL + 'users/image/' + userData[detail.data]);

                        const imageBytes = await imgResponse.arrayBuffer();
                        const embeddedImage = await pdfDoc.embedPng(imageBytes);
                        pages[detail.page].drawImage(embeddedImage, {
                            x: detail.x,
                            y: detail.y,
                            width: detail.width,
                            height: detail.height,
                        });
                    }
                    
                }

                // Save the modified PDF
                const pdfBytes = await pdfDoc.save();
                // Trigger the download of the modified PDF
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = formname + '_' + userData.name + '.pdf';
                link.click();

                // sent the modified pdf to backend
                await fetch(BaseURL + 'autofillform/savePDF/' + formname + '_' + userData.name, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/pdf',
                    },
                    body: pdfBytes,
                });
            } catch (error) {
                console.error('Error modifying PDF:', error);
            }
        },

        async downloadPdf() {
            const userid = this.$route.query.userid;
            const formname = this.$route.query.formname;
            if (this.$route.query.extra1) {
                this.postCollection.extra1 = this.$route.query.extra1;
            }
            else {

                this.postCollection.extra1 = "";
            }
            if (this.$route.query.extra2) {
                this.postCollection.extra2 = this.$route.query.extra2;
            }
            else {
                this.postCollection.extra2 = "extra two two two";
            }
            console.log(userid);
            console.log(formname);

            this.modifyPdf(userid, formname);
        },
    },
};
</script>

<style scoped>
.auto-fill-form {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
    padding: 20px;
}

.button-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}

.button {
    padding: 15px 30px;
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
}

.button:active {
    background-color: #003f7f;
    transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 768px) {
    .button {
        padding: 12px 25px;
        font-size: 1rem;
    }
}
</style>
