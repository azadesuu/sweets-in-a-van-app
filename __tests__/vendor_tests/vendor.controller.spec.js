
//unit integration tests
const vendorController = require('../../controllers/vendorController');    
const Vendor = require('../../models/vendor'); 

describe('vendorController', function () {
    const mockResponse = {
            render: jest.fn()
    }

    const mockRequest = {
    }
 
    describe('getAllVendor', function() {
        test("the render method should have been called", function(){
        })

        test("should have rendered the authorlist template", function(){
            
        })
})});

beforeAll(() => {
    // clear the render method (also read about mockReset)
    mockResponse.render.mockClear();
    
    // mock the Mongoose find() method return a
    // dummy list of authors
    Vendor.find = jest.fn().mockResolvedValue([
        {
            van_ID:"VAN19",
            van_first_name:"Joyful",
                van_last_name:"Runway",
        },
        {
            van_ID:"VAN110",
            van_first_name:"Musical",
            van_last_name:"Green",
        }
    ]);
    // We are using the lean() method, so need to 
    // mock that as well. I'm mocking the function
    // to return Plain Old JavaScript Object (POJO)
    Author.find.mockImplementationOnce(() => ({
        lean: jest.fn().mockReturnValue([
            {
                van_first_name:"Joyful",
                van_last_name:"Runway",
                latitude:0,
                van_ID:"VAN19",
                locDescription:"",
                isOpen:false,
                longitude:0
            },
            {
                van_first_name:"Musical",
                van_last_name:"Green",
                latitude:0,
                van_ID:"VAN110",
                locDescription:"",
                isOpen:false,
                longitude:0
            }
        ]),
    }));

    // call the controller function before testing various properties of
    // it
    vendorController.searchOrder(mockRequest, mockResponse);
  }));