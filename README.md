# charge-station
be for charging station service

1 - clone progect
2 - install node 14.15.0 or later
3 - command: npm i (npm install)
4 - install MongoDB (server and ui). In ubuntu use UI robo3t  - https://robomongo.org/ . Check port MongoDB in default.json, default use - localhost:27017/ 
5 - npm start to start app (start on port 5000)

after start app:
 - int slot DB: GET -  http://localhost:5000/api/slot/init
 - int scooter DB: GET -  http://localhost:5000/api/scooter/init
 - update slot from "hardware": GET - http://localhost:5000/api/stStatus/sl_id = 0x000 0000 &  sc_id = 0x0000 0000 & sl_sta = 0 & slot_pow = 222.08 & sl_id = 0x0000 0001 &  sc_id = 0x0000 001 & sl_status = 1 & slot_pow = 44.08
 
  - update scooter from "hardware": GET - http://localhost:5000/api/scEvent/sl_id = 0x000 000 &
 sc_id = 0x0000 0000 &  sc_evt = 111111
 
  - all scooters: GET - http://localhost:5000/api/scooter/all
  - scooter by id: GET - http://localhost:5000/api/scooter/sc/0
  - add scooter: POST - http://localhost:5000/api/scooter/update 
	{
		"scooterId" : 1000,
		"scooterType" : "type 1",
		"scooterOperator" : "operator 1",

	}
  - update scooter: PUT - http://localhost:5000/api/scooter/update 
	{
		"scooterId" : 1000,
		"scooterType" : "type 2",
		"scooterOperator" : "operator 2",

	}
  - delete scooter with id = 0 : DELETE - 	http://localhost:5000/api/scooter/0
  - delete All scooters : GET - 	http://localhost:5000/api/scooter/deleteall
  
  
  - all slot: GET - http://localhost:5000/api/slot/all
  - slot by id: GET - http://localhost:5000/api/slot/sc/0
  - add slot: POST - http://localhost:5000/api/slot/update 
	{
		"slotId" : 1000,
		"scooterId" : 10,
		"slotPower" : 555,
		"scooterEvent" : 1,
		"slotStatus" : 0
	}
  - update slot: PUT - http://localhost:5000/api/slot/update 
	{
		"slotId" : 1000,
		"scooterId" : 10,
		"slotPower" : 999,
		"scooterEvent" : 1,
		"slotStatus" : 0
	}
  - delete slot with id = 0 : DELETE - 	http://localhost:5000/api/slot/0
  - delete All slots : GET - 	http://localhost:5000/api/slot/deleteall
	
