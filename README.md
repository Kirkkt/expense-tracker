# Expense tracker

## What is it
This is an expense tracking system.

There are three types of users: regular users, user managers and admins.

Regular users can CRUD their own expense records.

In addition to above, user managers can CRUD all users.

In addition to above, admins can CRUD expense records that belong to all users.

## How can I run it?
### Basic assumption
- You are on linux/mac
- You have installed node, python, npm, yarn and mongodb, if you don't have mongodb:
    - `brew install mongodb`

### Install dependencies
- `sh init.sh`

### Start MongoDB (this must be done before starting node server)
- `cd server/`
- `yarn run mongo`

### Start node server
- `cd server/`
- `yarn start`

### Start client dev server
- `cd client/`
- `yarn start`

### Web UI
- visit `http://127.0.0.1:8080` in your browser

## Run tests
### Run server-side tests (both unit tests and end point tests)
- `cd server/`
- `yarn test` or `yarn run test:watch`

### Run client-side unit tests
- `cd client/`
- `yarn test` or `yarn run test:watch`

## Production
### Build production client app
- `cd client/`
- `yarn run build`

### Serve production client app
- `cd client/build/`
- `python -m SimpleHTTPServer 2534`
- visit `http://127.0.0.1:2534` in your browser
- or another port number that is idle

## Fake data and demo
Server-side tests automatically generate some fake data. The three follow accounts have been created
and populated with fake data:

- username: `aa`
- password: `aa`
- group: `Admin`

- username: `ab`
- password: `ab`
- group: `User Manager`

- username: `ac`
- password: `ac`
- group: `Regular User`

### Fake data is overwhelming, I want to clear them all
- make sure you have mongodb running
- `cd server/`
- `yarn run mongo:reset`

# curl commands
### CreateAccount
1. missing parameters
    - `curl -X POST http://localhost:2039/CreateAccount`
2. duplicated username
    - `curl -d "username=aa&password=aa&group=1" -X POST http://localhost:2039/CreateAccount`
3. success
    - `curl -d "username="(random)(random)"&password=aa&group=1" -X POST http://localhost:2039/CreateAccount`

### CreateAccountThenLogIn
1. missing parameters
    - `curl -X POST http://localhost:2039/CreateAccountThenLogIn`
2. duplicated username
    - `curl -d "username=aa&password=aa&group=1" -X POST http://localhost:2039/CreateAccountThenLogIn`
3. success
    - `curl -d "username="(random)(random)"&password=aa&group=1" -X POST http://localhost:2039/CreateAccountThenLogIn`

### LogIn
1. missing parameters
    - `curl -X POST http://localhost:2039/LogIn`
2. unrecognized username
    - `curl -d 'username='(random)(random)'&password=aa' -X POST http://localhost:2039/LogIn`
3. wrong password
    - `curl -d 'username=aa&password='(random)(random) -X POST http://localhost:2039/LogIn`
4. success
    - `curl -d 'username=aa&password=aa' -X POST http://localhost:2039/LogIn`

### UpdateUser
1. missing parameters
    - `curl -X POST http://localhost:2039/UpdateUser`

2. please log in
    - `curl -d "token="(random)(random)"&usernameOriginal=usernameoriginal&username=username&group=1" -X POST http://localhost:2039/UpdateUser`

3. not permitted
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&usernameOriginal=usernameoriginal&username=username&group=1" -X POST http://localhost:2039/UpdateUser`

4. old username not registered
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&usernameOriginal="(random)(random)"&username=username&group=1" -X POST http://localhost:2039/UpdateUser`

5. new username has already registered
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&usernameOriginal=ac&username=aa&group=1" -X POST http://localhost:2039/UpdateUser`

6. success without password update
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "usernames=[\"usernameFrom\",\"usernameTo\"]&token="(cat /tmp/token) -X POST http://localhost:2039/DeleteUsers`
    - `curl -d "username=usernameFrom&password=passwordFrom&group=1" -X POST http://localhost:2039/CreateAccount`
    - `curl -d "token="(cat /tmp/token)"&usernameOriginal=usernameFrom&username=usernameTo&group=3" -X POST http://localhost:2039/UpdateUser`
    - `curl -d "username=usernameFrom&password=passwordFrom" -X POST http://localhost:2039/LogIn`
    - `curl -d "username=usernameTo&password=passwordFrom" -X POST http://localhost:2039/LogIn`

7. success with password update
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "usernames=[\"usernameFrom\",\"usernameTo\"]&token="(cat /tmp/token) -X POST http://localhost:2039/DeleteUsers`
    - `curl -d "username=usernameFrom&password=passwordFrom&group=1" -X POST http://localhost:2039/CreateAccount`
    - `curl -d "token="(cat /tmp/token)"&usernameOriginal=usernameFrom&username=usernameTo&group=3&password=passwordTo" -X POST http://localhost:2039/UpdateUser`
    - `curl -d "username=usernameFrom&password=passwordFrom" -X POST http://localhost:2039/LogIn`
    - `curl -d "username=usernameTo&password=passwordTo" -X POST http://localhost:2039/LogIn`

### DeleteUsers
1. missing parameters
    - `curl -X POST http://localhost:2039/DeleteUsers`

2. please log in
    - `curl -d "token="(random)(random)"&usernames=[\"username1\",\"username2\"]" -X POST http://localhost:2039/DeleteUsers`

3. not permitted
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&usernames=[\"username1\",\"username2\"]" -X POST http://localhost:2039/DeleteUsers`

4. success
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&usernames=[\"username1\",\"username2\"]" -X POST http://localhost:2039/DeleteUsers`

### GetUsers
1. missing parameters
    - `curl -X POST http://localhost:2039/GetUsers`

2. please log in
    - `curl -d "token="(random)(random) -X POST http://localhost:2039/GetUsers`

3. not permitted
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetUsers`

4. success for admin
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetUsers`

5. success for user manager
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetUsers`

6. success with custom pageNumber and pageSize
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&pageSize=5" -X POST http://localhost:2039/GetUsers`
    - `curl -d "token="(cat /tmp/token)"&pageSize=5&pageNumber=2" -X POST http://localhost:2039/GetUsers`

### CreateRecord
1. missing parameters
    - `curl -X POST http://localhost:2039/CreateRecord`

2. please log in
    - `curl -d "token="(random)(random)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord`

3. not permitted
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord`

4. username not registered
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&username="(random)(random)"&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord`

5. success with creating own record
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord`

6. success with creating another user's record for admin
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord`

### UpdateRecord
1. missing parameters
    - `curl -X POST http://localhost:2039/UpdateRecord`

2. please log in
    - `curl -d "token="(random)(random)"&id="(random)(random)"&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/UpdateRecord`

3. id not found
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&id="(random)(random)"&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/UpdateRecord`

4. not permitted
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id'`
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&id="(cat /tmp/id)"&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/UpdateRecord`

5. username not registered
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id'`
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&id="(cat /tmp/id)"&username="(random)(random)"&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/UpdateRecord`

6. success with updating own record
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id'`
    - `curl -d "token="(cat /tmp/token)"&id="(cat /tmp/id)"&dateAndTime=1/2/2017, 12:15:17 PM&description=new desc&amount=200" -X POST http://localhost:2039/UpdateRecord`

7. success with updating another user's record for admin
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id'`
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&id="(cat /tmp/id)"&dateAndTime=1/2/2017, 12:15:17 PM&description=new desc&amount=200" -X POST http://localhost:2039/UpdateRecord`

### DeleteRecords
1. missing parameters
    - `curl -X POST http://localhost:2039/DeleteRecords`

2. please log in
    - `curl -d "token="(random)(random)"&ids=[]" -X POST http://localhost:2039/DeleteRecords`

3. not permitted
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id1; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id1'`
    - `rm -rf /tmp/id2; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id2'`
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&ids=[\""(cat /tmp/id1)"\",\""(cat /tmp/id2)"\"]" -X POST http://localhost:2039/DeleteRecords`

4. success with deleting own record
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id1; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id1'`
    - `rm -rf /tmp/id2; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id2'`
    - `curl -d "token="(cat /tmp/token)"&ids=[\""(cat /tmp/id1)"\",\""(cat /tmp/id2)"\"]" -X POST http://localhost:2039/DeleteRecords`

5. success with deleting other user's records for admin
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `rm -rf /tmp/id1; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id1'`
    - `rm -rf /tmp/id2; curl -d "token="(cat /tmp/token)"&username=ac&dateAndTime=1/1/2017, 11:11:11 PM&description=desc&amount=100&comment=comm" -X POST http://localhost:2039/CreateRecord | vim - -c 'v/id":"\zs\d*\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/id2'`
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&ids=[\""(cat /tmp/id1)"\",\""(cat /tmp/id2)"\"]" -X POST http://localhost:2039/DeleteRecords`

### GetRecords
1. missing parameters
    - `curl -X POST http://localhost:2039/GetRecords`

2. please log in
    - `curl -d "token="(random)(random) -X POST http://localhost:2039/GetRecords`

3. success with own records for non admin
    - `rm -rf /tmp/token; curl -d "username=ab&password=ab" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetRecords`

4. success with all records for admin
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetRecords`

5. success with date range
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&from=1497801600000&to=1498492799000" -X POST http://localhost:2039/GetRecords`

6. success with amount range
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&min=10&max=20" -X POST http://localhost:2039/GetRecords`

7. success with both date and amount range
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&from=1497801600000&to=1498492799000&min=10&max=20" -X POST http://localhost:2039/GetRecords`

8. success with pageNumber and pageSize
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&pageSize=5&pageNumber=1" -X POST http://localhost:2039/GetRecords`
    - `curl -d "token="(cat /tmp/token)"&pageSize=5&pageNumber=2" -X POST http://localhost:2039/GetRecords`

9. success with all date range, amount range, pageNumber and pageSize
    - `rm -rf /tmp/token; curl -d "username=aa&password=aa" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token)"&from=1497801600000&to=1498492799000&min=10&max=20&pageSize=5&pageNumber=1" -X POST http://localhost:2039/GetRecords`
    - `curl -d "token="(cat /tmp/token)"&from=1497801600000&to=1498492799000&min=10&max=20&pageSize=5&pageNumber=2" -X POST http://localhost:2039/GetRecords`

### GetSummary
1. missing parameters
    - `curl -X POST http://localhost:2039/GetSummary`

2. please log in
    - `curl -d "token="(random)(random) -X POST http://localhost:2039/GetSummary`

3. success
    - `rm -rf /tmp/token; curl -d "username=ac&password=ac" -X POST http://localhost:2039/LogIn | vim - -c 'v/token":"\zs................\ze"/d' -c 'normal dgn' -c 'normal Vp' -c 'x! /tmp/token'`
    - `curl -d "token="(cat /tmp/token) -X POST http://localhost:2039/GetSummary`

