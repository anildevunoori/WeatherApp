@isTest
public class WeatherControllerTest {
    @isTest static void insertWeatherTest() {
        Weather_Data__c wd = new Weather_Data__c(Name='TestCity1', Date_Time_of_Data_Calculation__c=DateTime.now(), Main_Humidity__c=28, Main_Temp__c=80, Sys_Country__c='US', Timezone__c=-25200, Weather_Description__c='broken clouds', Wind_Speed__c=4, dt__c=1635199843);
        String wdid = WeatherController.insertWeather(wd);
        System.assertNotEquals(wdid, null,'Weather Data is not inserted');
        wdid = WeatherController.insertWeather(wd);
    }

    @isTest static void insertWeatherTestException() {
        Weather_Data__c wd = new Weather_Data__c(Date_Time_of_Data_Calculation__c=DateTime.now(), Main_Humidity__c=2822, Main_Temp__c=80, Sys_Country__c='US', Timezone__c=-25200, Weather_Description__c='broken clouds', Wind_Speed__c=4, dt__c=1635299843);
        try{
            String wdid = WeatherController.insertWeather(wd);
        } catch (Exception ex) {
            System.assertEquals('Script-thrown exception',ex.getMessage());
        }
    }

    @isTest static void getHistoricalWeatherTest() {
        Weather_Data__c wd = new Weather_Data__c(Name='TestCity2', Date_Time_of_Data_Calculation__c=DateTime.now(), Main_Humidity__c=28, Main_Temp__c=80, Sys_Country__c='US', Timezone__c=-25200, Weather_Description__c='broken clouds', Wind_Speed__c=4, dt__c=1635099843);
        insert wd;
        List<Weather_Data__c> hwd = WeatherController.getHistoricalWeather('TestCity2',null,null);
        System.assertEquals(1,hwd.size());        
    }
}
