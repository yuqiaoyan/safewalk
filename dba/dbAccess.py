#!/usr/bin/python

import sys
import pymongo
import datetime
import json

def GetData(client, city, dayOfWeek, timeOfDay) :
    # Get data base from mongoDB
    db = client.crimedb;
    print db.collection_names();
    # Get collection for each city
    collectionCity = db[city]
    
    # Get time of day and find low and upper bounds to lookup
    parts = timeOfDay.split(":");
    hourOfDay = int(parts[0]);

    upperHour = hourOfDay +4
    lowerHour = hourOfDay-4
    upperDay = dayOfWeek
    lowerDay = dayOfWeek
    dayToOrdinal = {"Sunday":0,"Monday":1,"Tuesday":2,"Wednesday":3,"Thursday":4,"Friday":5,"Saturday":6}
    OrdinalToDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    if(upperHour >= 24):
        ## get the previous day and hour
        upperDayOrdinal = dayToOrdinal[dayOfWeek]+1
        if(upperDayOrdinal > 6):
            upperDayOrdinal = 0
        upperDay = OrdinalToDay[upperDayOrdinal]
        upperHour = upperHour - 24
    elif(lowerHour < 0):
        lowerDayOrdinal = dayToOrdinal[dayOfWeek]-1
        if(lowerDayOrdinal < 0):
            lowerDayOrdinal = 7
        lowerDay = OrdinalToDay[lowerDayOrdinal]
        lowerHour = 24+lowerHour

    print "UpperDay: ",upperDay, "LowerDay: ", lowerDay, "Today: ", dayOfWeek
    print "UpperHour: ",upperHour, "LowerHour: ", lowerHour, "Hour: ", hourOfDay

    lowerHourBound = 0 if (hourOfDay < 4) else (hourOfDay - 4);
    upperHourBound = 23 if (hourOfDay > 19) else (hourOfDay + 4);
    print 'Lower:', lowerHourBound, '  Upper: ', upperHourBound;

    # print collection stat
    print collectionCity.count(), 'crimes in SF on', dayOfWeek;
    print collectionCity.find_one({"DayOfWeek": dayOfWeek});

    crimeList = [];
    for crime in collectionCity.find({"DayOfWeek": dayOfWeek},{'_id':0}):
        crimeRecTimeStr = crime["Time"]; 
        recTimeParts = crimeRecTimeStr.split(":");
        crimeRecHour = int(recTimeParts[0]);
        if ((crimeRecHour < lowerHourBound) or (crimeRecHour > upperHourBound)):
            continue;
        print 'Adding: ', crimeRecTimeStr;
        crimeList.append(crime);

    # check if day boundary condition on the beinging of day
    if (lowerDay != dayOfWeek):
        print collectionCity.count(), 'crimes in SF on', lowerDay;
        print collectionCity.find_one({"DayOfWeek": lowerDay});
        for crime in collectionCity.find({"DayOfWeek": lowerDay},{'_id':0}):
            crimeRecTimeStr = crime["Time"]; 
            recTimeParts = crimeRecTimeStr.split(":");
            crimeRecHour = int(recTimeParts[0]);
            if (crimeRecHour < lowerHour):
                continue;
            print 'Adding previous day: ', crimeRecTimeStr;
            crimeList.append(crime);
       
    # check if day boundary condition on the end of day
    if (upperDay != dayOfWeek):
        print collectionCity.count(), 'crimes in SF on', upperDay;
        print collectionCity.find_one({"DayOfWeek": upperDay});
        for crime in collectionCity.find({"DayOfWeek": upperDay},{'_id':0}):
            crimeRecTimeStr = crime["Time"]; 
            recTimeParts = crimeRecTimeStr.split(":");
            crimeRecHour = int(recTimeParts[0]);
            if (crimeRecHour > upperHour):
                continue;
            print 'Adding Next day: ', crimeRecTimeStr;
            crimeList.append(crime);

    return crimeList;
    

def main () :
    # make connection to mongo DB
    from pymongo import MongoClient;
    client = MongoClient();
    city = sys.argv[1];
    dayOfWeek = sys.argv[2];
    timeOfDay = sys.argv[3];

    crimeList = GetData(client, city, dayOfWeek, timeOfDay);
    for crime in crimeList:
        print crime

if __name__ == '__main__':
    main ()


