const express = require("express");
var fs = require("fs");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var account = JSON.parse(fs.readFileSync('./account.json'));
fs.readFile("./account.json", "utf-8", (err, data) => {
    if (err) throw err;
    var account = JSON.parse(data);
    console.log(account);
});
var balance = account.checkingBalance;
var savingBalance = account.savingBalance;


app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.post("/submit", (req, res) => {

    const name = req.body.username;
    const jsonData = fs.readFileSync(path.join(__dirname, 'account.json'), 'utf-8');
    const object = JSON.parse(jsonData);

    res.render("home.ejs", { customerName: name, account: object });
});


app.post("/home.ejs", function (req, res) {
    let error;
    if (req.body.banking == 'Deposit') {
        res.render("Deposit.ejs", {
            layout: false

        });
    }
    else if (req.body.banking == 'Withdrawal') {
        res.render("Withdrawal.ejs", {
            layout: false

        });
    }
    else if (req.body.banking == 'Save') {
        res.render("Saving.ejs", {
            layout: false

        });


    } else {
        error = 'Invalid Account Number';
        res.render("home.ejs", {
            layout: false,
            'title': 'Login',
            errors: error
        });
    }
});

app.post("/Deposit.ejs", function (req, res) {
    var depositAmount = parseFloat(req.body.depositeAmount);
    const name = req.body.username;
    const jsonData = fs.readFileSync(path.join(__dirname, 'account.json'), 'utf-8');
    const object = JSON.parse(jsonData);

    if (req.body.cancel == "cancel") {
        res.render("home.ejs", { customerName: name, account: object });
    }
    else {
        if (depositAmount > 0) {
            console.log(depositAmount + "Deposited into the account");
            balance += depositAmount;


            (account.checkingBalance = balance);

            fs.writeFileSync(__dirname + '/account.json', JSON.stringify(account, null, 4), (err) => {
                if (err) throw err;
                console.log("Account.Json File successfully updated.");
            });

            error = depositAmount + "deposited  into account";
            console.log("You deposited " + depositAmount + "into account ");

            res.render("home.ejs", {
                customerName: name, account: object,
                layout: false,
                errors: error
            });
        } else {
            error = "Deposit was unsucessful for account number";
            return res.render("home.ejs", {
                customerName: name, account: object
            });
        }
    }
});

//this function allows the user to withdraw money from their account
app.post("/withdrawal.ejs", function (req, res) {
    var withdrawalAmount = parseFloat(req.body.withdrawalAmount);
    const name = req.body.username;
    const jsonData = fs.readFileSync(path.join(__dirname, 'account.json'), 'utf-8');
    const object = JSON.parse(jsonData);

    if (req.body.cancel == "cancel") {
        res.render("home.ejs", { customerName: name, account: object });
    }
    else {
        if (withdrawalAmount <= balance) {
            console.log(withdrawalAmount + " Withdrawaled from your account");
            balance -= withdrawalAmount;


            (account.checkingBalance = balance);

            fs.writeFileSync(__dirname + '/account.json', JSON.stringify(account, null, 4), (err) => {
                if (err) throw err;
                console.log("Account.Json File successfully updated.");
            });

            error = withdrawalAmount + "withdrawaled from account";
            console.log("You withdrawaled  " + withdrawalAmount + "into account ");

            res.render("home.ejs", {
                customerName: name, account: object,
                layout: false,
                errors: error
            });
        } else if (withdrawalAmount > balance) {

            error = "Insufficient Funds";
            console.log("Insufficient Funds to withdraw " + withdrawalAmount);

            res.render("home.ejs", {
                customerName: name, account: object,
                layout: false,
                errors: error
            });
        }
        else {
            error = "Deposit was unsucessful for account number";
            return res.render("home.ejs", {
                customerName: name, account: object
            });
        }
    }
});


app.post("/Saving.ejs", function (req, res) {
    var savingAmount = parseFloat(req.body.savingAmount);
    const name = req.body.username;
    const jsonData = fs.readFileSync(path.join(__dirname, 'account.json'), 'utf-8');
    const object = JSON.parse(jsonData);

    if (req.body.cancel == "cancel") {
        res.render("home.ejs", { customerName: name, account: object });
    }
    else {
        if (savingAmount > 0) {
            console.log(savingAmount + "Deposited into the saving account");
            balance -= savingAmount;
            (account.savingBalance = savingBalance + savingAmount);


            (account.checkingBalance = balance);

            fs.writeFileSync(__dirname + '/account.json', JSON.stringify(account, null, 4), (err) => {
                if (err) throw err;
                console.log("Account.Json File successfully updated.");
            });

            error = savingAmount + "deposited  into  saving account";
            console.log("You deposited " + savingAmount + "into account ");

            res.render("home.ejs", {
                customerName: name, account: object,
                layout: false,
                errors: error
            });
        } else {
            error = "Saving was unsucessful for account number";
            return res.render("home.ejs", {
                customerName: name, account: object
            });
        }
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
// app.listen(process.env.PORT || 3000, () => {
//     console.log("Server running on port 3000");
// });
