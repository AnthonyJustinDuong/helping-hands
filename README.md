## team30
* Anthony Justin Duong
* Maximillian Huang
* Danny Ru
* Junyoung Seok

# Helping Hands

This is a local message board to help elderly, immuno-compromised, or otherwise vulnerable groups. Because people in these groups are more at risk when going outside to buy groceries or run errands, Helping Hands was created to encourage community response to specifically target these groups. Our platform would allow individuals in vulnerable groups to create posts requesting for help with groceries or errands. Then, volunteers in their local community would be able to see these posts and reach out to help. 

### URL to deployed app
https://helpinghands2020.herokuapp.com/

### Prerequisites

This web app was built with ReactJS.
Node and npm must be installed to run it. 
To download, visit https://nodejs.org/en/download/ 

### Edits made for Phase 2


## Getting Started

In command line, clone the GitHub repository:
```
git clone https://github.com/csc309-summer-2020/team30.git
```
Change into the team30 directory in one terminal window  <br />
```
cd team30
```
In a second seperate command terminal, change into the helping_hands directory <br />
```
cd team30/helping_hands
```
Run install and start on each of both command terminals : 
```
npm install
npm start
```

## Using the App as a user

To create an account, click on the "Sign Up" tab on the top banner: <br />  
<img width="473" alt="signup" src="https://user-images.githubusercontent.com/29133130/86501491-3f546c80-bd67-11ea-8eac-441a64ce5daa.png">  

Once you have created an account, you can volunteer to fulfill requests in the Help Needed page: <br />
Here you can view all the current requests and bookmark them for later. As a user, you can also report other users or posts if needed. <br />
<img width="480" alt="help_needed" src="https://user-images.githubusercontent.com/29133130/86501175-84c36a80-bd64-11ea-81ef-2d401a42bf2b.png">  

Through the banner, you can navigate to the FAQ page or the Leaderboard: <br />  
<img width="943" alt="banner" src="https://user-images.githubusercontent.com/29133130/86501710-8a6f7f00-bd69-11ea-9827-9c4431b1c1ea.png">  

Clicking on your profile picture icon in the top right on the banner, you can click "profile" and modify your profile settings. Or clicking on "messages", you can enter the message chat and communicate with other users:  <br />  
<img width="472" alt="profile" src="https://user-images.githubusercontent.com/29133130/86501925-8fcdc900-bd6b-11ea-9c3c-2c0b3c2df5d6.png">  

## Using the App as an admin

Login through clicking the button in the upper right part of the page. <br />
Admin user has the following username and password: username: admin, password: admin <br />
Once an admin is logged in, the admin has access to the following functionality: <br />

#### Controlling reports and posts
Click on the profile icon on the top right of the page and click "manage reports". <br />
On this page, you can see a list of all the reports and the users that were reported <br />
You can block a user or delete any post a user has made on this page and the "Help Needed" page. <br />
You can navigate to the "Help Needed" page through the top banner of the web app to view posts and <br />
block or delete posts directly through there. <br />

## Routes overview

### Users Model
```
app.post("/users/login".. Allows users and admins to login
app.get("/users/logout".. Allows users and admins to logout
app.get("/users/:id".. Gets user by id
app.post("/users".. Generates a new user
app.get("/users/unique-username/:username".. Checks to see if new user property is unique
app.get("/users/unique-email/:email".. Checks to see if new user property is unique
app.patch("/users/:id".. Changes username
```
### Chat Model
```
app.post("/chatrooms".. Generates a new chatroom
app.get("/chatrooms/:id".. Gets all messages in a given chatroom
app.post("/chatrooms/:id".. Send a message to a given chatroom
```
### Post Model
```
app.post("/posts".. Creates a new post
app.get("/posts".. Gets all existing posts
app.get("/posts/fulfilled".. Gets all existing fulfilled posts
app.get("/posts/unfulfilled".. Gets all existing unfulfilled posts
app.get("/posts/user/:id".. Gets a given user's posts
app.get("/posts/:id".. Gets a post with a given id
app.delete("/posts/:id".. Delete a particular post
app.patch("/posts/:id".. Modify a given post
```
### Report Model
```
app.post("/reports".. Creates a new report
app.get("/reports".. Gets all existing reports
app.get("/reports/:id".. Gets a specific report
app.get("/reports/user/:id".. Gets a report from a specific user
app.delete("/reports/:id".. Deleting a report
```
### Leaderboard Model
```
app.get("/leaderboards/:city".. Gets a leaderboard by city
app.post("/leaderboards".. Add a new leaderboard
app.post("/leaderboards/:city".. Add a new leader to a given city
app.patch("/leaderboards/:city/:leader".. Modifying leader within a given city
```
### Images Model
```
app.post("/images".. Post a new image
app.get("/images/:id".. Get an image by id
```




