const {User, Purchase , Deposit , Withdrawal , Income_history} = require('../db');

class user_data {

  static get_members_data = async(req , res)=>{
    let data = {};
    const INVITATION_CODE = req.session.inv;

      let direct_members = await User.find(
        {parent : INVITATION_CODE},
        {_id : 0 , user : 1 , members : 1 , Ammount : 1 ,  Withdrawals : 1 , withdrawalAmmount : 1   , betPlayed : 1 , inv : 1 , deposit : 1 , profit : 1}
      );
      let level2_user = [];
      let level3_user = [];


      for(let i = 0 ; i< direct_members.length; i++){

       let level2 =   await User.find(
          {parent : direct_members[i].inv},
          {_id : 0 , user : 1 , members : 1 , Ammount : 1 , Withdrawals : 1 , withdrawalAmmount : 1 , betPlayed : 1 ,  inv : 1, deposit : 1 , profit : 1 , }
        );
        level2_user.push(level2);

        for(let j = 0 ; j < level2.length; j++){
          let level3 =  await User.find(
             {parent : level2[j].inv},
             {_id : 0 , user : 1 , members : 1 , Ammount : 1 , Withdrawals : 1 , withdrawalAmmount : 1  , betPlayed : 1 ,  inv : 1, deposit : 1 , profit : 1}
           );
           level3_user.push(level3);
           // level3_user.pu = level3;
        }

      }

      data  = {status : 1 ,direct_members ,  level2_user , level3_user};

      return res.send(data);

  }

// project 3.0
  static get_inv = async(req,res)=>{
    let INV = req.session.inv;
    if(INV){
      return res.send({INV : INV});
    }
    return res.send({status : 0})
  }

  static get_purchase_data = async(req,res)=>{
    let INV = req.session.inv;

    if(!INV || INV == 'undefined'){
      return res.redirect('/signup.html');
    }

    let data = await Purchase.find({INV : INV , FINISHED : false});
    return res.send(data);
  }

  static get_deposit_data = async(req,res)=>{
    let INV = req.session.inv;

    if(!INV){
      return res.send({status : 0});
    }

     let data = await Deposit.find({inv : INV});
     return res.send(data);
  }

  static get_withdraw_data = async(req,res)=>{
    let INV = req.session.inv;

    if(!INV){
      return res.send({status : 0});
    }

     let data = await Withdrawal.find({inv : INV});
     return res.send(data);
  }

  static get_income_history = async(req,res)=>{
    let INV =  parseInt(req.session.inv);

    if(!INV || INV == 'undefined'){
      return res.send({status : 0});
    }
    let data = await Income_history.find({inv : INV});
    return res.send(data);
  }

  static get_members_level1 = async(req,res)=>{
    let INV = req.session.inv;

    if(!INV || INV == 'undefined'){
      return res.send({status : 0})
    }

    let data = await User.find({PARENT : INV});
    return res.send(data);
  }

  static get_members_level2 = async(req,res)=>{

    let INV = req.session.inv;

    if(!INV || INV == 'undefined'){
      return res.send({status : 0})
    }
    let level1 = await User.find({PARENT : INV});
    let data = [];
    for(let i = 0; i < level1.length ; i++){
      let data_to_push = await User.find({PARENT : parseInt(level1[i]['INV'])});
      data.push(data_to_push);
    };
    return res.send(data);
  }

  static get_members_level3 = async(req,res)=>{

    let INV = req.session.inv;

    if(!INV || INV == 'undefined'){
      return res.send({status : 0})
    }
    let level1 = await User.find({PARENT : INV});
    let data = [];
    for(let i = 0; i < level1.length ; i++){
      let data_to_push = await User.find({PARENT : parseInt(level1[i]['INV'])});
      data.push(data_to_push);
    };

    let level3_members = [];

    for(let i = 0 ; i<data.length; i++){
      let level3_user = await User.find({PARENT : parseInt(data[i]['INV'])});
      level3_members.push(level3_user);
    }

    return res.send(level3_members);
  }

  static get_team_data = async(req, res)=>{
    let INV = parseInt(req.session.inv);

    if(!INV || INV === 'undefined'){
      return res.send({status : 0});
    }

    let data = await User.findOne({INV : INV});
    let member_deposited = await User.find({PARENT : INV , DEPOSIT : {$gt : 0}}).count();

    let data_to_send = {
      number : data['USER'] ,
      invited: data['MEMBERS'],
      team   : member_deposited
    }
    return res.send(data_to_send);
  }

  static get_profile_data = async (req,res)=>{
    let INV = parseInt(req.session.inv);

    if(!INV || INV ==  undefined){
      return res.send({status : 0});
    }
    let data_to_send = await User.findOne({INV : INV});
    return res.send(data_to_send);
  }

  static logout = async(req,res)=>{
    req.session.destroy();
    return res.send({status : 1});
  }

}

module.exports = user_data;
