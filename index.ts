import { Request, Response } from 'express'
import express from 'express'
import morgan from 'morgan'
import filehound from 'filehound'
import cors from 'cors'
import 'dotenv/config';
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Controle-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});
app.use(express.static(`C:\\OpenDentImages`))

async function search_photos(letter: string, name_folder: string): Promise<any> {
  console.log('entrou na função searcchphotos')
  const temp_imgs_name: Array<any> = []
  function action(file: string) {
    console.log(file)
    const path_contente = file.split('\\')
    /*if(path_contente.includes('node_modules') || path_contente.includes('.git')){
      //ignora essa pasta
    } else {
    }*/
    let new_name: Array<string> = []
    for (let framgment_path of path_contente) {
      if (__dirname.split('\\').includes(framgment_path)) { // verifica se o caminho possui partes do diretório absoluto.
      } else {
        new_name.push(framgment_path)
      }
    }
    // log
    temp_imgs_name.push(new_name.join('/').replace(/OpenDentImages\//g, ''))
  }
  try {
    console.log('passou aqui')
    process.chdir(`C:\\OpenDentImages\\${letter}\\${name_folder}`)
    await filehound.create()
      .ignoreHiddenFiles()
      .ignoreHiddenDirectories()
      .discard(['node_modules', 'git', '.json', '.py', '.env', '.js', '.pdf', '.exe'])
      .ext(['.jpg', '.jpeg', 'png'])
      .find((err, files) => {
        if (err) {
          return console.error(`error: ${err}`);
        }
        console.log(files.length)
        // aqui  ele aplica no parâmetro da função o caminho  de tudo que ele achar, em string.
        files.forEach(action);
      })
    console.log('passou aqui 2')

  } catch (err) {
    console.log(err)
  }
  process.chdir(`C:\\OpenDentImages`)

  return temp_imgs_name
}


app.get('/data/:letter/:name_folder', async (req: Request, res: Response) => {
  const { letter, name_folder } = req.params
  console.log(letter)
  console.log(name_folder)
  const result = await search_photos(letter.trim(), name_folder.trim())
  const new_result = []
  console.log(result)
  for (let path_web of result) {
    new_result.push(`http://localhost:${process.env.PORT || 3000}/${path_web}`)
  }
  console.log(new_result)
  return res.send(new_result)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`servidor rodando. 😂 ${process.env.PORT || 3000} pasta: ${process.env.PATH_LISTENNING || '.'}`)
})