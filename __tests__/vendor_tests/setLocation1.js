const request = require('supertest')
//need export app from app.js 
const app = require('../../app');
const Vendor = require('../../models/Vendor');

/*------------------------------------This is Integration test part--------------------------------- */
describe('Integration test: set locations',()=>{
    //create agent and cookie
    let agent = request.agent(app)
    let cookie = null;

 
    beforeAll(()=>agent
    //send a POST request to login
    .post('/vendor/login')  
    .set('Content-Type', 'application/x-www-form-urlencoded')
    //send van_first_name, van_last_name and locDescription
    .send({
        van_first_name: 'Backdoor',
        van_last_name:'Festival',
        locDescription:'5644',
    })
    //get the back cookie and store it
    .then((res)=>{
        cookie = res
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    }));

    //Test Case 1: Trying to get log in and access to vendor page
    test('Test 1 (valid login)',() => {
        return agent

        .get('/vendor/login')

        .set('Cookie',cookie)
        .then((response)=>{
            expect('/vendor');
        })

    })

    //Test Case 2: Trying to get log in and access to order page
    test('Test 2 (go to setLocation)',() => {
        return agent

        .get('/vendor/VAN11/orders')

        .set('Cookie',cookie)
        .then((response)=>{
            expect('/vendor/VAN11/orders');
            
        })

    })


})