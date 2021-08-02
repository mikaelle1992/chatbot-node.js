const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1'); // watson sdk
require('dotenv').config()

const ASSISTANT_IAM_URL = process.env.ASSISTANT_IAM_URL
const ASSISTANT_IAM_APIKEY = process.env.ASSISTANT_IAM_APIKEY 
const chatbot = new watson({
    'version': '2021-08-02',
    'url': ASSISTANT_IAM_URL || '<url>',
    'iam_apikey': ASSISTANT_IAM_APIKEY || '<iam_apikey>',
    'iam_url': 'https://iam.bluemix.net/identity/token'
  });
 
  var payload = {
    workspace_id: process.env.WORKSPACE_ID,
    context: {},
    input: {}
  };
  const workspace_id =payload['workspace_id']
  let fimDeConversa = false;
 
  //Começando a conversação com a mensagem vazia;
  chatbot.message(payload, function trataResposta(err, resposta){
 
    if(err){
        console.log(err);
        return;
    }
    if(resposta.intents.length > 0){
        console.log('Eu detectei a intenção : ' + resposta.intents[0].intent)
      if(resposta.intents[0].intent == 'adeus'){
          fimDeConversa = true
      }
    }
    // exibe a resposta do dialogo,caso exista
    if(resposta.output.text.length > 0){
        console.log(resposta.output.text[0]);
    }

    if(!fimDeConversa){
        console.log(resposta.context)
        const mensagemUsuario = prompt('>>');
        chatbot.message({
                 workspace_id,
                 input:{text:mensagemUsuario} ,
                 context:resposta.context
            },trataResposta);
    }


  });