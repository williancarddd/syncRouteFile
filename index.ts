import {Request, Response} from 'express'
import express from 'express'
import morgan from 'morgan'
import filehound from 'filehound'
import 'dotenv/config';
const app = express()

process.chdir(process.env.PATH_LISTENNING || '.')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(express.static('.'))

async function search_photos(letter:string, name_folder:string): Promise<any> {
  const temp_imgs_name:Array<any> = []
  function action(file: string) {
    const path_contente = file.split('\\')
    /*if(path_contente.includes('node_modules') || path_contente.includes('.git')){
      //ignora essa pasta
    } else {
    }*/
    if(path_contente.includes(letter) && path_contente.includes(name_folder)){
        let new_name: Array<string> = []
        for(let framgment_path of path_contente ){
          if(__dirname.split('\\').includes(framgment_path)){ // verifica se o caminho possui partes do diretório absoluto.
          } else {
            new_name.push(framgment_path) 
          }
        }
      // log
      temp_imgs_name.push(new_name.join('/'))
    }
  }
   await filehound.create()
  .ignoreHiddenFiles()
  .ignoreHiddenDirectories()
  .discard(['node_modules', 'git', '.json', '.py', '.env', '.js'])
  .ext(['.jpg', '.jpeg', 'png'])
  .find((err, files) => {
    if (err) {
      return console.error(`error: ${err}`);
    }
    // aqui  ele aplica no parâmetro da função o caminho  de tudo que ele achar, em string.
    files.forEach(action);
  })
  return temp_imgs_name
}


app.get('/data/:letter/:name_folder', async (req:Request, res:Response)=>{
 const {letter, name_folder} = req.params
 const result = await search_photos(letter.trim(), name_folder.trim() )
 const new_result = []
 for(let path_web of result) {
  new_result.push(`http://localhost:${process.env.PORT || 3000}/${path_web}`)
 }
 return res.json(new_result)
})

app.listen(process.env.PORT || 3000, ()=> {
  console.log('servidor rodando. 😂')
})