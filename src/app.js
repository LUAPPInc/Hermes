const puppeteer = require('puppeteer')
const fs = require('fs')
var directory = process.env.DIRECTORY || 'print'

var links = []
var viewports = [
    {
        name: '16-9',
        resolution:{
            width:1920,
            height:1080
        }
    },
     {
        name: '8:5',
        resolution:{
            width:1280,
            height:800
        }
    },
    {
        name: 'iPad',
        resolution:{
            width:768,
            height:1024,
            isMobile: true
        }
    }
]

const _savePrint = async(page,file) => {
     try {
        fs.statSync(directory)
        return page.screenshot({path: file, fullPage: true})
    } catch(err){
        fs.mkdirSync(directory)
        return page.screenshot({path: file, fullPage: true})
    }finally{
        console.log(`Printing and saving ${file}`);
    }
    
}


const _init  = () => {
    console.log("Initialing Browser...")
    puppeteer.launch().then(async (browser) => {
        console.log("Creating the Page...")
        const page = await browser.newPage();

        for(let viewport of viewports) {
            await page.setViewport(viewport.resolution)
            console.log(`Setting viewport for ${viewport.resolution.width}x${viewport.resolution.height}`)

            for(let link of links){
                let date = new Date()
                let file = `${directory}/${viewport.name}-${date.getTime()}.png`;
                console.log(`Checking the ${link}  in ${viewport.resolution.width}x${viewport.resolution.height}`)

                await page.goto(link,{waitUntil: 'load'}); 
                await _savePrint(page,file)
                
            }
        }
        console.log("Closing the <Browser></Browser>")
        browser.close();
    })
}



for(let arg of process.argv) {
    //Se tiver um parametro de importar um arquivo externo
    if( arg.startsWith('file=')){
        const file = arg.replace('file=','')
        
        //O arquivo importado deve ser do tipo JSON
        if( file.indexOf(".json") === -1) throw new Error("O Arquivo deve ser do tipo JSON")

        fs.readFile(file, 'utf8', (err, data) => {
            //Se não encontrar, dispara o erro
            if(err)  throw err

            //Se encontrar, ele parsea pra dentro do links e inicia o browser
            links = JSON.parse(data);
        })
    }

    //Verifica se existe um arquivo pra salvar as prints
    if( arg.startsWith("folder=") ){
        directory = arg.replace('folder=','')
    }
}

_init()
