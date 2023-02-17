

const {
  express , hbs , path ,
  mongoose , jwt , cookieParser ,
  crypto , request , jssha , session ,
  MongoDBStore , user_data , admin_function , user_function
} = require('./controlers/imports');

const static_path = path.join( __dirname , '../' , 'public' );
const {User, Bet ,Deposit,Withdrawal} = require('./db');
const html_files = path.join(__dirname , '../' , 'views');

const port = process.env.PORT || 2000;


const app = express();

app.use(express.urlencoded({extended : true}));
app.set('view engine' , 'hbs');
app.use(cookieParser());
app.use(express.json());



app.use(express.static(static_path));


// let link = 'mongodb+srv://herofootball:hero%40123@cluster0.ujlhaqb.mongodb.net/heroFootball?retryWrites=true&w=majority';
let link = 'mongodb+srv://project3-0:vishalkumar@project3-0.owvddx2.mongodb.net/heroFootball?retryWrites=true&w=majority';

mongoose.connect(link)
  .then(function(db){
    console.log('dtabse connected');
  app.listen(port , ()=>{
    console.log(`listening on ${port}`);
  })

})
  .catch(function(err){
  console.log(err);
})

// mongoose.set('strictQuery', false);

const JWT_SECRET = 'VISHAL';

const one_day = 1000 * 60 * 60 * 100;

var store = new MongoDBStore(
  {
    uri: link,
    databaseName: 'heroFootball',
    collection: 'sessions'
  });

app.use(
  session({
  secret : 'vishal',
  resave : false,
  saveUninitialized: false,
  cookie: { maxAge: one_day },
  store : store
}));

const isAuthenticated = (req, res, next) => {
  if(req.session.user_id){
    next();
  }else{
    res.redirect('/sign.html');
  }
}


app.get('/' , (req , res)=>{
  res.sendFile( path.join(html_files , '/home.html') );
})

app.get('/home.html' , (req , res)=>{
  res.sendFile( path.join(html_files , '/home.html') );
})

app.get('/terms.html' , (req, res)=>{
  return res.render('terms');
})

app.get("/product.html" ,isAuthenticated, (req,res)=>{
  res.sendFile( path.join(html_files , '/product.html') );
});

app.get('/sign.html' , (req , res)=>{
    res.sendFile( path.join(html_files , '/sign.html') );
  });

app.get('/signup.html' , (req,res)=>{

  res.sendFile( path.join(html_files , '/signup.html') );

})

app.get('/signup.html/:invitation' , (req,res)=>{
    res.sendFile( path.join(html_files , '/signup.html'));
})

app.get('/forgot.html' , (req , res)=>{
    res.sendFile( path.join(html_files , '/forgot.html') );
  });

app.get('/bankAcc.html' ,isAuthenticated, (req , res)=>{
    res.sendFile( path.join(html_files , '/bankAcc.html') );
  });
app.get('/gift.html' ,isAuthenticated, (req , res)=>{
    res.sendFile( path.join(html_files , '/gift.html') );
});

app.get('/myproduct.html' ,isAuthenticated, (req , res)=>{
    res.sendFile( path.join(html_files , '/myproduct.html') );
  });
app.get('/paypassword.html' ,isAuthenticated, (req , res)=>{
      res.sendFile( path.join(html_files , '/paypassword.html') );
    });

app.get('/profile.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/profile.html') );
});

app.get('/recharge.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/recharge.html') );
});

app.get('/records.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/records.html') );
});

app.get('/resetpassword.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/resetpassword.html') );
});

app.get('/teams.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/teams.html') );
});

app.get('/withdraw.html' ,isAuthenticated, (req , res)=>{
  res.sendFile( path.join(html_files , '/withdraw.html') );
});

// admin
app.get('/admin_pannel_@123' , (req , res)=>{
  res.sendFile( path.join(html_files , '/admin_page.html') );
});


// getting all the user data;

app.get('/get_inv_code' ,isAuthenticated, user_data.get_inv);

app.get('/purchase_data',isAuthenticated, user_data.get_purchase_data);

app.get('/deposit_data' ,isAuthenticated, user_data.get_deposit_data);

app.get('/withdraw_data' ,isAuthenticated, user_data.get_withdraw_data);

app.get('/income_history' ,isAuthenticated, user_data.get_income_history);

app.get('/members_lev_1' ,isAuthenticated, user_data.get_members_level1);

app.get('/members_lev_2' ,isAuthenticated, user_data.get_members_level2);

app.get('/members_lev_3' ,isAuthenticated, user_data.get_members_level3);

app.get('/teams_data' ,isAuthenticated, user_data.get_team_data);

app.get("/profile_data" ,isAuthenticated, user_data.get_profile_data);

app.get('/logout' , user_data.logout);

// user functions
app.post('/otp' , user_function.otp);

app.post('/change_password_otp' ,user_function.change_password_otp);

app.post('/change_withdraw_code' , user_function.change_withdraw_code);

app.post('/login' , user_function.login_user);

app.post('/signup' , user_function.sign_new_user);

app.post('/item_purchase' ,isAuthenticated,  user_function.purchase);

app.post('/income_redeam' ,isAuthenticated, user_function.daily_income);

app.post("/recharge" ,isAuthenticated, user_function.deposited);

app.post('/withdraw' ,isAuthenticated, user_function.withdraw);

app.post('/change_pass' ,isAuthenticated, user_function.change_password);

app.post('/set_bank_details' ,isAuthenticated, user_function.add_bank_details);


// admin routs
app.post("/settle_withdraw" , user_function.ad_settle_withdraw);

app.post("/settle_deposit" , user_function.ad_settle_deposit);

app.post("/give_inv_bonus" , user_function.ad_give_inv_bonus);
