require('dotenv').config()
import { AppDataSource } from "./src/dao/data-source"
import Express = require('express')
import { produtosRoutes } from "./src/routes/produtosRoutes"
const app = Express()
import cors = require('cors')
import * as ExpressSession from "express-session";
import { autenticacaoRoutes } from "./src/routes/autenticacaoRoutes"
import { usuarioRoutes } from "./src/routes/usuarioRoutes"
import { funcionalidadesRoutes } from "./src/routes/funcionalidadesRoutes"
import { tipoUsuarioRoutes } from "./src/routes/tipoUsuarioRoutes"
export type SessionRequest = Express.Request & {
    session: [{
            token: string,
            levelAdmin: boolean,
            levelMaster: boolean,
            userId: number;
        },
    ];
  };
const fileStore = require('session-file-store')(ExpressSession)
const Master = require('./src/modules/master')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
export const http = require('http').createServer(app)

app.use(Express.urlencoded({extended: true}))
app.use(Express.json())
app.use(cors({credentials:true, origin:'*'}))
app.use(Express.static(`${__dirname}/public`))
app.use('*/css', Express.static(`${__dirname}/public/css`))
app.use('*/js', Express.static(`${__dirname}/public/js`))
app.use(flash())
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(ExpressSession({
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new fileStore({
        logFn: function(){},
        path: require('path').join(require('os').tmpdir(), 'sale/sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 1800000, //30 minutos em milesegundos
        httpOnly: true,
    },
}))

app.use((req, res, next)=>{ 
    if(req.session["token"]){
        res.locals.session = req.session
    }    
    next()
}) 

app.get('/', (req, res)=>{
    res.status(200).redirect("/entrar")
})

app.use(tipoUsuarioRoutes)
app.use(funcionalidadesRoutes)
app.use(usuarioRoutes)
app.use(autenticacaoRoutes)
app.use(produtosRoutes)
app.use((req, res)=>{
    res.redirect(`/dashboard`)
})

AppDataSource.initialize().then(async () => {
    http.listen(process.env.PORT, async ()=>{
        Master(process.env.ADMIN)
        console.log(`Escutando na porta ${process.env.PORT}`)
    })
}).catch(error => console.log(error))
