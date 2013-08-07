#install pymongo
#execute python api.py
#access http://localhost:5000

from crossDomain import *

import sys
sys.path.append('/home/ubuntu/safewalk/dba')
#sys.path.append('/Applications/MAMP/htdocs/swAmbrish/dba')

from dbAccess import *

from pymongo import MongoClient

import simplejson
import datetime
from datetime import date

from flask import jsonify
from flask import Flask
from flask.ext import restful
from flask.ext.restful import reqparse
from flask import request

#--- GLOBALS --#
client = MongoClient('localhost',27017)
d = datetime.date(2013,12,5)
app = Flask(__name__)
api = restful.Api(app)
parser = reqparse.RequestParser()
parser.add_argument('city', type=str, help="User City")

def connect(db_name,collection_name):
#returns the database and the collection
	db = client[db_name]
	collection = db[collection_name]
	return (db,collection)

def logRoute(start,end):
	f = open("logs/startEnd.csv", "a")
	output = start + ", " + end +"\n"
	f.write(output)
	f.close()

@app.route('/')
@crossdomain(origin='*')
def my_service():
	#args = parser.parse_args()
	print "---- GETTING QUERY REQUEST FROM CLIENT ---"
	#print "this is request args",request.values
	dayOfWeek = request.args.get('day')
	city = request.args.get('city')
	time = request.args.get('time')
	#start = request.args.get('start')
 	#end = request.args.get('end')

 	#logRoute(start,end)

	crimeList = GetData(client, city, dayOfWeek,time)
	totalCrimes = len(crimeList)
	crimeJSON = simplejson.dumps(crimeList)

	print "Query Parameters %s | %s | %s" % (city, dayOfWeek, time)
	print "total crimes is ", totalCrimes
	print crimeList[0]
	#temp = [totalCrimes, crimeJSON]
	return crimeJSON

	#return simplejson.dumps(crimeList)
	#return jsonify(foo=crimeList[0]['Category'])
#class HelloWorld(restful.Resource):
#    def get(self):
#        return {'hello': 'world'}

#api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0')

    #crime_db, crime_data = connect("sw","SF")
#for crime in crime_data.find({"DayOfWeek":dayOfWeek}):
	#print crime
