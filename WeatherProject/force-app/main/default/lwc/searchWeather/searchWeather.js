import {
    LightningElement,
    track
} from "lwc";
import getHistoricalWeather from '@salesforce/apex/WeatherController.getHistoricalWeather';
export default class SearchWeather extends LightningElement {
    
    @track htabledata;
    @track htabledatafound;
    @track hnodata;
    @track h404msg;
    @track filterCityStr;
    @track filterFromDate;
    @track filterToDate;

    @track hcolumns =    [
        {
            label: 'City',
            fieldName: 'city',
            type: 'text',
            sortable: false       

        },
        {
            label: 'Recorded Time',
            fieldName: 'wdatetime',
            type: 'text',
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

    //method to handle filter city name changes
    filterCityNameChanged(event) {
        let cityStr = event.target.value;
        this.filterCityStr = cityStr;
        console.log('this.filterCityStr==='+this.filterCityStr);
    }

    //method to handle filter from date changes
    filterFromDateChanged(event) {
        let fromDate = event.target.value;
        this.filterFromDate = fromDate;
    }

    //method to handle filter to date changes
    filterToDateChanged(event) {
        let toDate = event.target.value;
        this.filterToDate = toDate;
    }

    getHistoricalData() {
        //this.htabledata = [];
        let temphtabledata = [];
        getHistoricalWeather({cityName: this.filterCityStr, fromDate: this.filterFromDate, toDate: this.filterToDate})
            .then(result => {                
                if(result.length == 0) {  
                    console.log('result.length==='+result.length);   
                    console.log('result==='+JSON.stringify(result));                
                    this.htabledatafound = false;
                    this.hnodata = true;
                    if(this.filterCityStr) {
                        this.h404msg = `No Data Found: Historical Weather for city "${this.filterCityStr}" not found. Please try with other filter values!`;
                    } else {
                        this.h404msg = `Please enter city name to search the historical data!`;
                    }
                } else if(result.length > 0) {
                    console.log('result.length==='+result.length);
                    console.log('result==='+JSON.stringify(result)); 
                    this.htabledatafound = true;
                    this.hnodata = false;
                    result.forEach(rec => {
                        let hmdt = rec.Main_Humidity__c;
                        let temp = Math.trunc(rec.Main_Temp__c);
                        let windspeed = rec.Wind_Speed__c;
                        let city = rec.Name + ', ' + rec.Sys_Country__c;
                        windspeed = '' + windspeed;
                        temp = ''+temp;
                        hmdt = ''+hmdt;
                        let htablerec = {
                            id: rec.Id,
                            city: city,
                            country: rec.Sys_Country__c,
                            wdatetime: rec.Date_Time_of_Data_Calculation__c,
                            temp: temp,
                            humidity: hmdt,
                            windspeed: windspeed,
                            description: rec.Weather_Description__c
                        };
                        temphtabledata.push(htablerec);
                    });
                    this.htabledata = temphtabledata;
                    console.log('this.htabledata==='+JSON.stringify(this.htabledata));
                }
                
            })
            .catch(error => {
                console.log(error);
                this.error = error;
                this.hnodata = true;
                this.htabledatafound = false;
                this.h404msg = `Error! Historical Weather for city "${this.filterCityStr}" not found. Please try with other filters!`;
            });
    }
}