
const request = require('supertest')

const app = require('../../app');
//const { TestWatcher } = require('@jest/core');

describe('Integration test: set locations',()=>{
    let agent = request.agent(app)

    let cookie = null;


    beforeAll(()=>agent
    
    .post('/vendor/login')
    
    .set('Content-Type', 'application/x-www-form-urlencoded')

    .send({
        van_first_name: 'Backdoor',
        van_last_name:'Festival',
        locDescription:'5644',
    })



    .then((res)=>{
        cookie = res
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    }));


    test('Test 1 (valid login)',() => {
        return agent

        .get('/vendor/login')

        .set('Cookie',cookie)
        .then((response)=>{
            expect('/vendor');
        })

    })


    test('Test 2 (go to setLocation)',() => {
        return agent

        .get('/vendor/VAN11/setLocation')

        .set('Cookie',cookie)
        .then((response)=>{
            expect('/vendor/VAN11/setLocation');
            
        })

    })


})