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
    collectionSF = db[city]
    
    # Get time of day and find low and upper bounds to lookup
    parts = timeOfDay.split(":");
    hourOfDay = int(parts[0]);

    #test code
    #dayOfWeek = "Sunday"
    #hourOfDay = 23

    #upperHour = hourOfDay +4
    #lowerHour = hourOfDay-4
    #upperDay = dayOfWeek
    #lowerDay = dayOfWeek
    #dayToOrdinal = {"Sunday":0,"Monday":1,"Tuesday":2,"Wednesday":3,"Thursday":4,"Friday":5,"Saturday":6}
    #OrdinalToDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    #if(upperHour >= 24):
        ## get the previous day and hour
        #upperDayOrdinal = dayToOrdinal[dayOfWeek]+1
        #if(upperDayOrdinal > 7):
            #upperDayOrdinal = 0
        #upperDay = OrdinalToDay[upperDayOrdinal]
        #upperHour = upperHour - 24
    #elif(lowerHour <= 0):
        #lowerHourOrdinal = dayToOrdinal[dayOfWeek]-1
        #lowerDay = OrdinalToDay[lowerHourOrdinal]
        #if(lowerDayOrdinal < 0):
            #lowerDayOrdinal = 7
        #lowerHour = 24-lowerHour

    #print "Upper: ",upperHour, "Lower: ", lowerhour
    #print "UpperDay: ",upperDay, "LowerDay: ", lowerDay

    lowerHourBound = 0 if (hourOfDay < 4) else (hourOfDay - 4);
    upperHourBound = 23 if (hourOfDay > 19) else (hourOfDay + 4);
    print 'Lower:', lowerHourBound, '  Upper: ', upperHourBound;

    # print collection stat
    print collectionSF.count(), 'crimes in SF on', dayOfWeek;
    print collectionSF.find_one({"DayOfWeek": dayOfWeek});

    #crimeRecord = json.loads(crime);
    crimeList = [];
    for crime in collectionSF.find({"DayOfWeek": dayOfWeek},{'_id':0}):
        crimeRecTimeStr = crime["Time"]; 
        recTimeParts = crimeRecTimeStr.split(":");
        crimeRecHour = int(recTimeParts[0]);
        if ((crimeRecHour < lowerHourBound) or (crimeRecHour > upperHourBound)):
            continue;
        print 'Adding: ', crimeRecTimeStr;
        crimeList.append(crime);

    return crimeList;

    #return crime;

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


