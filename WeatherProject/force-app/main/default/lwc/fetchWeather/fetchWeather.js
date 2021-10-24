import {
    LightningElement,
    track
} from "lwc";
import insertWeather from '@salesforce/apex/WeatherController.insertWeather';
const QUERY_URL = "https://api.openweathermap.org/data/2.5/weather?q="; 
const QUERY_URL_2 = "&appid=934fb38bfb043d1f6369c3dadd1c0cf2&units=imperial";
export default class FetchWeather extends LightningElement {
    
    cwddata;
    @track cwdtabledata = [];
    cwdtabledatafound;
    cwdfound;
    cwdnodata;
    city404msg;
    cwddatetime;
    cwdurl;
    cwdcity;
    cwdcityvalue;

    columns =    [
        {
            label: 'City',
            fieldName: 'city',
            type: 'text',
            sortable: false       

        },
        {
            label: 'Recorded Time',
            fieldName: 'wdatetime',
            type: 'date',
            typeAttributes:{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true},
            sortable: false       

        },
        {
            label: 'Tempereature',
            fieldName: 'temp',
            type: 'number',
            sortable: false
        },
        {
            label: 'Humidity %',
            fieldName: 'humidity',
            type: 'number',
            sortable: false
        },
        {
            label: 'Wind Speed',
            fieldName: 'windspeed',
            type: 'number',
            sortable: false
        },
        {
            label: 'Description',
            fieldName: 'description',
            type: 'text',
            sortable: false
        }

    ];

    //callout using fetch
    //save result to database
    getWeather() {
        //this.cwdtabledata = [];
        let tempcwdtabledata = [];
        console.log('this.cwdurl==='+this.cwdurl);
        fetch(this.cwdurl)
            .then((response) => {
                if (!response.ok) {
                    this.error = response;
                    console.log('this.error 1==='+this.error);
                }
                console.log('response==='+response);
                return response.json();
            })
            .then((jsonResponse) => {
                this.cwddata = jsonResponse;
                if (JSON.stringify(this.cwddata).includes("city not found")) {
                    this.cwdfound = false;
                    this.cwdnodata = true;
                    this.cwdtabledatafound = false;
                    this.city404msg = `Weather for city "${this.cwdcity}" not found. Please try with another name!`;
                } else {
                    this.cwdfound = true;
                    this.cwdtabledatafound = true;
                    this.cwdnodata = false;
                    console.log('jsonResponse==='+jsonResponse);
                    console.log('jsonResponse stringify==='+JSON.stringify(jsonResponse));
                    let cwd = { 'sobjectType': 'Weather_Data__c' };


                    //Important Weather Parameters
                    let d =this.cwddata.dt;
                    let datex=new Date(d*1000);

                    let cwdtablerec = {
                        id: this.cwddata.name,
                        city: this.cwddata.name + ', ' + this.cwddata.sys.country,
                        country: this.cwddata.sys.country,
                        wdatetime: datex,
                        temp: Math.trunc(this.cwddata.main.temp),
                        humidity: Math.trunc(this.cwddata.main.humidity),
                        windspeed: Math.trunc(this.cwddata.wind.speed),
                        description: this.cwddata.weather[0].description
                    };

                    tempcwdtabledata.push(cwdtablerec);
                    this.cwdtabledata = tempcwdtabledata;
                    console.log('this.cwdtabledata==='+JSON.stringify(this.cwdtabledata));

                    cwd.Name = this.cwddata.name;
                    cwd.Date_Time_of_Data_Calculation__c = datex;
                    cwd.Main_Humidity__c = Math.trunc(this.cwddata.main.humidity);
                    cwd.Main_Temp__c = Math.trunc(this.cwddata.main.temp);
                    cwd.Sys_Country__c = this.cwddata.sys.country;
                    cwd.Weather_Description__c = this.cwddata.weather[0].description;
                    cwd.Wind_Speed__c = Math.trunc(this.cwddata.wind.speed);
                    cwd.dt__c = this.cwddata.dt;
                    cwd.Name__c = this.cwddata.name;
                    cwd.Timezone__c = this.cwddata.timezone;
                    
                    insertWeather({cwdToBeUpserted: cwd})
                        .then(result => {
                            //this.recordId = result;
                            console.log(result);
                        })
                        .catch(error => {
                            console.log(error);
                            this.error = error;
                        });

                    }
                
            })
            .catch((error) => {
                this.error = error;
                console.log('this.error==='+this.error);
            });
    }
    //method to handle city name changes
    cityNameChanged(event) {
        let cityStr = event.target.value;
        this.cwdcity = cityStr;
        if(this.cwdcity) {
            let finalurl = QUERY_URL + cityStr + QUERY_URL_2;
            this.cwdurl = finalurl;
            this.cwdcityvalue = true;
        } else {
            this.cwdcityvalue = false;
        }
    }
}