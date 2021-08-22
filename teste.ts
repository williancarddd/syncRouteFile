import  FileHound  from "filehound";
 FileHound.create()
  .ignoreHiddenFiles()
  .ignoreHiddenDirectories()
  .discard(['.pdf', '.exe', '.py'])
  .ext(['.jpg', '.jpeg', '.png'])
  .find((err, files) => {
    if (err) {
      return console.error(`error: ${err}`);
    }
    // aqui  ele aplica no parâmetro da função o caminho  de tudo que ele achar, em string.
    files.forEach(e => console.log(e));
  })