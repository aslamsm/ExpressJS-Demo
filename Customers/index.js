
const express = require("express"); 

const app = express(); 

app.use(express.json()); 

// Start the server and listen on port 3000. The callback runs once the server is ready.
app.listen(3000, () => {
  console.log("Express JS Backend running on http://localhost:3000");
});

let customers = []; 


app.get("/customers", (req, res) => {
  res.json(customers);
});


app.get("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const CustomerObj = customers.find((Customer) => Customer.id === id);
  if (!CustomerObj) {
    res.statusCode = 404;
    res.json({
      message: "Customer not found!",
    });
  } else {
    res.statusCode = 200;
    res.json(CustomerObj);
  }
});

app.delete("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const CustomerObj = customers.find((Customer) => Customer.id === id);
  if (!CustomerObj) {
    res.statusCode = 404;
    res.json({
      message: "Customer not found!",
    });
  } else {
    const index = customers.indexOf(CustomerObj); 
    customers.splice(index, 1);
    res.json({
      message: "Customer deleted successfully",
    });
  }
});

app.post("/addcustomer", (req, res) => {
  let custData = req.body; 
  let validator = require("validator");
  if (!custData.name || custData.name.trim().length <= 3) {
    return res.status(400).json({
      message: "Name should be at least 3 characters",
    });
  }

  if (!custData.email || !validator.isEmail(custData.email)) {
    return res.status(400).json({
      message: "Invalid email... please make sure !",
    });
  }

  const phone = custData.phone;
  if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
    return res.status(400).json({
      message: "Invalid Mobile Number !",
    });
  }

  const age = custData.age;
  if (age === undefined || !Number.isInteger(age) || age < 18 || age > 100) {
    return res.status(400).json({
      message: "Age must be between 18 and 100",
    });
  }


  const dob=custData.dateOfBirth;
  if (!dob || !validator.isDate(dob)) {
    return res.status(400).json({
      message: "Invalid date format. should be => (YYYY-MM-DD)"
    });
  }

  if (new Date(dob) > new Date()) {
    return res.status(400).json({
      message: "Date of birth cannot be in the future"
    });
  }

  const crlimit=custData.creditLimit;
  if (
    crlimit !== undefined &&
    (isNaN(crlimit) || crlimit < 0)
  ) {
    return res.status(400).json({
      message: "Credit limit must be a positive number"
    });
  }

  const gstNumber = custData.gstnum;
  
    if (
    gstNumber &&
    !validator.matches(
      gstNumber,
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    )
  ) {
    return res.status(400).json({
      message: "Invalid GST number format"
    });
  }

  custData.id = customers.length + 1; 
  customers.push(custData); 

 res.status(201).json({
       message: "Customer created Successfully",
    Customer: custData,
  });
});


app.put("/customers/:id", (req, res) => {

  const id = parseInt(req.params.id);
  const CustomerObj = customers.find((Customer) => Customer.id === id);

  if (!CustomerObj) {
    return res.status(404).json({
      message: "Customer not found!",
    });
  }

  const CustomerRequest = req.body;
  CustomerObj.name = CustomerRequest.name;
  CustomerObj.email = CustomerRequest.email;

  res.json({
    message: "Customer Updated Successfully",
    Customer: CustomerObj,
  });
});

