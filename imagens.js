import fs from 'fs';
import path from 'path';

const filenames =  fs.readdirSync(path.resolve( 'img'));

const imagens_da_pasta = filenames.map((nomeAtual) => {
   const novoNome = path.resolve( 'img/'+nomeAtual);
    return novoNome;
})


export default imagens_da_pasta;