const {User, Purchase , Deposit , Withdrawal , Income_history} = require('../db');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const twilio = require('twilio');
const fast2sms = require('fast-two-sms');

let SSID_KEY , TOKEN_KEY;

  SSID_KEY = 'AC0232ecd6b8c1994405b8f035e3edf0ac' ;
  TOKEN_KEY = '191a6d8d0396203297f09a4a10ba0c8b';

let config = twilio(SSID_KEY , TOKEN_KEY);


// enter transaction id > return user details and deposit details > click submit > change the user details and then change parent details > return the details of updated user and parent ;

class user_functions {

  // league type 0 = virtual || league type 1 = league

  static sign_new_user = async (req , res)=>{

    res.clearCookie('id');

    let body = req.body;

    let inv = await generate_inv_code();

    let user_found = await User.findOne({USER : body.mobile_num});

    let data = {
      USER : body.mobile_num,
      PASS : body.password,
      INV : parseInt(inv),
      PARENT : parseInt(body.is_invited),
    }

    let newUser = new User(data);

    // verify the otp
    if(req.session['otp'] == undefined || !req.session['otp']){
      return res.send({status : 0});
    }else{
      let user_otp = parseInt(body.otp);
      if( parseInt(req.session['otp']) !== user_otp ){
        return res.send({status : 300});
      }
    }

    if(body.is_invited !== 0 && !user_found){

      let parent = await User.findOne({INV : data['PARENT']});

      if(parent){

        let is_created = await createUser(newUser);

        if(is_created){

          await increment_parent_mem(body.is_invited);

          req.session.user_id = is_created['_id'].valueOf();
          req.session.inv = is_created['INV'];

          return res.send({status : 1});

        }else{
          return res.send({status : 0})
        }

      }else{
        return res.send({status : 0})
      }


    }else if(body.is_invited == 0 && !user_found ){

      let new_user_created = await createUser(newUser);

      if(new_user_created){

        req.session.user_id = new_user_created['_id'].valueOf();
        req.session.inv = new_user_created['inv'];
        return res.send({status : 1});

      }else{
        return res.send({status : 0});
      }

    }else{
      if(user_found){
        return res.send({status : 404});
      }else{
        return res.send({status : 0})
      }
    }
  }

  static login_user = async (req , res)=>{

    let data = req.body;
    let db_user = await User.findOne({USER : data.name});

    if(!data.pass || data.pass == 'undefined'){
      return res.send({status : 0});
    }

    if(
      db_user !== null &&
      db_user.PASS.localeCompare(data.pass) == 0
    ){

      req.session.user_id = db_user['_id'].valueOf();
      req.session.inv = db_user['INV'];
      return res.send({status : 1});

    }else{
      return res.send({status : 'WRONG CREDENTIALS'});
    }

  }

  static add_bank_details = async (req, res)=>{

    let USER_ID = req.session.user_id;

    let the_user = await User.findOne({_id : USER_ID})

    if(the_user['BANK_ADDED'] === false){

      let {name , ac_number , ifsc , withdraw_pass} = req.body;
        console.log(req.body);
      if(!name || !ac_number || !ifsc || !withdraw_pass){
        return res.send({status : "something went wrong"});
      }else{

        let updated = await User.findOneAndUpdate( {_id : USER_ID} , {
          BANK_DETAILS : [{
            Name : name,
            AcNumber : ac_number,
            Ifsc : ifsc
          }] ,
           WITHDRAWAL_CODE : withdraw_pass,
           BANK_ADDED : true
        } );
        if(updated){
          return res.send({status : 1});
        }else{
          return res.send({status : 'something went wrong '})
        }
      }

    }else{

      return res.send({status : 'Bank account alerady exists'})//details already exist;

    }

  }

  static change_password = async (req,res)=>{

     let USER_ID =  req.session.user_id;
     let {previous_code , new_code} = req.body;

     if(!previous_code || !new_code){
       return res.send({status : 3})//enter a valid data;
     }else{

        let user_data = await User.findOne({_id : USER_ID});

        if( previous_code === user_data['PASS']){
          await User.findOneAndUpdate({_id : USER_ID} , {PASS : new_code});
          return res.send({status : 1});
        }else{
          return res.send({status : "previous password not matched contact CS . "});
        }

     }
  }

// project 3.0

  static change_password_otp = async(req,res)=>{
    let INV = parseInt(req.session.inv);

    if(!INV || INV == undefined){
      return res.send({status : 0});
    }else{
      let otp_stored = parseInt(req.session.otp);

      if(!otp_stored || otp_stored === undefined){
        return res.send({status : 0});
      }else{
        let body = req.body;

        if( otp_stored !== parseInt(body['otp']) ){
          return res.send({status : 2});
        }else{
          await User.findOneAndUpdate({INV : INV} , {PASS : body['password']});
          return res.send({status : 1});
        }

      }

    }

  }

  // fast 2 sms otp_box

  static otp = async (req, res)=>{

    let  number = getrandom();
    let body = req.body;
    let user_phone ,stat;

    if(!body['number'] || body['number'] == undefined){
      return res.send({status : 'something went wrong'});
    }else{
      if(body['number'].length === 10){
        user_phone = body['number'];
      }else{
        return res.send({status : 'invalid number'});
      }
    }

      let message = `Your OTP for BBK verification is ${number}`
      let options = {
        authorization:
          "X82I7elMQ6if9yR03EcJpqOU1BzGnbdxuVvTLAmoN4tahgHYZsQVzAOpHZa6GvR7EXuBjThL1bfnD9dM",
        message:message,
        numbers: [user_phone],
      };

        stat = await fast2sms.sendMessage(options);
        if(stat['return'] === true){
          req.session.otp = number ;
          return res.send({status : 1})
        }else{
          return res.send({status : 0});
        }

  }

  static purchase = async(req,res)=>{

    let USERID = req.session.user_id;
    let INV = req.session.inv;

    let body = req.body
    const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
    });

    let already_purchased = await Purchase.find({INV : INV , price : parseInt(body['price']) }).count();

    if(already_purchased > 0){
      return res.send({status : "PRODUCT ALREADY EXISTS"});
    }

    let item_id = crypto.randomBytes(16).toString("hex");
    item_id = item_id.slice(0 , 6);

    let today = new Date(nDate);
    let date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
    let redem_date;

    if(today.getDate() === 1){
        let days = parseInt(number_of_days(today.getMonth()));
        redem_date = `${days}/${today.getMonth()}/${today.getFullYear()}`;
    }else{
      redem_date = `${today.getDate()-1}/${today.getMonth()+1}/${today.getFullYear()}`;
    }

    let time = `${today.getHours()}:${today.getMinutes()}`;

    let user_data = await User.findOne({_id : USERID} , {BALANCE : 1});

    if(!user_data['BALANCE'] || user_data['BALANCE'] == 'undefined'){
      return res.send({status : 0});
    }else{

      let item_price = parseFloat(body['price']);
      let user_balance = parseFloat(parseFloat(user_data['BALANCE']).toFixed(3));

      if(user_balance >= item_price){

        let subs_balance = parseFloat(item_price - (2*item_price).toFixed(3));
        let data = {...body , finished : false , DATE : date , TIME : time , ITEM_ID : item_id , INV : INV , REDEEM_DATE : redem_date};

        // saving data in db
        if( await makePurchase(data) ){

          // purchase was successfull ->>> deduct the user money
          await User.findOneAndUpdate({_id : USERID} , { $inc : {BALANCE : subs_balance} });

          return res.send({status : 1});

        }else{
          return res.send({status : 'something went wrong'});
        }

      }else{
        return res.send({status : 'insufficient balance'});
      }

    }

    return res.send({status : 1});

  }

  static change_withdraw_code = async(req,res)=>{
    let body = req.body;
    let INV = req.session.inv;
    if( parseInt(req.session.otp) === parseInt(body['otp']) ){
      let new_code = body['pass'];
      let response = await User.findOneAndUpdate({INV : INV} , {WITHDRAWAL_CODE : new_code});
      if(response !== undefined && response){
        return res.send({status : 1});
      }else{
        return res.send({status : 0});
      }
    }else{
      return res.send({status : 2});
    }

  }

  static daily_income = async(req,res)=>{

    const USERID = req.session.user_id;
    const INV = req.session.inv;
    let body = req.body;

    if(!body || !body['item_id']){
      return res.send({status : 'something went wrong'});
    }else{

      let item_purchased  = await Purchase.findOne({ITEM_ID : body['item_id'] , FINISHED : false});

      if(item_purchased){

        const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
        });

        let today = new Date(nDate);
        let purchase_date = item_purchased['REDEEM_DATE'].split('/');

        let date1 = parseInt(today.getDate());
        let month1 = parseInt(today.getMonth()+1);
        let date2 = parseInt(purchase_date[0]);
        let month2 = parseInt(purchase_date[1]);
        let days = 0;

        if(month1 !== month2){

          days += (number_of_days(month2) - date2);

          month2++;
          month2 = (month2 === 13)? 1 : month2;

          let count = 0;
          while(month2 !== month1){
            days += number_of_days(month2);
            month2++;
          }

          days += date1;

        }else if(month1 === month2 && date1 !== date2){
          days = Math.abs(date1 - date2);
        }else if(date1 === date2){
          return res.send({status : 'TODAY REWARD ALREADY COLLECTED'});
        }

        // till here the number of days is set now only we have to do the rest of claculation

        if(days > parseInt(item_purchased['validity']) ){

          await
            Purchase.findOneAndUpdate({ITEM_ID : item_purchased['ITEM_ID']} , {FINISHED : true , validity : 0});

          return res.send({status : 'validity ends here'});

        }else{

          let days_to_subs = days - 2*days;

          if( parseInt(item_purchased['validity']) - days > 0){

            await Purchase.findOneAndUpdate({ITEM_ID : item_purchased['ITEM_ID']} , {
              $inc : {
                validity : days_to_subs,
              },
              REDEEM_DATE : `${date1}/${month1}/2023`
            });

            await User.findOneAndUpdate({INV : item_purchased['INV']} , {
              $inc : {
                PROFIT : item_purchased['daily_income']
              }
            })

            // now here we have to give bonuses to the parent
            let this_user  = await User.findOne({INV : item_purchased['INV']} , {PARENT : 1})

            //  IF THE PARENT EXISTS
            let this_user_parent = parseInt(this_user['PARENT']);

            if(this_user_parent !== 'undefined' && this_user_parent !== 0){
                  // this will be the first child of this_user_parent
                  let level1_rebade =
                   (parseFloat(item_purchased['daily_income'])/100)*12;
                  let level2_rebade =
                   (parseFloat(item_purchased['daily_income'])/100)*8;
                  let level3_rebade =
                    (parseFloat(item_purchased['daily_income'])/100)*6;

                  let level1_updated =  await
                    User.findOneAndUpdate(
                      {INV : this_user_parent} , {
                        $inc: {
                          REBADE : parseFloat(level1_rebade.toFixed(3)),
                          PROFIT :    parseFloat(level1_rebade.toFixed(3)),
                        }
                      }
                    )

                  if(level1_updated && level1_updated['PARENT'] !== 'undefined' && level1_updated['PARENT'] !== 0){

                    let level2_updated =  await
                      User.findOneAndUpdate(
                        {INV : parseInt(level1_updated['PARENT']) } , {
                          $inc: {
                            REBADE : parseFloat(level2_rebade.toFixed(3)),
                            PROFIT :    parseFloat(level2_rebade.toFixed(3))

                          }
                        }
                      )

                    if(level2_updated && level2_updated['PARENT'] !== 'undefined' && level2_updated['PARENT'] !== 0){

                      let level3_updated =  await
                        User.findOneAndUpdate(
                          {INV : this_user_parent} , {
                            $inc: {
                              REBADE : parseFloat(level3_rebade.toFixed(3)),
                              PROFIT :    parseFloat(level3_rebade.toFixed(3))

                            }
                          }
                        )

                    }

                  }
            }


          }else{

            await Purchase.findOneAndUpdate({ITEM_ID : item_purchased['ITEM_ID']} , {
              validity : 0,
              FINISHED : true
            });

          }

          // creating a income history
          let income_data = {
            name : item_purchased['product'],
            date : `${date1}/${month1}/2023`,
            inv  : INV,
            income : item_purchased['daily_income']
          }
          let x = await Income_history.create(income_data);
          return res.send({status : 'REDEAMED'})
        }

      }else{
        return res.send({status : 'something went wrong'});
      }

    }

  }

  static deposited = async (req,res)=>{

    let {amount , transaction_id} = req.body;

    let INVITATION_CODE = parseInt(req.session.inv);
    let trans_id_exist = await Deposit.findOne({transactioin_id : transaction_id , inv : INVITATION_CODE});

    if(!trans_id_exist){
      if(amount && transaction_id){

      amount = parseFloat(amount);
      const nDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Calcutta'
      });

      let today = new Date(nDate);

      let date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;


      let data = {
        date : date,
        Ammount : amount,
        inv : INVITATION_CODE,
        transactioin_id : transaction_id,
        status : 0
      }

      if(await newDeposit(data)){

        let body = `
          DATE : ${date} \n
          INVITATION_CODE : ${data.inv} \n
          AMOUNT :  ${data.Ammount} \n
          TRANSACTION_ID : ${data.transactioin_id}
          `
        SENDMAIL('DEPOSIT' , body);

        res.send({status : 1});
      }else{
        res.send({status : 0});
      }

      }else{
      return res.send({status : 2}) // something went wrong with amount or the transaction id;
    }
    }else{
      return res.send({status : 3});
    }

  }

  static withdraw = async (req,res)=>{
     let INVITATION_CODE = parseInt(req.session.inv);
     let USER_ID = req.session.user_id;
     let {withdrawal_code , amount} = req.body;
     let today = new Date();
     let transactioin_id = crypto.randomBytes(16).toString("hex");
     transactioin_id = transactioin_id.slice(0 , 6);
     let U_details = await User.findOne({INV : INVITATION_CODE} , {WITHDRAWAL_CODE : 1 , WITHDRAWAL_DATE : 1 , BANK_DETAILS : 1 , PROFIT : 1});

     let w_details = U_details['WITHDRAWAL_CODE'];
     let last_withdrawal = parseInt(U_details['WITHDRAWAL_DATE']);


     if(w_details == 0 || withdrawal_code !== w_details){
       return res.send({status : 'enter a VALID withdrawal code first'});//enter withdrawal code first
     }

     if( U_details['BANK_DETAILS'] == 'undefined' || !U_details['BANK_DETAILS'].length || !U_details['BANK_DETAILS'][0] || !U_details['BANK_DETAILS'][0]['Name']){

       return res.send({status : 'You dont have a bank account . '});
     }

     amount = parseFloat(amount);
     // check wethere user has the required balance or not
     if(amount > parseFloat(U_details['PROFIT'])){
       return res.send({status : 'YOU DONT HAVE ENOUGH BALANCE'});
     }

     if(withdrawal_code === w_details){
        if(last_withdrawal !== today.getDate() || last_withdrawal == 0){

       if(amount && transactioin_id && withdrawal_code){


       let date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;


       let data = {
         date : date,
         Ammount : amount,
         inv : INVITATION_CODE,
         transactioin_id : transactioin_id,
         status : 0
       }

       if(await newWithdrawal(data)){

         let deduct_amount = parseFloat(data['Ammount'] - (2*data['Ammount']))
         // deduct the amount from the user and increment the withdrawal amount and withdrawal count;
         await User.findOneAndUpdate({_id : USER_ID} , {
           $inc : {PROFIT : deduct_amount ,
                   withdrawalAmmount : parseFloat(data['Ammount']),
                  } ,
           WITHDRAWAL_DATE : today.getDate()
         });

         let body = `
           INVITATION_CODE  : ${INVITATION_CODE} \n
           BANK ACCOUNT NO. : ${U_details['BANK_DETAILS'][0]['AcNumber']} \n
           USER NAME        : ${U_details['BANK_DETAILS'][0]['Name']} \n
           IFSC             : ${U_details['BANK_DETAILS'][0]['Ifsc']} \n
           AMOUNT           : ${amount}\n
           AMOUNT - 10% : ${amount - parseFloat((amount/10).toFixed(3)) } \n
           TRANSACTION ID : ${data['transactioin_id']}
           DATE : ${date} \n
         `

         SENDMAIL('WITHDRAWAL' , body);

         res.send({status : 1});

       }else{

         res.send({status : 0});
       }

       }else{

       return res.send({status : 'something went wrong with amount.'}) // something went wrong with amount or the transaction id;
     }
        }else{

       return res.send({status : 'you have reached you daily withdrawal limit.'}); //transaction id already exists;
     }
     }else{
       return res.send({status : 'INCORRECT WITHDRAWAL CODE'});
     }

   }



// admin-functions

  static ad_settle_withdraw = async(req,res)=>{
    let body = req.body;

    let transaction_id = body['transaction_id'];
    let invitation_code = parseInt(body['invitation_code']);
    let amount = parseFloat(body['amount']);
    let status = parseInt(body['status']);

    if(!transaction_id || transaction_id == undefined ||
       !invitation_code || invitation_code == undefined ||
       !amount || amount == undefined ||
       !status || status == undefined
     ){
       return res.send({status : 0});
     }else{
       let response = await Withdrawal.findOneAndUpdate({
         Ammount : amount ,
         transactioin_id : transaction_id ,
         inv : invitation_code ,
         status : 0} , {
           status : status
         });
        if(response !== undefined && response){
          return res.send({status : 1});
        }else{
          return res.send({status : 0});
        }
     }

  }

  static ad_settle_deposit = async(req,res)=>{
    let body = req.body;

    let transaction_id = body['transaction_id'];
    let invitation_code = parseInt(body['invitation_code']);
    let amount = parseFloat(body['amount']);
    let status = parseInt(body['status']);

    if(!transaction_id || transaction_id == undefined ||
       !invitation_code || invitation_code == undefined ||
       !amount || amount == undefined ||
       !status || status == undefined
     ){
       return res.send({status : 0});
     }else{
       let response = await Deposit.findOneAndUpdate({
         Ammount : amount ,
         transactioin_id : transaction_id ,
         inv : invitation_code ,
         status : 0} , {
           status : status
         });
        if(response !== undefined && response){
          if(status === 1){
            let data = await User.findOneAndUpdate({INV : invitation_code} , {$inc : {BALANCE : amount , DEPOSIT : amount}});
            return res.send({status : 1});
          }
        }else{
          return res.send({status : 0});
        }
     }

  }

}

module.exports = user_functions;



// this function will send otp using twilio
function getrandom(){
  let x = Math.ceil(Math.random()*10000);
  if(x < 1000){
    getrandom();
  }else{
    return x;
  }
}


// this function will create purchase data

async function makePurchase(data){
  let res = await Purchase.create(data);
  return (!res)? false : true;
}


// this function will return number of days a month have ;
function number_of_days(month){

  let month30s = [4, 6, 9, 11];
  let month31s = [1, 3, 5, 7, 8, 10, 12];
  if(month30s.includes(month)){
    return 30;
  } else if (month31s.includes(month)) {
    return 31;
  } else {
    return 28;
  }

}


// this function saves the new bet user has placed;
async function newBet(data){

  let res = await Bet.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;

}

// this will create a new deposit form at the database;
async function newDeposit(data){

  let res = await Deposit.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;
}

// when a user initiates a new withdrawal this will save teh data to the database
async function newWithdrawal(data){

  let res = await Withdrawal.create(data);
  let what_happened = (!res)? false : true;
  return what_happened;
}

// it will increment the member of the user who has invited this new user while sign_in;
async function increment_parent_mem(inv){
  let x = await User.updateOne({INV : inv} , {$inc : {
    MEMBERS : 1
  }})

  return;
}

 // it will check the date wethere its valid to place bet and match has not been started;
async function check_date(date , time ){


  const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Calcutta'
  });
  let today = new Date(nDate);

  let match_date = date.split(/\//);
  let m_time = time.split(/\:/);
  // console.log(m_time);
  let m_date = parseInt(match_date[0]);
  let m_month = parseInt(match_date[1]);
  let m_hours = parseInt(m_time[0]);
  let m_minutes = parseInt(m_time[1]);

  let minutes_now = parseInt(today.getMinutes());
  let hours_now = parseInt(today.getHours());

  // console.log(minutes_now , 'without');
  minutes_now += 5;
  if(minutes_now >= 60 ){
    minutes_now = minutes_now - 60;
    hours_now += 1;
  }

  let valid_date = (parseInt(today.getDate()) === m_date);
  let valid_hour = (hours_now < m_hours);
  let valid_minutes = ( minutes_now < m_minutes );
  let equal_hours = (hours_now === m_hours);
  // console.log(m_date , today.getDate(), m_hours , hours_now , minutes_now , m_minutes);
  // console.log(today);

  if(valid_date && valid_hour || valid_date && equal_hours && valid_minutes){
    return true;
  }

  return false;

}

// after signup it will create a new user at the database;
async function createUser(data){

  let res = await User.create(data);

  return res;

};

// this function will create the new invitation code for new users when signed in ;
async function generate_inv_code(){

  let code_exist = false;
  let inv_code = parseInt(Math.floor(Math.random()*10000));

  let res = await User.findOne({INV : inv_code});

  // if found then code_exist = true;

  code_exist = (res)? true : false;

  if(inv_code < 1000 || code_exist){
    return generate_inv_code();
  }

  return inv_code;

}

// mail sender
async function SENDMAIL(subject , body){

  let to = '';

  switch (subject) {

    case 'WITHDRAWAL':
      to = 'rockyraj0969@gmail.com';
      break;
    case 'DEPOSIT':
      to = 'jyotikumari63421@gmail.com';
      break;
    case 'BET DELETE':
      to = 'simrankumari6343@gmail.com';
      break;
    case 'VIRTUAL':
      to = 'manojkumar757320@gmail.com';
      break;
    default:
     to = 'amitram070651@gmail.com';
  }
   // console.log(to , subject);
  let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
      user : 'vkv9162871357@gmail.com',
      pass : 'kahsizmojovvmsio'
    }
  })

  let mailOptions = {
    from : 'vkv9162871357@gmail.com',
    to : to,
    subject : subject,
    text : body
  }

  transporter.sendMail(mailOptions , async(err , info)=>{
    if(err){
      console.log(err);
    }
  })
}
