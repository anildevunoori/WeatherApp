import {
    LightningElement,
    api
} from "lwc";
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jsPDF';
export default class GenerateWeatherPdf extends LightningElement {
    
    @api pdftabledata;
    @api pdfcity;

    headers = [
        {
            id: "id",
            name: "city",
            prompt: "City",
            width: 50,
            align: "left",
            padding: 0,
        },
        {
            id: "wdatetime",
            name: "wdatetime",
            prompt: "Date",
            width: 78,
            align: "left",
            padding: 0
        },
        {
            id: "temp",
            name: "temp",
            prompt: "\u00B0F",
            width: 20,
            align: "right",
            padding: 0
        },
        {
            id: "humidity",
            name: "humidity",
            prompt: "Humid%",
            width: 30,
            align: "right",
            padding: 0
        },
        {
            id: "windspeed",
            name: "windspeed",
            prompt: "Wind m/s",
            width: 30,
            align: "right",
            padding: 0,
        },
        {
            id: "description",
            name: "description",
            prompt: "Description",
            width: 50,
            align: "left",
            padding: 0,
        }
    ];

    renderedCallback() {
        Promise.all([
            loadScript(this, JSPDF)
        ]);
    }

    generatePDF() {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF({

        });

        doc.setFontSize(6);
        console.log('this.pdftabledata==='+JSON.stringify(this.pdftabledata));
        console.log('this.headers==='+JSON.stringify(this.headers));
        //doc.table(10, 10, this.cwdhistabledata, this.headers, {autosize:false}); 
        doc.table(10, 10, this.pdftabledata, this.headers, {autosize:false});
        console.log('After table===');
        doc.save(this.pdfcity+".pdf");
    }

    generateData() {
        this.generatePDF(); 
    }
}