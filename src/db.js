const mongoose  = require( 'mongoose');
const jwt  = require( 'jsonwebtoken');

let SchemaTypes = mongoose.Schema.Types;

const newUserSchema = new mongoose.Schema ({
    USER : {
      type : String,
      required : true,
      unique : true
    },
    PASS : {
      type : String,
      required : true
    },
    INV : {
      type : Number,
      default : 0
    },
    MEMBERS : {
      type  : Number,
      default : 0
    },
    PARENT : {
      type : Number,
      default : 0
    },
    BALANCE : {
      type : Number,
      default : 5
    },
    DEPOSIT : {type : Number , default : 0},
    BANK_DETAILS : [{
      Name : {type : String , default : "0"},
      AcNumber : {type : String , default : "0" },
      Ifsc : {type : String , default : "0"},
      phone : {type : Number , default : 0}
    }],
    BANK_ADDED: {
      type : Boolean,
      default : false
    },
    REBADE : {type : Number , default : 0},
    WITHDRAWAL_AMM : {type : Number , default : 0},
    PROFIT : {
      type : Number,
      default : 0
    },
    WITHDRAWAL_DATE : {
      type : Number,
      default : 0
    },
    WITHDRAWAL_CODE : {
      type : String,
      default : "0"
    }
});

const newPurchaseSchema = new mongoose.Schema ({
  INV : {
    type : Number,
  },
  price : {
    type : Number,
    default : 0
  },
  daily_income : {
    type : Number,
    default : 0
  },
  validity : {
    type : Number
  },
  product : {
    type : String
  },
  category : {
    type : Number
  },
  item_no : {
    type : Number
  },
  ITEM_ID : {
    type : String
  },
  FINISHED : {
    type : Boolean ,
    default : false
  },
  DATE : {
    type : String,
  },
  TIME : {
    type : String
  },
  REDEEM_DATE : {
    type : String,
  }
});

const newDepositSchema = new mongoose.Schema({
  date : {type : String},
  Ammount : {type : Number},
  inv : {type : Number},
  transactioin_id : {type : String},
  status : {type : Number}// 0 -> pending, 1 -> success , 2 -> canceled
});

const newWithdrawalSchema = new mongoose.Schema({
  date : {type : String},
  Ammount : {type : Number},
  inv : {type : Number},
  transactioin_id : {type : String},
  status : {type : Number} // 0 -> pending, 1 -> success , 2 -> canceled
});

const newIncomeHistorySchema = new mongoose.Schema({
  name : {type : String},
  date : {type : String},
  inv  : {type : Number},
  income : {type : Number}
})

// create schemas for bets and payments

newUserSchema.methods.generateToken = async function(){

  try {

    const token =   jwt.sign({_id : this._id.toString() },'VISHAL');
    return token;

  } catch (e) {
    console.log(e);
  }
}


 const User =  mongoose.model("users" , newUserSchema );
 const Purchase = mongoose.model('purchase' , newPurchaseSchema);
 const Deposit = mongoose.model('deposits' , newDepositSchema);
 const Withdrawal = mongoose.model('withdrawals' , newWithdrawalSchema);
 const Income_history = mongoose.model('incomeHistory' , newIncomeHistorySchema);

module.exports =  {User, Purchase , Deposit , Withdrawal , Income_history};
