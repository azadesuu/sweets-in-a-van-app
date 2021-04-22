**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

Welcome!

We have added to this repository a `README.md`, `.gitignore`, and `.gitattributes`.

* **README.md**: is the document you are currently reading. It should be replaced with information about your project, and instructions on how to use your code in someone else's local computer.

* **.gitignore**: lets you filter out files that should not be added to git. For example, Windows 10 and Mac OS create hidden system files (e.g., .DS_Store) that are local to your computer and should not be part of the repository. This files should be filtered by the `.gitignore` file. This initial `.gitignore` has  been created to filter local files when using MacOS and Node. Depending on your project make sure you update the `.gitignore` file.  More information about this can be found in this [link](https://www.atlassian.com/git/tutorials/saving-changes/gitignore).

* **.gitattributes**: configures the line ending of files, to ensure consistency across development environments. More information can be found in this [link](https://git-scm.com/docs/gitattributes).

Remember that _"this document"_ can use `different formats` to **highlight** important information. This is just an example of different formating tools available for you. For help with the format you can find a guide [here](https://docs.github.com/en/github/writing-on-github).

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Adding Images](#image-preview)
* [Postman Requests](#postman-instructions)

## Team Members

| Name | Task | State |
| :---         |     :---:      |          ---: |
| Ying Shan Saw, Yue Teng, ZiXuan Liu | Back End     |  Done |
| Ying Shan Saw, Bo Cheng, WenYao Li   | Front End  |  In Progress |
| Ying Shan Saw | README Format      |  Done |

## General info
Project Requirements: 

Stage: Deliverable 2
After drawing the UI Mockup, we are testing and planning some routes for the web server, testing small features stated in the requirements.

## Technologies
Project is created with:
* NodeJs 14.16.X
* Ipsum version: 2.33
* Ament library version: 999

## Code Implementation

```JS
//connect database
require('./models');
//connect router
const vendorRouter = require('./routes/vendorRouter.js')
const menuRouter = require('./routes/menuRouter.js')
var path = require('path')

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/static/home.html')) 
})

// vendor routes
app.use('/vendor', vendorRouter)
// customer routes
app.use('/customer', menuRouter)

```

## Image Preview
<p> Here's a preview of our home page. Only has get requests</p>
<p align="center">
  <img src="static/github-images/deliv2-landingpage.png"  width="300" >
</p>

## Postman Instructions
**Heroku**

URL: https://t16-anything-info30005.herokuapp.com/

**MongoDB**

ID=anything30005

Password=F5Nruod8fTvdNTCz

**Full URL**

connectionURL = 'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server'

`Postman Summary`
| Request | URL | Input |
| :---         |     :---      |          :--- |
|**Customer**| | |
|Display all menu items| /customer/menu | N/A || 
|Get a snack’s details| /customer/menu/**snack-name** | **snack-name** must be lowercase and separated by whitespace (%20)|
|Making an order| /customer/:user_ID/menu/order | :userID=USER11, Post JSON request in Exported Requests file| 
|**Vendor**| | :van_ID=VAN11 |
|Setting Van status(and location + location description)| vendor/:van_ID/status | Post JSON request in Exported Requests file | 
|Show a list of outstanding orders| Assumes for a particular van.   vendor/:van_ID/orders | N/A. Should not show any records with status: “Completed”/ “Cancelled” (can compare with all-orders)|
|Mark an order as fulfilled| vendor/:van_ID/orders/:order_ID/change-status | Post JSON request in Exported Requests file| 



**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

