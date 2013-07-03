#install pymongo
#execute python api.py
#access http://localhost:5000

from crossDomain import *

import sys
#sys.path.append('/home/ubuntu/safewalk/dba')
sys.path.append('/Users/bonnieyu/safewalk/dba')

from dbAccess import *

from pymongo import MongoClient
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

@app.route('/')
@crossdomain(origin='*')
def my_service():
	#args = parser.parse_args()
	print "this is request args",request.values
	dayOfWeek = request.args.get('day')
	city = request.args.get('city')
	time = request.args.get('time')

	crimeList = GetData(client, city, dayOfWeek,time)
	print "%s | %s | %s" % (city, dayOfWeek, time)
	print "total crimes is ", len(crimeList)
	return jsonify(foo='cross domain ftw')
#class HelloWorld(restful.Resource):
#    def get(self):
#        return {'hello': 'world'}

#api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)

    #crime_db, crime_data = connect("sw","SF")
#for crime in crime_data.find({"DayOfWeek":dayOfWeek}):
	#print crime
