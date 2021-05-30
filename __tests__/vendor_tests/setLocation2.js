
const supertest = require('supertest');
const app = require('../../app');
const vendor = require('../../models/Vendor');

describe('integration - authors', function() {
    describe('setLocation', function() {
        test('check if we can update a van\'s location', function() {

        })
    })
})


describe('integration - vendors', function() {
    describe('addAuthor', function() {
        test('check if we can add an author', async function() {
            // create a dummy author
            let newAuthor = null;//{authorId:'10003', first_name:'Candy', last_name:'Crystal'};
            
            // send a HTTP POST request th author-management route
            // with the dummy author
            const res = await supertest(app)
                .post('/author-management')
                .send(newAuthor);
                // expect server to say everything is OK
                expect(res.statusCode).toBe(200); 

                // I expect the author controller to return the new author
                // object back, and I'm doing a partial match of the 
                // author properties that I have as the dummy value
                // QUESTION: what's different between res.body and newAuthor
                //           that requires a partial match, and what are other
                //           ways to test?
                expect(res.body).toEqual(expect.objectContaining(newAuthor));
        })
    })
})

