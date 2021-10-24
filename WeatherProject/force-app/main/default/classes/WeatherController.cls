public class WeatherController {

    @AuraEnabled
    public static string insertWeather(Weather_Data__c cwdToBeUpserted){
        try {
            List<Weather_Data__c> existingCwdList =  [SELECT Id FROM Weather_Data__c WHERE dt__c = :cwdToBeUpserted.dt__c AND Name = :cwdToBeUpserted.Name];
            if(existingCwdList.size()>0) {
                return existingCwdList[0].id;
            } else {
                insert cwdToBeUpserted;
                return cwdToBeUpserted.id;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Weather_Data__c> getHistoricalWeather(String cityName, Date fromDate, Date toDate){
        try {
            return [SELECT  Id, Name, Sys_Country__c, Dt__c, Date_Time_of_Data_Calculation__c, Main_Temp__c, Main_Humidity__c,Wind_Speed__c,Weather_Description__c
                    FROM    Weather_Data__c
                    WHERE   Name = :cityName AND
                            Date_Time_of_Data_Calculation__c >= :fromDate AND
                            Date_Time_of_Data_Calculation__c <= :toDate
                    LIMIT   1000];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}